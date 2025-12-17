/**
 * Create Post Types
 * Types for the new text-first and media-first post creation flows
 */

import type { SocialPlatform } from './connections'
import type { FileUploadState } from '@/hooks/useMediaUpload'

/**
 * Text flow step states (1 = Write + Select Accounts, 2 = Schedule)
 */
export type TextFlowStep = 1 | 2

/**
 * Schedule type options for the text flow
 */
export type TextFlowScheduleType = 'now' | 'best' | 'scheduled'

/**
 * Platform with validation state for display in platform selector
 */
export interface PlatformWithValidation {
  id: string
  platform: SocialPlatform
  displayName: string | null
  platformUsername: string
  avatarUrl?: string | null
  characterCount: number
  characterLimit: number
  isOverLimit: boolean
  isNearLimit: boolean
  isValid: boolean
}

/**
 * Validation warning type
 */
export type ValidationWarningType = 'over_limit' | 'near_limit' | 'media_required'

/**
 * Validation warning for display
 */
export interface ValidationWarning {
  platform: SocialPlatform
  platformId: string
  type: ValidationWarningType
  messageKey: string
  messageParams?: Record<string, string | number>
  excessCharacters?: number
}

/**
 * Text flow complete state
 */
export interface TextFlowState {
  step: TextFlowStep
  content: string
  media: FileUploadState[]
  selectedPlatformIds: string[]
  scheduleType: TextFlowScheduleType
  scheduledDate: Date | null
}

/**
 * Platform configuration for text-first flow
 */
export interface TextPlatformConfig {
  platform: SocialPlatform
  characterLimit: number
  supportsTextOnly: boolean
  supportsMedia: boolean
}

/**
 * Schedule option configuration
 */
export interface ScheduleOption {
  type: TextFlowScheduleType
  labelKey: string
  descriptionKey: string
  iconName: 'Zap' | 'Sparkles' | 'Calendar'
}

/**
 * Media file for display in the composer
 * Simplified version for component props
 */
export interface ComposerMediaFile {
  id: string
  url: string
  type: 'image' | 'video'
  status: 'pending' | 'uploading' | 'ready' | 'error'
  progress?: number
  error?: string | null
}
