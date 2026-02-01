/**
 * useTikTokCreatorInfo Hook
 * Fetches and caches TikTok creator info for UX compliance
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import { getTikTokCreatorInfo, type TikTokCreatorInfo } from '@/services/tiktok.service'
import { ApiError } from '@/lib/api-client'
import type { TikTokPrivacyLevel } from '@/types/posts'

interface UseTikTokCreatorInfoState {
  creatorInfo: TikTokCreatorInfo | null
  isLoading: boolean
  error: string | null
}

interface UseTikTokCreatorInfoReturn extends UseTikTokCreatorInfoState {
  refetch: () => Promise<void>
  privacyOptions: TikTokPrivacyLevel[]
  commentDisabled: boolean
  duetDisabled: boolean
  stitchDisabled: boolean
  maxVideoDuration: number
  creatorNickname: string | null
}

/**
 * Hook to fetch TikTok creator info for compliance with TikTok UX guidelines
 * @param connectionId - The TikTok connection ID (null to skip fetching)
 */
export function useTikTokCreatorInfo(connectionId: string | null): UseTikTokCreatorInfoReturn {
  const [state, setState] = useState<UseTikTokCreatorInfoState>({
    creatorInfo: null,
    isLoading: false,
    error: null,
  })

  /**
   * Fetch creator info for the connection
   */
  const fetchCreatorInfo = useCallback(async () => {
    if (!connectionId) return

    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const info = await getTikTokCreatorInfo(connectionId)
      setState({
        creatorInfo: info,
        isLoading: false,
        error: null,
      })
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to load TikTok creator info'
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: message,
      }))
    }
  }, [connectionId])

  // Fetch on mount/connectionId change
  useEffect(() => {
    if (connectionId) {
      fetchCreatorInfo()
    } else {
      // Reset state when no connection
      setState({
        creatorInfo: null,
        isLoading: false,
        error: null,
      })
    }
  }, [connectionId, fetchCreatorInfo])

  // Computed values from creator info
  const privacyOptions = useMemo(
    () => state.creatorInfo?.privacyLevelOptions ?? [],
    [state.creatorInfo]
  )

  const commentDisabled = useMemo(
    () => state.creatorInfo?.commentDisabled ?? false,
    [state.creatorInfo]
  )

  const duetDisabled = useMemo(
    () => state.creatorInfo?.duetDisabled ?? false,
    [state.creatorInfo]
  )

  const stitchDisabled = useMemo(
    () => state.creatorInfo?.stitchDisabled ?? false,
    [state.creatorInfo]
  )

  const maxVideoDuration = useMemo(
    () => state.creatorInfo?.maxVideoPostDurationSec ?? 600,
    [state.creatorInfo]
  )

  const creatorNickname = useMemo(
    () => state.creatorInfo?.creatorNickname ?? null,
    [state.creatorInfo]
  )

  return {
    ...state,
    refetch: fetchCreatorInfo,
    privacyOptions,
    commentDisabled,
    duetDisabled,
    stitchDisabled,
    maxVideoDuration,
    creatorNickname,
  }
}
