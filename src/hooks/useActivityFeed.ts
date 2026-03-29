import { useState, useEffect, useCallback } from 'react'
import { getActivityFeed } from '@/services/activity.service'
import type { ActivityFeedItem } from '@/types/activity'

interface UseActivityFeedReturn {
  items: ActivityFeedItem[]
  isLoading: boolean
  error: string | null
  hasMore: boolean
  loadMore: () => Promise<void>
}

export function useActivityFeed(): UseActivityFeedReturn {
  const [items, setItems] = useState<ActivityFeedItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)

  const fetchInitial = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await getActivityFeed()
      setItems(response.items)
      setNextCursor(response.nextCursor)
      setHasMore(response.nextCursor !== null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch activity feed')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const loadMore = useCallback(async () => {
    if (!nextCursor || isLoading) return

    try {
      const response = await getActivityFeed(nextCursor)
      setItems((prev) => [...prev, ...response.items])
      setNextCursor(response.nextCursor)
      setHasMore(response.nextCursor !== null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load more')
    }
  }, [nextCursor, isLoading])

  useEffect(() => {
    fetchInitial()
  }, [fetchInitial])

  return { items, isLoading, error, hasMore, loadMore }
}
