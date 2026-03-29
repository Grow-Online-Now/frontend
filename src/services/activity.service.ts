import { apiClient } from '@/lib/api-client'
import type { ActivityFeedResponse, OverviewStats } from '@/types/activity'

const ENDPOINTS = {
  feed: '/api/activity/feed',
  overviewStats: '/api/activity/overview-stats',
} as const

export async function getActivityFeed(
  cursor?: string,
  limit = 20,
): Promise<ActivityFeedResponse> {
  const params = new URLSearchParams()
  if (cursor) params.set('cursor', cursor)
  params.set('limit', String(limit))
  const query = params.toString()
  return apiClient.get<ActivityFeedResponse>(`${ENDPOINTS.feed}?${query}`)
}

export async function getOverviewStats(): Promise<OverviewStats> {
  return apiClient.get<OverviewStats>(ENDPOINTS.overviewStats)
}

export const activityService = {
  getFeed: getActivityFeed,
  getOverviewStats,
}
