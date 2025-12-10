/**
 * Media Service
 * Handles API calls for media upload and management
 */

import { apiClient } from '@/lib/api-client'
import type {
  RequestUploadParams,
  UploadRequestResponse,
  MediaItem,
  MediaListResponse,
  MediaListParams,
  UploadProgress,
} from '@/types/media'

/**
 * Sanitize filename to only contain allowed characters
 * Allowed: letters, numbers, dots, underscores, and hyphens
 */
function sanitizeFileName(fileName: string): string {
  // Get the extension
  const lastDotIndex = fileName.lastIndexOf('.')
  const hasExtension = lastDotIndex > 0
  const name = hasExtension ? fileName.slice(0, lastDotIndex) : fileName
  const extension = hasExtension ? fileName.slice(lastDotIndex) : ''

  // Replace accented characters with their base equivalents
  const normalized = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove diacritics

  // Replace spaces and disallowed characters with underscores
  const sanitized = normalized
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .replace(/[^a-zA-Z0-9._-]/g, '_') // Replace other invalid chars with underscore
    .replace(/_+/g, '_') // Collapse multiple underscores
    .replace(/^_|_$/g, '') // Trim underscores from start/end

  // Ensure we have a valid name
  const finalName = sanitized || `file_${Date.now()}`

  return finalName + extension
}

const ENDPOINTS = {
  requestUpload: '/api/media/request-upload',
  confirmUpload: '/api/media/confirm-upload',
  media: '/api/media',
  mediaById: (id: string) => `/api/media/${id}`,
  downloadUrl: (id: string) => `/api/media/${id}/download-url`,
} as const

/**
 * Request presigned upload URL from backend
 */
export async function requestUpload(params: RequestUploadParams): Promise<UploadRequestResponse> {
  return apiClient.post<UploadRequestResponse>(ENDPOINTS.requestUpload, {
    ...params,
    fileName: sanitizeFileName(params.fileName),
  })
}

/**
 * Upload file directly to S3 using presigned URL
 * Uses XMLHttpRequest for progress tracking
 */
export function uploadToS3(
  file: File,
  uploadUrl: string,
  contentType: string,
  onProgress?: (progress: UploadProgress) => void,
  signal?: AbortSignal
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    // Handle abort signal
    if (signal) {
      signal.addEventListener('abort', () => {
        xhr.abort()
        reject(new Error('Upload cancelled'))
      })
    }

    // Progress tracking
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress({
          loaded: event.loaded,
          total: event.total,
          percentage: Math.round((event.loaded / event.total) * 100),
        })
      }
    })

    // Success
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve()
      } else {
        reject(new Error(`S3 upload failed with status ${xhr.status}`))
      }
    })

    // Error
    xhr.addEventListener('error', () => {
      reject(new Error('Network error during upload'))
    })

    // Abort
    xhr.addEventListener('abort', () => {
      reject(new Error('Upload was cancelled'))
    })

    // Send request
    xhr.open('PUT', uploadUrl)
    xhr.setRequestHeader('Content-Type', contentType)
    xhr.send(file)
  })
}

/**
 * Confirm upload completion with backend
 */
export async function confirmUpload(mediaId: string): Promise<MediaItem> {
  return apiClient.post<MediaItem>(ENDPOINTS.confirmUpload, { mediaId })
}

/**
 * List user's media with optional filters
 */
export async function getMedia(params?: MediaListParams): Promise<MediaListResponse> {
  const searchParams = new URLSearchParams()
  if (params?.status) searchParams.set('status', params.status)
  if (params?.type) searchParams.set('type', params.type)
  if (params?.limit) searchParams.set('limit', params.limit.toString())
  if (params?.offset) searchParams.set('offset', params.offset.toString())

  const query = searchParams.toString()
  return apiClient.get<MediaListResponse>(`${ENDPOINTS.media}${query ? `?${query}` : ''}`)
}

/**
 * Get single media item
 */
export async function getMediaById(id: string): Promise<MediaItem> {
  return apiClient.get<MediaItem>(ENDPOINTS.mediaById(id))
}

/**
 * Delete media item
 */
export async function deleteMedia(id: string): Promise<void> {
  return apiClient.delete<void>(ENDPOINTS.mediaById(id))
}

/**
 * Media service object (alternative API)
 */
export const mediaService = {
  requestUpload,
  uploadToS3,
  confirmUpload,
  getAll: getMedia,
  getById: getMediaById,
  delete: deleteMedia,
}
