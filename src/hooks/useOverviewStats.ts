import { useState, useEffect, useCallback } from 'react'
import { getOverviewStats } from '@/services/activity.service'
import type { OverviewStats } from '@/types/activity'

interface UseOverviewStatsReturn {
  stats: OverviewStats | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useOverviewStats(): UseOverviewStatsReturn {
  const [stats, setStats] = useState<OverviewStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await getOverviewStats()
      setStats(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetch()
  }, [fetch])

  return { stats, isLoading, error, refetch: fetch }
}
