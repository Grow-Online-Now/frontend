/**
 * Platform Configuration
 * Centralized configuration for social platforms in the create post flows
 */

import type { SocialPlatform } from '@/types/connections'
import type { TextPlatformConfig, ScheduleOption } from '@/types/create'

/**
 * Platforms that support text-first posting (text is primary, media optional)
 */
export const TEXT_FIRST_PLATFORMS: SocialPlatform[] = ['twitter', 'linkedin', 'facebook']

/**
 * Platforms that require media (media is primary, caption secondary)
 */
export const MEDIA_FIRST_PLATFORMS: SocialPlatform[] = [
  'instagram',
  'tiktok',
  'youtube',
  'pinterest',
]

/**
 * Platform configuration with character limits and capabilities
 */
export const PLATFORM_CONFIG: Record<SocialPlatform, TextPlatformConfig> = {
  twitter: {
    platform: 'twitter',
    characterLimit: 280,
    supportsTextOnly: true,
    supportsMedia: true,
  },
  linkedin: {
    platform: 'linkedin',
    characterLimit: 3000,
    supportsTextOnly: true,
    supportsMedia: true,
  },
  facebook: {
    platform: 'facebook',
    characterLimit: 63206,
    supportsTextOnly: true,
    supportsMedia: true,
  },
  instagram: {
    platform: 'instagram',
    characterLimit: 2200,
    supportsTextOnly: false,
    supportsMedia: true,
  },
  tiktok: {
    platform: 'tiktok',
    characterLimit: 2200,
    supportsTextOnly: false,
    supportsMedia: true,
  },
  youtube: {
    platform: 'youtube',
    characterLimit: 5000,
    supportsTextOnly: false,
    supportsMedia: true,
  },
  pinterest: {
    platform: 'pinterest',
    characterLimit: 500,
    supportsTextOnly: false,
    supportsMedia: true,
  },
  bluesky: {
    platform: 'bluesky',
    characterLimit: 280,
    supportsTextOnly: true,
    supportsMedia: true,
  },
  threads: {
    platform: 'threads',
    characterLimit: 280,
    supportsTextOnly: true,
    supportsMedia: true,
  },
}

/**
 * Platforms to show in the character count bar (Step 1)
 * Shows the most restrictive platforms first
 */
export const CHARACTER_COUNT_PLATFORMS: SocialPlatform[] = ['twitter', 'linkedin']

/**
 * Schedule options for Step 3
 */
export const SCHEDULE_OPTIONS: ScheduleOption[] = [
  {
    type: 'now',
    labelKey: 'dashboard.create.text.schedule.now.label',
    descriptionKey: 'dashboard.create.text.schedule.now.description',
    iconName: 'Zap',
  },
  {
    type: 'best',
    labelKey: 'dashboard.create.text.schedule.best.label',
    descriptionKey: 'dashboard.create.text.schedule.best.description',
    iconName: 'Sparkles',
  },
  {
    type: 'scheduled',
    labelKey: 'dashboard.create.text.schedule.scheduled.label',
    descriptionKey: 'dashboard.create.text.schedule.scheduled.description',
    iconName: 'Calendar',
  },
]

/**
 * Get character limit for a platform
 */
export function getCharacterLimit(platform: SocialPlatform): number {
  return PLATFORM_CONFIG[platform].characterLimit
}

/**
 * Check if content exceeds platform limit
 */
export function isOverLimit(content: string, platform: SocialPlatform): boolean {
  return content.length > getCharacterLimit(platform)
}

/**
 * Check if content is near platform limit (90%+)
 */
export function isNearLimit(content: string, platform: SocialPlatform): boolean {
  const limit = getCharacterLimit(platform)
  return content.length >= limit * 0.9 && content.length <= limit
}

/**
 * Calculate percentage of limit used
 */
export function getLimitPercentage(content: string, platform: SocialPlatform): number {
  const limit = getCharacterLimit(platform)
  return Math.round((content.length / limit) * 100)
}
