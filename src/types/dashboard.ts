// Post types
export type PostStatus = 'draft' | 'scheduled' | 'published' | 'failed'

export interface ScheduledPost {
  id: string
  content: string
  platforms: string[] // Platform IDs
  scheduledFor: string
  status: PostStatus
  createdAt: string
  mediaUrls?: string[]
}

// Navigation types
export interface SidebarNavItem {
  labelKey: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  badge?: number
  comingSoon?: boolean
}

// Calendar view types
export type CalendarView = 'month' | 'week'
