/**
 * Post Types
 * Types for creating and managing social media posts
 */

import type { SocialPlatform } from './connections'

/**
 * Platform-specific content types
 */
export type InstagramContentType = 'post' | 'reel' | 'story' | 'carousel'
export type TikTokContentType = 'video' | 'photo'
export type YouTubeContentType = 'video' | 'short'

/**
 * TikTok privacy levels
 */
export type TikTokPrivacyLevel =
  | 'PUBLIC_TO_EVERYONE'
  | 'MUTUAL_FOLLOW_FRIENDS'
  | 'FOLLOWER_OF_CREATOR'
  | 'SELF_ONLY'

/**
 * YouTube privacy status
 */
export type YouTubePrivacyStatus = 'public' | 'private' | 'unlisted'

/**
 * LinkedIn visibility options
 */
export type LinkedInVisibility = 'PUBLIC' | 'CONNECTIONS'

/**
 * YouTube video categories
 * Official YouTube category IDs: https://developers.google.com/youtube/v3/docs/videoCategories
 */
export const YOUTUBE_CATEGORIES = [
  { id: '1', labelKey: 'dashboard.createPost.platformConfig.youtube.categories.filmAnimation' },
  { id: '2', labelKey: 'dashboard.createPost.platformConfig.youtube.categories.autosVehicles' },
  { id: '10', labelKey: 'dashboard.createPost.platformConfig.youtube.categories.music' },
  { id: '15', labelKey: 'dashboard.createPost.platformConfig.youtube.categories.petsAnimals' },
  { id: '17', labelKey: 'dashboard.createPost.platformConfig.youtube.categories.sports' },
  { id: '19', labelKey: 'dashboard.createPost.platformConfig.youtube.categories.travel' },
  { id: '20', labelKey: 'dashboard.createPost.platformConfig.youtube.categories.gaming' },
  { id: '22', labelKey: 'dashboard.createPost.platformConfig.youtube.categories.peopleBlogs' },
  { id: '23', labelKey: 'dashboard.createPost.platformConfig.youtube.categories.comedy' },
  { id: '24', labelKey: 'dashboard.createPost.platformConfig.youtube.categories.entertainment' },
  { id: '25', labelKey: 'dashboard.createPost.platformConfig.youtube.categories.newsPolitics' },
  { id: '26', labelKey: 'dashboard.createPost.platformConfig.youtube.categories.howtoStyle' },
  { id: '27', labelKey: 'dashboard.createPost.platformConfig.youtube.categories.education' },
  { id: '28', labelKey: 'dashboard.createPost.platformConfig.youtube.categories.scienceTech' },
  { id: '29', labelKey: 'dashboard.createPost.platformConfig.youtube.categories.nonprofits' },
] as const

/**
 * Twitter thread tweet item (for local state management)
 */
export interface TwitterThreadTweet {
  id: string // Local UUID for React keys and reordering
  text: string // Tweet text (max 280 chars)
  mediaIds?: string[] // Backend media IDs (max 4 per tweet)
}

/**
 * Twitter thread tweet for API request (without local id)
 */
export interface TwitterThreadTweetRequest {
  text: string
  mediaIds?: string[]
}

/**
 * Twitter first comment configuration
 */
export interface TwitterFirstComment {
  text: string // Comment text (max 280 chars)
  mediaIds?: string[] // Backend media IDs (max 4)
}

/**
 * Twitter platform configuration (for API request)
 */
export interface TwitterConfig {
  thread?: TwitterThreadTweetRequest[]
  firstComment?: TwitterFirstComment
}

/**
 * Instagram platform configuration
 */
export interface InstagramConfig {
  contentType?: InstagramContentType
  shareToFeed?: boolean
  coverMediaId?: string
  thumbOffset?: number
}

/**
 * TikTok platform configuration
 */
export interface TikTokConfig {
  contentType?: TikTokContentType
  privacyLevel?: TikTokPrivacyLevel
  disableComment?: boolean
  autoAddMusic?: boolean
  coverIndex?: number
}

