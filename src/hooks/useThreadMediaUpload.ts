/**
 * useThreadMediaUpload Hook
 * Manages multiple independent media upload instances for Twitter threads
 * Each tweet in a thread can have its own set of media uploads (max 4 per tweet)
 */

import { useState, useCallback, useRef } from 'react'
import { requestUpload, uploadToS3, confirmUpload, deleteMedia } from '@/services/media.service'
import { ApiError } from '@/lib/api-client'
import type { MediaItem, MediaUploadStatus, UploadProgress, MediaType } from '@/types/media'
import { MEDIA_SIZE_LIMITS, ALLOWED_MIME_TYPES } from '@/types/media'

const MAX_IMAGES_PER_TWEET = 4

/**
 * State for a single file upload
 */
export interface FileUploadState {
  id: string
  file: File
  localUrl: string
  type: MediaType
  status: MediaUploadStatus
  progress: UploadProgress
  error: string | null
  mediaId: string | null
  mediaItem: MediaItem | null
}

/**
 * Validation result
 */
interface ValidationResult {
  valid: boolean
  errorKey: string | null
  errorParams?: Record<string, string | number>
}

/**
 * Validate a file before upload
 */
function validateFile(file: File): ValidationResult {
  const isImage = file.type.startsWith('image/')
  const isVideo = file.type.startsWith('video/')

  if (!isImage && !isVideo) {
    return { valid: false, errorKey: 'dashboard.createPost.media.errors.invalidType' }
  }

  const type: MediaType = isImage ? 'image' : 'video'
  const allowedTypes = ALLOWED_MIME_TYPES[type] as readonly string[]

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      errorKey: 'dashboard.createPost.media.errors.mimeNotAllowed',
      errorParams: { type: file.type },
    }
  }

  const maxSize = MEDIA_SIZE_LIMITS[type]
  if (file.size > maxSize) {
    return {
      valid: false,
      errorKey:
        type === 'image'
          ? 'dashboard.createPost.media.errors.imageTooLarge'
          : 'dashboard.createPost.media.errors.videoTooLarge',
      errorParams: { maxSize: maxSize / 1024 / 1024 },
    }
  }

  return { valid: true, errorKey: null }
}

/**
 * Hook return type
 */
export interface UseThreadMediaUploadReturn {
  // State - Map<contextId, Map<uploadId, FileUploadState>>
  uploadsByContext: Map<string, Map<string, FileUploadState>>

  // Actions
  addFilesToContext: (contextId: string, files: FileList | File[]) => string[]
  removeFileFromContext: (contextId: string, uploadId: string) => Promise<void>
  retryUpload: (contextId: string, uploadId: string) => Promise<void>
  cancelUpload: (contextId: string, uploadId: string) => void
  cleanupContext: (contextId: string) => Promise<void>
  reset: () => void

  // Computed per context
  getUploadsArray: (contextId: string) => FileUploadState[]
  getMediaIds: (contextId: string) => string[]
  isContextUploading: (contextId: string) => boolean
  contextHasErrors: (contextId: string) => boolean
  getUploadCount: (contextId: string) => number
  canAddMore: (contextId: string) => boolean

  // Global computed
  isAnyUploading: boolean
  hasAnyErrors: boolean
}

