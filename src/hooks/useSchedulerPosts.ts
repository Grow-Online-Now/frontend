/**
 * useSchedulerPosts Hook
 * Fetches and organizes posts for the scheduler calendar
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import { getPosts } from '@/services/posts.service'
import { groupPostsByDate, formatDateKey } from '@/lib/date-utils'
import type { PostResponse } from '@/types/posts'

interface UseSchedulerPostsOptions {
  startDate: Date
  endDate: Date
}

interface UseSchedulerPostsReturn {
  posts: PostResponse[]
  postsByDate: Map<string, PostResponse[]>
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useSchedulerPosts({
  startDate,
  endDate,
}: UseSchedulerPostsOptions): UseSchedulerPostsReturn {
  const [posts, setPosts] = useState<PostResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Create stable date strings for dependency comparison
  const startKey = formatDateKey(startDate)
  const endKey = formatDateKey(endDate)

  const fetchPosts = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Fetch scheduled posts within the date range
      const response = await getPosts({
        from: startDate.toISOString(),
        to: endDate.toISOString(),
        sort: 'scheduled_for',
        order: 'asc',
        limit: 100, // Get all posts for the visible range
      })

      setPosts(response.posts)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch scheduled posts'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [startKey, endKey]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  // Group posts by date for O(1) lookup when rendering calendar
  const postsByDate = useMemo(() => groupPostsByDate(posts), [posts])

  return {
    posts,
    postsByDate,
    isLoading,
    error,
    refetch: fetchPosts,
  }
}