/**
 * YouTube platform configuration
 */
export interface YouTubeConfig {
  contentType?: YouTubeContentType
  privacyStatus?: YouTubePrivacyStatus
  categoryId?: string
  tags?: string[]
  thumbnailMediaId?: string
  notifySubscribers?: boolean
  madeForKids?: boolean
  embeddable?: boolean
}

/**
 * LinkedIn platform configuration
 */
export interface LinkedInConfig {
  visibility?: LinkedInVisibility
}

/**
 * Pinterest platform configuration
 */
export interface PinterestConfig {
  boardId?: string // Override default board for this post
}

/**
 * Platform-specific configurations for post creation
 */
export interface PlatformConfigurations {
  instagram?: InstagramConfig
  tiktok?: TikTokConfig
  youtube?: YouTubeConfig
  twitter?: TwitterConfig
  linkedin?: LinkedInConfig
  pinterest?: PinterestConfig
}

/**
 * Individual platform post status in response
 */
export interface PlatformPost {
  id: string
  platform: SocialPlatform
  status: PlatformPostStatus
  platformPostId?: string
  url?: string
  errorMessage?: string
  postedAt?: string
}

/**
 * Platform character limits
 * Note: Only includes platforms defined in SocialPlatform type
 */
export const PLATFORM_CHARACTER_LIMITS: Record<SocialPlatform, number> = {
  twitter: 280,
  pinterest: 500,
  instagram: 2200,
  tiktok: 2200,
  linkedin: 3000,
  youtube: 5000,
  facebook: 63206,
} as const

/**
 * Post status from API
 */
export type PostStatus = 'pending' | 'processing' | 'completed' | 'failed'

/**
 * Platform post status
 */
export type PlatformPostStatus = 'queued' | 'posted' | 'failed'

/**
 * Social account info returned with posts
 */
export interface PostSocialAccount {
  id: string
  platform: SocialPlatform
  display_name: string
  username: string
  avatar_url?: string | null
}

/**
 * Request to create a new post
 */
export interface CreatePostRequest {
  caption: string
  social_accounts: string[]
  scheduled_at?: string | null
  is_draft?: boolean
  media_urls?: string[] // S3 URLs from confirmed uploads
  media_ids?: string[] // Backend media IDs from confirmed uploads
  platform_configurations?: PlatformConfigurations
}

/**
 * Post response from API
 */
export interface PostResponse {
  id: string
  caption: string
  status: PostStatus
  scheduled_at: string | null
  is_draft: boolean
  created_at: string
  updated_at: string
  social_accounts: PostSocialAccount[]
  platformPosts?: PlatformPost[]
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

/**
 * Response from GET /api/posts
 */
export interface PostsListResponse {
  posts: PostResponse[]
  pagination: PaginationMeta
}

/**
 * Query parameters for GET /api/posts
 */
export interface PostsQueryParams {
  page?: number
  limit?: number
  scheduled?: boolean
  is_draft?: boolean
  status?: PostStatus
  platform?: SocialPlatform
  from?: string
  to?: string
  sort?: 'created_at' | 'scheduled_for'
  order?: 'asc' | 'desc'
}

/**
 * Status tab type for filtering posts
 */
export type PostStatusTab = 'all' | 'draft' | 'scheduled' | 'published' | 'failed'

/**
 * Status counts for tabs
 */
export interface PostStatusCounts {
  all: number
  draft: number
  scheduled: number
  published: number
  failed: number
}

/**
 * Response from GET /api/posts/counts
 * TODO: Backend endpoint needs to be implemented
 */
export interface PostsCountsResponse {
  counts: PostStatusCounts
}

/**
 * Schedule type for form
 */
export type ScheduleType = 'now' | 'scheduled' | 'draft'

/**
 * Form data for create post form
 */
export interface CreatePostFormData {
  caption: string
  selectedAccounts: string[]
  scheduleType: ScheduleType
  scheduledDate?: Date
  scheduledTime: string
}
