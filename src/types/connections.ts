/**
 * Supported social platforms for connections
 */
export type SocialPlatform =
  | 'linkedin'
  | 'twitter'
  | 'tiktok'
  | 'pinterest'
  | 'instagram'
  | 'youtube'
  | 'facebook'
  | 'bluesky'
  | 'threads'

/**
 * A social media connection/account
 * Matches backend response from GET /api/connections
 */
export interface Connection {
  id: string
  platform: SocialPlatform
  displayName: string | null
  platformUserId: string
  platformUsername: string
  avatarUrl?: string | null
  isActive: boolean
  expiresAt: string | null
  isExpired: boolean
  needsRefresh: boolean
  createdAt: string
}

/**
 * Response from GET /api/connections
 */
export interface ConnectionsResponse {
  count: number
  connections: Connection[]
}

/**
 * Response from DELETE /api/connections/:id
 */
export interface DisconnectResponse {
  success: boolean
  message: string
  platform: SocialPlatform
}

/**
 * Response from POST /api/connections/:id/refresh
 */
export interface RefreshConnectionResponse {
  success: boolean
  message: string
  data: {
    id: string
    platform: SocialPlatform
    expiresAt: string | null
    isExpired: boolean
  }
}

/**
 * Error response from API
 */
export interface ApiErrorResponse {
  error: string
  message: string
  platform?: SocialPlatform
}

/**
 * Facebook Page from OAuth callback
 */
export interface FacebookPage {
  id: string
  name: string
  category: string
}

/**
 * Response from Facebook OAuth callback containing pages to select
 */
export interface FacebookPagesResponse {
  pendingKey: string
  pages: FacebookPage[]
}

/**
 * Pinterest Board privacy levels
 */
export type PinterestBoardPrivacy = 'PUBLIC' | 'PROTECTED' | 'SECRET'

/**
 * Pinterest Board from API
 */
export interface PinterestBoard {
  id: string
  name: string
  privacy: PinterestBoardPrivacy
}

/**
 * Response from GET /api/oauth/pinterest/boards/:connectionId
 */
export interface PinterestBoardsResponse {
  boards: PinterestBoard[]
  defaultBoardId: string | null
  count: number
}

/**
 * Response from POST /api/oauth/pinterest/boards/:connectionId/default
 */
export interface SetDefaultBoardResponse {
  success: boolean
  message: string
  defaultBoardId: string
}
