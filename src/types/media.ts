/**
 * Media Types
 * Types for media upload and management
 */

/**
 * Allowed media types
 */
export type MediaType = 'image' | 'video'

/**
 * Media upload status
 */
export type MediaUploadStatus =
  | 'pending' // File selected, not started
  | 'requesting' // Getting presigned URL
  | 'uploading' // Uploading to S3
  | 'confirming' // Confirming with backend
  | 'ready' // Upload complete
  | 'error' // Upload failed

/**
 * Upload progress information
 */
export interface UploadProgress {
  loaded: number
  total: number
  percentage: number
}

/**
 * Request to get presigned upload URL
 */
export interface RequestUploadParams {
  fileName: string
  fileSize: number
  contentType: string
  expiresIn?: number // 60-3600 seconds, default 3600
}

/**
 * Response from request-upload endpoint
 */
export interface UploadRequestResponse {
  uploadUrl: string
  mediaId: string
  key: string
  contentType: string
  expiresAt: string
}

/**
 * Media item from backend
 */
export interface MediaItem {
  id: string
  fileName: string
  fileSize: number
  contentType: string
  mediaType: MediaType
  status: 'pending' | 'ready' | 'failed'
  url: string | null
  createdAt: string
}

/**
 * Response from listing media
 */
export interface MediaListResponse {
  media: MediaItem[]
  total: number
}

/**
 * Query params for listing media
 */
export interface MediaListParams {
  status?: 'pending' | 'ready' | 'failed'
  type?: MediaType
  limit?: number
  offset?: number
}

/**
 * File size limits in bytes
 */
export const MEDIA_SIZE_LIMITS = {
  image: 10 * 1024 * 1024, // 10MB
  video: 100 * 1024 * 1024, // 100MB
} as const

/**
 * Allowed MIME types
 */
export const ALLOWED_MIME_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] as const,
  video: ['video/mp4', 'video/quicktime', 'video/webm'] as const,
} as const

/**
 * All allowed MIME types flattened
 */
export const ALL_ALLOWED_MIME_TYPES = [
  ...ALLOWED_MIME_TYPES.image,
  ...ALLOWED_MIME_TYPES.video,
] as const

/**
 * Type for allowed image MIME types
 */
export type AllowedImageMimeType = (typeof ALLOWED_MIME_TYPES.image)[number]

/**
 * Type for allowed video MIME types
 */
export type AllowedVideoMimeType = (typeof ALLOWED_MIME_TYPES.video)[number]

/**
 * Type for all allowed MIME types
 */
export type AllowedMimeType = AllowedImageMimeType | AllowedVideoMimeType