export function useThreadMediaUpload(): UseThreadMediaUploadReturn {
  const [uploadsByContext, setUploadsByContext] = useState<
    Map<string, Map<string, FileUploadState>>
  >(new Map())

  const abortControllersRef = useRef<Map<string, AbortController>>(new Map())

  /**
   * Check if any uploads in a context are in progress
   */
  const checkIsUploading = useCallback((uploads: Map<string, FileUploadState>): boolean => {
    return Array.from(uploads.values()).some((u) =>
      ['requesting', 'uploading', 'confirming'].includes(u.status)
    )
  }, [])

  /**
   * Update a single upload's state within a context
   */
  const updateUpload = useCallback(
    (contextId: string, uploadId: string, updates: Partial<FileUploadState>) => {
      setUploadsByContext((prev) => {
        const newMap = new Map(prev)
        const contextUploads = new Map(newMap.get(contextId) || new Map())
        const existing = contextUploads.get(uploadId)
        if (existing) {
          contextUploads.set(uploadId, { ...existing, ...updates })
          newMap.set(contextId, contextUploads)
        }
        return newMap
      })
    },
    []
  )

  /**
   * Execute the 3-step upload for a single file
   */
  const executeUpload = useCallback(
    async (contextId: string, uploadState: FileUploadState) => {
      const { id, file } = uploadState
      const abortKey = `${contextId}:${id}`
      const abortController = new AbortController()
      abortControllersRef.current.set(abortKey, abortController)

      try {
        // Step 1: Request presigned URL
        updateUpload(contextId, id, { status: 'requesting' })

        const { uploadUrl, mediaId, contentType } = await requestUpload({
          fileName: file.name,
          fileSize: file.size,
          contentType: file.type,
        })

        updateUpload(contextId, id, { mediaId, status: 'uploading' })

        // Step 2: Upload to S3
        await uploadToS3(
          file,
          uploadUrl,
          contentType,
          (progress) => updateUpload(contextId, id, { progress }),
          abortController.signal
        )

        // Step 3: Confirm upload
        updateUpload(contextId, id, { status: 'confirming' })
        const mediaItem = await confirmUpload(mediaId)

        updateUpload(contextId, id, {
          status: 'ready',
          mediaItem,
          progress: { loaded: file.size, total: file.size, percentage: 100 },
        })
      } catch (err) {
        if ((err as Error).message === 'Upload cancelled') {
          return
        }

        const errorMessage =
          err instanceof ApiError ? err.message : (err as Error).message || 'Upload failed'

        updateUpload(contextId, id, { status: 'error', error: errorMessage })
      } finally {
        abortControllersRef.current.delete(abortKey)
      }
    },
    [updateUpload]
  )

  /**
   * Add files to a specific context and start uploading
   */
  const addFilesToContext = useCallback(
    (contextId: string, files: FileList | File[]): string[] => {
      const fileArray = Array.from(files)
      const addedIds: string[] = []
      const newUploadStates: FileUploadState[] = []

      // Get current count for this context
      const currentUploads = uploadsByContext.get(contextId)
      const currentCount = currentUploads?.size || 0
      const remainingSlots = MAX_IMAGES_PER_TWEET - currentCount

      // Only add files up to the limit
      const filesToAdd = fileArray.slice(0, remainingSlots)

      filesToAdd.forEach((file) => {
        const validation = validateFile(file)
        const id = crypto.randomUUID()
        addedIds.push(id)

        const uploadState: FileUploadState = {
          id,
          file,
          localUrl: URL.createObjectURL(file),
          type: file.type.startsWith('video/') ? 'video' : 'image',
          status: validation.valid ? 'pending' : 'error',
          progress: { loaded: 0, total: file.size, percentage: 0 },
          error: validation.valid ? null : validation.errorKey,
          mediaId: null,
          mediaItem: null,
        }

        newUploadStates.push(uploadState)
      })

      setUploadsByContext((prev) => {
        const newMap = new Map(prev)
        const contextUploads = new Map(newMap.get(contextId) || new Map())
        newUploadStates.forEach((uploadState) => {
          contextUploads.set(uploadState.id, uploadState)
        })
        newMap.set(contextId, contextUploads)
        return newMap
      })

      // Start uploads for valid files
      newUploadStates
        .filter((u) => u.status === 'pending')
        .forEach((u) => executeUpload(contextId, u))

      return addedIds
    },
    [uploadsByContext, executeUpload]
  )

  /**
   * Remove a file from a context
   */
  const removeFileFromContext = useCallback(
    async (contextId: string, uploadId: string) => {
      const contextUploads = uploadsByContext.get(contextId)
      const upload = contextUploads?.get(uploadId)
      if (!upload) return

      // Cancel if still uploading
      const abortKey = `${contextId}:${uploadId}`
      abortControllersRef.current.get(abortKey)?.abort()
      abortControllersRef.current.delete(abortKey)

      // Revoke object URL
      URL.revokeObjectURL(upload.localUrl)

      // Delete from backend if it was uploaded
      if (upload.mediaId && upload.status === 'ready') {
        try {
          await deleteMedia(upload.mediaId)
        } catch (err) {
          console.error('Failed to delete media from backend:', err)
        }
      }

      setUploadsByContext((prev) => {
        const newMap = new Map(prev)
        const contextUploads = new Map(newMap.get(contextId) || new Map())
        contextUploads.delete(uploadId)
        if (contextUploads.size === 0) {
          newMap.delete(contextId)
        } else {
          newMap.set(contextId, contextUploads)
        }
        return newMap
      })
    },
    [uploadsByContext]
  )

  /**
   * Retry a failed upload
   */
  const retryUpload = useCallback(
    async (contextId: string, uploadId: string) => {
      const contextUploads = uploadsByContext.get(contextId)
      const upload = contextUploads?.get(uploadId)
      if (!upload || upload.status !== 'error') return

      const validation = validateFile(upload.file)
      if (!validation.valid) {
        updateUpload(contextId, uploadId, { status: 'error', error: validation.errorKey })
        return
      }

      updateUpload(contextId, uploadId, {
        status: 'pending',
        error: null,
        progress: { loaded: 0, total: upload.file.size, percentage: 0 },
        mediaId: null,
        mediaItem: null,
      })

      await executeUpload(contextId, { ...upload, status: 'pending', error: null })
    },
    [uploadsByContext, updateUpload, executeUpload]
  )

  /**
   * Cancel a specific upload
   */
  const cancelUpload = useCallback((contextId: string, uploadId: string) => {
    const abortKey = `${contextId}:${uploadId}`
    abortControllersRef.current.get(abortKey)?.abort()
  }, [])

  /**
   * Cleanup all uploads for a context (when tweet is removed)
   */
  const cleanupContext = useCallback(
    async (contextId: string) => {
      const contextUploads = uploadsByContext.get(contextId)
      if (!contextUploads) return

      // Cancel and cleanup all uploads in this context
      for (const [uploadId, upload] of contextUploads) {
        const abortKey = `${contextId}:${uploadId}`
        abortControllersRef.current.get(abortKey)?.abort()
        abortControllersRef.current.delete(abortKey)
        URL.revokeObjectURL(upload.localUrl)

        if (upload.mediaId && upload.status === 'ready') {
          try {
            await deleteMedia(upload.mediaId)
          } catch (err) {
            console.error('Failed to delete media from backend:', err)
          }
        }
      }

      setUploadsByContext((prev) => {
        const newMap = new Map(prev)
        newMap.delete(contextId)
        return newMap
      })
    },
    [uploadsByContext]
  )

  /**
   * Reset all state
   */
  const reset = useCallback(() => {
    abortControllersRef.current.forEach((controller) => controller.abort())
    abortControllersRef.current.clear()

    uploadsByContext.forEach((contextUploads) => {
      contextUploads.forEach((upload) => {
        URL.revokeObjectURL(upload.localUrl)
      })
    })

    setUploadsByContext(new Map())
  }, [uploadsByContext])

  // Computed values per context
  const getUploadsArray = useCallback(
    (contextId: string): FileUploadState[] => {
      const contextUploads = uploadsByContext.get(contextId)
      return contextUploads ? Array.from(contextUploads.values()) : []
    },
    [uploadsByContext]
  )

  const getMediaIds = useCallback(
    (contextId: string): string[] => {
      const uploads = getUploadsArray(contextId)
      return uploads.filter((u) => u.status === 'ready' && u.mediaItem).map((u) => u.mediaItem!.id)
    },
    [getUploadsArray]
  )

  const isContextUploading = useCallback(
    (contextId: string): boolean => {
      const contextUploads = uploadsByContext.get(contextId)
      return contextUploads ? checkIsUploading(contextUploads) : false
    },
    [uploadsByContext, checkIsUploading]
  )

  const contextHasErrors = useCallback(
    (contextId: string): boolean => {
      const uploads = getUploadsArray(contextId)
      return uploads.some((u) => u.status === 'error')
    },
    [getUploadsArray]
  )

  const getUploadCount = useCallback(
    (contextId: string): number => {
      const contextUploads = uploadsByContext.get(contextId)
      return contextUploads?.size || 0
    },
    [uploadsByContext]
  )

  const canAddMore = useCallback(
    (contextId: string): boolean => {
      return getUploadCount(contextId) < MAX_IMAGES_PER_TWEET
    },
    [getUploadCount]
  )

  // Global computed values
  const isAnyUploading = Array.from(uploadsByContext.values()).some(checkIsUploading)

  const hasAnyErrors = Array.from(uploadsByContext.values()).some((contextUploads) =>
    Array.from(contextUploads.values()).some((u) => u.status === 'error')
  )

  return {
    uploadsByContext,
    addFilesToContext,
    removeFileFromContext,
    retryUpload,
    cancelUpload,
    cleanupContext,
    reset,
    getUploadsArray,
    getMediaIds,
    isContextUploading,
    contextHasErrors,
    getUploadCount,
    canAddMore,
    isAnyUploading,
    hasAnyErrors,
  }
}
