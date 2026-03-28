/**
 * useMediaUpload Hook
 * Manages media upload state for individual and multiple files
 * Handles the 3-step upload flow: request URL -> upload to S3 -> confirm
 */

import { useState, useCallback, useRef } from 'react'
import { requestUpload, uploadToS3, confirmUpload, deleteMedia } from '@/services/media.service'
import { ApiError, isLimitError } from '@/lib/api-client'
import type { LimitErrorData } from '@/types/subscription'
import type { MediaItem, MediaUploadStatus, UploadProgress, MediaType } from '@/types/media'
import { MEDIA_SIZE_LIMITS, ALLOWED_MIME_TYPES } from '@/types/media'

/**
 * State for a single file upload
 */
export interface FileUploadState {
  id: string // Local ID (crypto.randomUUID)
  file: File
  localUrl: string // Object URL for preview
  type: MediaType
  status: MediaUploadStatus
  progress: UploadProgress
  error: string | null
  mediaId: string | null // Backend media ID after request-upload
  mediaItem: MediaItem | null // Full media item after confirmation
  isFromLibrary: boolean // True if added from media library (don't delete on remove)
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
 * Hook state
 */
interface UseMediaUploadState {
  uploads: Map<string, FileUploadState>
  isUploading: boolean
}

/**
 * Hook return type
 */
export interface UseMediaUploadReturn {
  // State
  uploads: Map<string, FileUploadState>
  isUploading: boolean

  // Actions
  addFiles: (files: FileList | File[]) => string[]
  addPreloadedMedia: (mediaItem: MediaItem) => string
  removeFile: (id: string) => Promise<void>
  retryUpload: (id: string) => Promise<void>
  cancelUpload: (id: string) => void
  cancelAll: () => void
  reset: () => void

  // Computed
  uploadsArray: FileUploadState[]
  completedUploads: FileUploadState[]
  failedUploads: FileUploadState[]
  pendingUploads: FileUploadState[]
  totalProgress: number

  // For form submission
  getMediaIds: () => string[]
  getMediaUrls: () => string[]
  allUploadsComplete: boolean
  hasErrors: boolean
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

export function useMediaUpload(options?: {
  onLimitError?: (error: LimitErrorData) => void
}): UseMediaUploadReturn {
  const [state, setState] = useState<UseMediaUploadState>({
    uploads: new Map(),
    isUploading: false,
  })

  const abortControllersRef = useRef<Map<string, AbortController>>(new Map())

  /**
   * Check if any uploads are in progress
   */
  const checkIsUploading = useCallback((uploads: Map<string, FileUploadState>): boolean => {
    return Array.from(uploads.values()).some((u) =>
      ['requesting', 'uploading', 'confirming'].includes(u.status)
    )
  }, [])

  /**
   * Update a single upload's state
   */
  const updateUpload = useCallback(
    (id: string, updates: Partial<FileUploadState>) => {
      setState((prev) => {
        const newUploads = new Map(prev.uploads)
        const existing = newUploads.get(id)
        if (existing) {
          newUploads.set(id, { ...existing, ...updates })
        }
        return {
          uploads: newUploads,
          isUploading: checkIsUploading(newUploads),
        }
      })
    },
    [checkIsUploading]
  )

  /**
   * Execute the 3-step upload for a single file
   */
  const executeUpload = useCallback(
    async (uploadState: FileUploadState) => {
      const { id, file } = uploadState
      const abortController = new AbortController()
      abortControllersRef.current.set(id, abortController)

      try {
        // Step 1: Request presigned URL
        updateUpload(id, { status: 'requesting' })

        const { uploadUrl, mediaId, contentType } = await requestUpload({
          fileName: file.name,
          fileSize: file.size,
          contentType: file.type,
        })

        updateUpload(id, { mediaId, status: 'uploading' })

        // Step 2: Upload to S3
        await uploadToS3(
          file,
          uploadUrl,
          contentType,
          (progress) => updateUpload(id, { progress }),
          abortController.signal
        )

        // Step 3: Confirm upload
        updateUpload(id, { status: 'confirming' })
        const mediaItem = await confirmUpload(mediaId)

        updateUpload(id, {
          status: 'ready',
          mediaItem,
          progress: { loaded: file.size, total: file.size, percentage: 100 },
        })
      } catch (err) {
        if ((err as Error).message === 'Upload cancelled') {
          return // Don't update state for cancelled uploads
        }

        if (isLimitError(err) && options?.onLimitError) {
          options.onLimitError(err.data as LimitErrorData)
          updateUpload(id, { status: 'error', error: err.data.message as string })
          return
        }

        const errorMessage =
          err instanceof ApiError ? err.message : (err as Error).message || 'Upload failed'

        updateUpload(id, { status: 'error', error: errorMessage })
      } finally {
        abortControllersRef.current.delete(id)
      }
    },
    [updateUpload]
  )

  /**
   * Add files and start uploading
   */
  const addFiles = useCallback(
    (files: FileList | File[]): string[] => {
      const fileArray = Array.from(files)
      const addedIds: string[] = []
      const newUploadStates: FileUploadState[] = []

      fileArray.forEach((file) => {
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
          isFromLibrary: false,
        }

        newUploadStates.push(uploadState)
      })

      setState((prev) => {
        const newUploads = new Map(prev.uploads)
        newUploadStates.forEach((uploadState) => {
          newUploads.set(uploadState.id, uploadState)
        })
        return { uploads: newUploads, isUploading: true }
      })

      // Start uploads for valid files
      newUploadStates.filter((u) => u.status === 'pending').forEach((u) => executeUpload(u))

      return addedIds
    },
    [executeUpload]
  )

