/**
 * usePostsCounts Hook
 * Fetches post counts by status for tabs display
 */

import { useState, useEffect, useCallback } from 'react'
import { getPostsCounts } from '@/services/posts.service'
import type { PostStatusCounts } from '@/types/posts'

interface UsePostsCountsReturn {
  counts: PostStatusCounts | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function usePostsCounts(): UsePostsCountsReturn {
  const [counts, setCounts] = useState<PostStatusCounts | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCounts = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await getPostsCounts()
      setCounts(response.counts)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch counts'
      setError(message)
      // Set default counts on error so UI doesn't break
      setCounts({
        all: 0,
        draft: 0,
        scheduled: 0,
        published: 0,
        failed: 0,
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCounts()
  }, [fetchCounts])

  return {
    counts,
    isLoading,
    error,
    refetch: fetchCounts,
  }
}
