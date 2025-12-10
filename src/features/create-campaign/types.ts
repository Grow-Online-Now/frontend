/**
 * Campaign Types
 * Types for the Create Campaign feature with multi-platform posting
 */

import type { SocialPlatform, Connection } from '@/types/connections'
import type { MediaItem, MediaType } from '@/types/media'
import type { ScheduleType, PlatformConfigurations } from '@/types/posts'

/**
 * Media asset in the campaign's asset library
 */
export interface MediaAsset {
  id: string
  type: MediaType
  url: string
  thumbnailUrl: string
  duration?: number // seconds, for video
  dimensions: { width: number; height: number }
  filename: string
  fileSize: number
  mediaItem?: MediaItem // Backend media item after upload confirmation
}

/**
 * Platform variation - each platform's specific content
 */
export interface PlatformVariation {
  /** The connection ID this variation is for */
  connectionId: string
  /** The platform type */
  platform: SocialPlatform
  /** Whether this platform is included in the campaign */
  included: boolean
  /** Assigned media asset (by ID from campaign assets) */
  mediaAssetId: string | null
  /** Caption text for this platform */
  caption: string
  /** Whether caption is synced to master caption */
  isSyncedToMaster: boolean
  /** Platform-specific settings (hashtags, first comment, etc.) */
  platformSettings: PlatformConfigurations[keyof PlatformConfigurations]
  /** Validation warnings for this variation */
  validationWarnings: string[]
}

/**
 * Campaign state - full state for the create campaign page
 */
export interface CampaignState {
  /** Campaign name (optional, for organization) */
  name: string
  /** Master caption that syncs to all linked platform captions */
  masterCaption: string
  /** Schedule type: now, scheduled, or draft */
  schedule: ScheduleType
  /** Scheduled time (if schedule === 'scheduled') */
  scheduledTime?: Date
  /** Media assets uploaded for this campaign */
  assets: MediaAsset[]
  /** Platform-specific variations */
  platformVariations: PlatformVariation[]
}

/**
 * Platform card props for the UI component
 */
export interface PlatformCardProps {
  /** The connection this card represents */
  connection: Connection
  /** The platform variation data */
  variation: PlatformVariation
  /** Available media assets from the campaign */
  assets: MediaAsset[]
  /** Master caption (for synced captions) */
  masterCaption: string
  /** Whether a media asset is being dragged over this card */
  isDragOver?: boolean
  /** Callbacks */
  onToggleInclude: () => void
  onMediaDrop: (assetId: string) => void
  onMediaRemove: () => void
  onCaptionChange: (caption: string) => void
  onToggleSync: () => void
  onPlatformSettingsChange: (settings: PlatformConfigurations[keyof PlatformConfigurations]) => void
}

/**
 * Platform card state for UI rendering
 */
export type PlatformCardState =
  | 'default' // Muted, ready for content
  | 'hasContent' // Has media and/or caption
  | 'synced' // Caption synced to master
  | 'custom' // Custom caption
  | 'excluded' // Not included in campaign
  | 'error' // Has validation errors

/**
 * Actions for campaign state reducer
 */
export type CampaignAction =
  | { type: 'SET_NAME'; payload: string }
  | { type: 'SET_MASTER_CAPTION'; payload: string }
  | { type: 'SET_SCHEDULE'; payload: ScheduleType }
  | { type: 'SET_SCHEDULED_TIME'; payload: Date | undefined }
  | { type: 'ADD_ASSET'; payload: MediaAsset }
  | { type: 'REMOVE_ASSET'; payload: string }
  | { type: 'ADD_PLATFORM_VARIATION'; payload: PlatformVariation }
  | { type: 'REMOVE_PLATFORM_VARIATION'; payload: string }
  | {
      type: 'UPDATE_PLATFORM_VARIATION'
      payload: { connectionId: string; updates: Partial<PlatformVariation> }
    }
  | { type: 'TOGGLE_PLATFORM_INCLUDE'; payload: string }
  | { type: 'TOGGLE_PLATFORM_SYNC'; payload: string }
  | { type: 'SET_PLATFORM_MEDIA'; payload: { connectionId: string; assetId: string | null } }
  | { type: 'SET_PLATFORM_CAPTION'; payload: { connectionId: string; caption: string } }
  | { type: 'SYNC_ALL_CAPTIONS' }
  | { type: 'RESET' }
  | { type: 'LOAD_STATE'; payload: CampaignState }

/**
 * Initial state factory
 */
export const createInitialCampaignState = (): CampaignState => ({
  name: '',
  masterCaption: '',
  schedule: 'now',
  scheduledTime: undefined,
  assets: [],
  platformVariations: [],
})

/**
 * Create a platform variation from a connection
 */
export const createPlatformVariation = (connection: Connection): PlatformVariation => ({
  connectionId: connection.id,
  platform: connection.platform,
  included: true,
  mediaAssetId: null,
  caption: '',
  isSyncedToMaster: true,
  platformSettings: {},
  validationWarnings: [],
})

/**
 * Platform media requirements
 */
export const PLATFORM_MEDIA_REQUIREMENTS: Record<
  SocialPlatform,
  {
    required: boolean
    acceptsVideo: boolean
    acceptsImage: boolean
    maxFiles: number
    aspectRatioHint?: string
  }
> = {
  instagram: {
    required: true,
    acceptsVideo: true,
    acceptsImage: true,
    maxFiles: 10,
    aspectRatioHint: '1:1, 4:5, or 9:16',
  },
  tiktok: {
    required: true,
    acceptsVideo: true,
    acceptsImage: true,
    maxFiles: 1,
    aspectRatioHint: '9:16 recommended',
  },
  youtube: {
    required: true,
    acceptsVideo: true,
    acceptsImage: false,
    maxFiles: 1,
    aspectRatioHint: '16:9 or 9:16 for Shorts',
  },
  pinterest: {
    required: true,
    acceptsVideo: true,
    acceptsImage: true,
    maxFiles: 1,
    aspectRatioHint: '2:3 recommended',
  },
  twitter: {
    required: false,
    acceptsVideo: true,
    acceptsImage: true,
    maxFiles: 4,
  },
  linkedin: {
    required: false,
    acceptsVideo: true,
    acceptsImage: true,
    maxFiles: 9,
  },
  facebook: {
    required: false,
    acceptsVideo: true,
    acceptsImage: true,
    maxFiles: 10,
  },
}