  /**
   * Add an already-uploaded media item (from media library)
   */
  const addPreloadedMedia = useCallback(
    (mediaItem: MediaItem): string => {
      const id = crypto.randomUUID()

      // Create a dummy file object for the state (not used since already uploaded)
      const dummyFile = new File([], mediaItem.fileName, { type: mediaItem.contentType })

      const uploadState: FileUploadState = {
        id,
        file: dummyFile,
        localUrl: mediaItem.url || '',
        type: mediaItem.mediaType,
        status: 'ready',
        progress: { loaded: mediaItem.fileSize, total: mediaItem.fileSize, percentage: 100 },
        error: null,
        mediaId: mediaItem.id,
        mediaItem,
        isFromLibrary: true,
      }

      setState((prev) => {
        const newUploads = new Map(prev.uploads)
        newUploads.set(id, uploadState)
        return {
          uploads: newUploads,
          isUploading: checkIsUploading(newUploads),
        }
      })

      return id
    },
    [checkIsUploading]
  )

  /**
   * Remove a file (and delete from backend if uploaded)
   */
  const removeFile = useCallback(
    async (id: string) => {
      const upload = state.uploads.get(id)
      if (!upload) return

      // Cancel if still uploading
      abortControllersRef.current.get(id)?.abort()
      abortControllersRef.current.delete(id)

      // Revoke object URL (only for locally created URLs, not library URLs)
      if (!upload.isFromLibrary) {
        URL.revokeObjectURL(upload.localUrl)
      }

      // Delete from backend only if it was freshly uploaded (not from library)
      if (upload.mediaId && upload.status === 'ready' && !upload.isFromLibrary) {
        try {
          await deleteMedia(upload.mediaId)
        } catch (err) {
          console.error('Failed to delete media from backend:', err)
        }
      }

      setState((prev) => {
        const newUploads = new Map(prev.uploads)
        newUploads.delete(id)
        return {
          uploads: newUploads,
          isUploading: checkIsUploading(newUploads),
        }
      })
    },
    [state.uploads, checkIsUploading]
  )

  /**
   * Retry a failed upload
   */
  const retryUpload = useCallback(
    async (id: string) => {
      const upload = state.uploads.get(id)
      if (!upload || upload.status !== 'error') return

      // Re-validate in case something changed
      const validation = validateFile(upload.file)
      if (!validation.valid) {
        updateUpload(id, { status: 'error', error: validation.errorKey })
        return
      }

      updateUpload(id, {
        status: 'pending',
        error: null,
        progress: { loaded: 0, total: upload.file.size, percentage: 0 },
        mediaId: null,
        mediaItem: null,
      })

      await executeUpload({ ...upload, status: 'pending', error: null })
    },
    [state.uploads, updateUpload, executeUpload]
  )

  /**
   * Cancel a specific upload
   */
  const cancelUpload = useCallback((id: string) => {
    abortControllersRef.current.get(id)?.abort()
  }, [])

  /**
   * Cancel all uploads
   */
  const cancelAll = useCallback(() => {
    abortControllersRef.current.forEach((controller) => controller.abort())
  }, [])

  /**
   * Reset all state
   */
  const reset = useCallback(() => {
    cancelAll()
    state.uploads.forEach((upload) => {
      URL.revokeObjectURL(upload.localUrl)
    })
    setState({ uploads: new Map(), isUploading: false })
  }, [cancelAll, state.uploads])

  // Computed values
  const uploadsArray = Array.from(state.uploads.values())
  const completedUploads = uploadsArray.filter((u) => u.status === 'ready')
  const failedUploads = uploadsArray.filter((u) => u.status === 'error')
  const pendingUploads = uploadsArray.filter((u) =>
    ['pending', 'requesting', 'uploading', 'confirming'].includes(u.status)
  )

  const totalProgress =
    uploadsArray.length > 0
      ? uploadsArray.reduce((sum, u) => sum + u.progress.percentage, 0) / uploadsArray.length
      : 0

  const getMediaIds = useCallback(
    () => completedUploads.map((u) => u.mediaItem!.id),
    [completedUploads]
  )

  const getMediaUrls = useCallback(
    () => completedUploads.map((u) => u.mediaItem!.url!).filter(Boolean),
    [completedUploads]
  )

  return {
    uploads: state.uploads,
    isUploading: state.isUploading,
    addFiles,
    addPreloadedMedia,
    removeFile,
    retryUpload,
    cancelUpload,
    cancelAll,
    reset,
    uploadsArray,
    completedUploads,
    failedUploads,
    pendingUploads,
    totalProgress,
    getMediaIds,
    getMediaUrls,
    allUploadsComplete:
      uploadsArray.length > 0 && pendingUploads.length === 0 && failedUploads.length === 0,
    hasErrors: failedUploads.length > 0,
  }
}
