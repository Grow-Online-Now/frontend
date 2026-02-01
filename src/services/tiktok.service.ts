/**
 * TikTok Service
 * Handles API calls for TikTok-specific features
 */

import { apiClient } from '@/lib/api-client'
import type { TikTokPrivacyLevel } from '@/types/posts'

/**
 * TikTok creator info response from API
 */
export interface TikTokCreatorInfo {
  creatorAvatarUrl: string
  creatorUsername: string
  creatorNickname: string
  privacyLevelOptions: TikTokPrivacyLevel[]
  commentDisabled: boolean
  duetDisabled: boolean
  stitchDisabled: boolean
  maxVideoPostDurationSec: number
}

const ENDPOINTS = {
  creatorInfo: (connectionId: string) => `/api/oauth/tiktok/creator-info/${connectionId}`,
} as const

/**
 * Get TikTok creator info for a connection
 * Returns available privacy levels and feature availability
 * @param connectionId - The TikTok connection ID
 */
export async function getTikTokCreatorInfo(connectionId: string): Promise<TikTokCreatorInfo> {
  return apiClient.get<TikTokCreatorInfo>(ENDPOINTS.creatorInfo(connectionId))
}

/**
 * TikTok service object (alternative API)
 */
export const tiktokService = {
  getCreatorInfo: getTikTokCreatorInfo,
}
