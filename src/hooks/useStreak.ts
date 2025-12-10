/**
 * useStreak Hook
 * Fetches and manages the user's posting streak data
 */

import { useState, useEffect, useCallback } from 'react'
import { getStreak } from '@/services/streak.service'
import type { StreakResponse } from '@/types/streak'

interface UseStreakState {
  streak: StreakResponse | null
  isLoading: boolean
  error: string | null
}

interface UseStreakReturn extends UseStreakState {
  refetch: () => Promise<void>
}

export function useStreak(): UseStreakReturn {
  const [state, setState] = useState<UseStreakState>({
    streak: null,
    isLoading: true,
    error: null,
  })

  const fetchStreak = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await getStreak()
      setState({
        streak: response,
        isLoading: false,
        error: null,
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch streak data'
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: message,
      }))
    }
  }, [])

  useEffect(() => {
    fetchStreak()
  }, [fetchStreak])

  return {
    ...state,
    refetch: fetchStreak,
  }
}
