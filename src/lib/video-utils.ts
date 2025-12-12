/**
 * Video Utilities
 * Functions for extracting frames from video elements
 */

/**
 * Extract the current frame from a video element as a JPEG Blob
 * @param video - The HTML video element to extract from
 * @param quality - JPEG quality (0-1), defaults to 0.92
 * @returns Promise<Blob> - The extracted frame as a JPEG blob
 */
export async function extractVideoFrame(
  video: HTMLVideoElement,
  quality: number = 0.92
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Failed to get canvas context'))
        return
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('Failed to extract frame from video'))
          }
        },
        'image/jpeg',
        quality
      )
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * Convert a Blob to a File with thumbnail naming convention
 * @param blob - The image blob
 * @param originalVideoName - The original video filename (for naming the thumbnail)
 * @returns File - A File object ready for upload
 */
export function blobToThumbnailFile(blob: Blob, originalVideoName: string): File {
  // Remove extension from original video name
  const baseName = originalVideoName.replace(/\.[^/.]+$/, '')
  // Create thumbnail filename
  const thumbnailName = `${baseName}_thumbnail_${Date.now()}.jpg`

  return new File([blob], thumbnailName, { type: 'image/jpeg' })
}

/**
 * Format seconds to MM:SS display format
 * @param seconds - Time in seconds
 * @returns string - Formatted time string (e.g., "1:23")
 */
export function formatVideoTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
