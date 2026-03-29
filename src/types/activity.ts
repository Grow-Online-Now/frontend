export type ActivityEventType =
  | 'post_published'
  | 'clips_created'
  | 'social_connected'
  | 'automation_created'

export interface ActivityFeedItem {
  id: string
  type: ActivityEventType
  userName: string
  userImage: string | null
  metadata: Record<string, unknown>
  thumbnailUrl: string | null
  createdAt: string
}

export interface ActivityFeedResponse {
  items: ActivityFeedItem[]
  nextCursor: string | null
}

export interface UpcomingPost {
  id: string
  caption: string
  scheduledFor: string
  platforms: string[]
  thumbnailUrl: string | null
}

export interface OverviewStats {
  scheduledPosts: number
  connectedAccounts: number
  postsThisWeek: number
  upcomingPosts: UpcomingPost[]
}
