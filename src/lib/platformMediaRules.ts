/**
 * Platform Media Rules
 * Centralized configuration for platform-specific media constraints
 */

import type { SocialPlatform } from '@/types/connections'

export interface PlatformMediaRules {
  maxImageSize: number // in bytes
  maxVideoSize: number // in bytes
  maxImages: number // per post
  maxVideos: number // per post
  allowMixedMedia: boolean // can mix images and videos
}

/**
 * Default media rules (used as fallback)
 */
export const DEFAULT_MEDIA_RULES: PlatformMediaRules = {
  maxImageSize: 10 * 1024 * 1024, // 10MB
  maxVideoSize: 100 * 1024 * 1024, // 100MB
  maxImages: 10,
  maxVideos: 1,
  allowMixedMedia: true,
}

/**
 * Platform-specific media rules
 */
export const PLATFORM_MEDIA_RULES: Partial<Record<SocialPlatform, PlatformMediaRules>> = {
  linkedin: {
    maxImageSize: 5 * 1024 * 1024, // 5MB
    maxVideoSize: 200 * 1024 * 1024, // 200MB
    maxImages: 20,
    maxVideos: 1,
    allowMixedMedia: false, // Cannot mix images and videos
  },
}

/**
 * Get media rules for a specific platform
 */
export function getPlatformMediaRules(platform: SocialPlatform): PlatformMediaRules {
  return PLATFORM_MEDIA_RULES[platform] || DEFAULT_MEDIA_RULES
}

/**
 * Get the most restrictive rules when multiple platforms are selected
 */
export function getMostRestrictiveRules(platforms: SocialPlatform[]): PlatformMediaRules {
  if (platforms.length === 0) {
    return DEFAULT_MEDIA_RULES
  }

  const allRules = platforms.map(getPlatformMediaRules)

  return {
    maxImageSize: Math.min(...allRules.map((r) => r.maxImageSize)),
    maxVideoSize: Math.min(...allRules.map((r) => r.maxVideoSize)),
    maxImages: Math.min(...allRules.map((r) => r.maxImages)),
    maxVideos: Math.min(...allRules.map((r) => r.maxVideos)),
    allowMixedMedia: allRules.every((r) => r.allowMixedMedia),
  }
}

/**
 * Media validation result
 */
export interface MediaValidationResult {
  valid: boolean
  errorKey: string | null
  errorParams?: Record<string, string | number>
}

/**
 * Validate media against platform rules
 */
export function validateMediaForPlatforms(
  file: File,
  existingMedia: { type: 'image' | 'video' }[],
  platforms: SocialPlatform[]
): MediaValidationResult {
  const rules = getMostRestrictiveRules(platforms)
  const isImage = file.type.startsWith('image/')
  const isVideo = file.type.startsWith('video/')

  if (!isImage && !isVideo) {
    return { valid: false, errorKey: 'dashboard.createPost.media.errors.invalidType' }
  }

  // Check size limits
  if (isImage && file.size > rules.maxImageSize) {
    return {
      valid: false,
      errorKey: 'dashboard.createPost.media.errors.imageTooLarge',
      errorParams: { maxSize: Math.round(rules.maxImageSize / 1024 / 1024) },
    }
  }

  if (isVideo && file.size > rules.maxVideoSize) {
    return {
      valid: false,
      errorKey: 'dashboard.createPost.media.errors.videoTooLarge',
      errorParams: { maxSize: Math.round(rules.maxVideoSize / 1024 / 1024) },
    }
  }

  // Check mixed media
  if (!rules.allowMixedMedia) {
    const hasExistingImages = existingMedia.some((m) => m.type === 'image')
    const hasExistingVideos = existingMedia.some((m) => m.type === 'video')

    if ((isImage && hasExistingVideos) || (isVideo && hasExistingImages)) {
      return {
        valid: false,
        errorKey: 'dashboard.createPost.media.errors.mixedMediaNotAllowed',
      }
    }
  }

  // Check count limits
  const currentImageCount = existingMedia.filter((m) => m.type === 'image').length
  const currentVideoCount = existingMedia.filter((m) => m.type === 'video').length

  if (isImage && currentImageCount >= rules.maxImages) {
    return {
      valid: false,
      errorKey: 'dashboard.createPost.media.errors.tooManyImages',
      errorParams: { max: rules.maxImages },
    }
  }

  if (isVideo && currentVideoCount >= rules.maxVideos) {
    return {
      valid: false,
      errorKey: 'dashboard.createPost.media.errors.tooManyVideos',
      errorParams: { max: rules.maxVideos },
    }
  }

  return { valid: true, errorKey: null }
}
