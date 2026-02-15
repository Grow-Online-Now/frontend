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
  isRateLimited: boolean
}

interface UseTikTokCreatorInfoReturn extends UseTikTokCreatorInfoState {
  refetch: () => Promise<void>
  privacyOptions: TikTokPrivacyLevel[]
  commentDisabled: boolean
  duetDisabled: boolean
  stitchDisabled: boolean
  maxVideoDuration: number
  creatorNickname: string | null
  /** Whether the creator is rate limited or cannot post more */
  isRateLimited: boolean
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
    isRateLimited: false,
  })

  /**
   * Fetch creator info for the connection
   */
  const fetchCreatorInfo = useCallback(async () => {
    if (!connectionId) return

    setState((prev) => ({ ...prev, isLoading: true, error: null, isRateLimited: false }))

    try {
      const info = await getTikTokCreatorInfo(connectionId)

      // Check if the backend indicates the creator can't post
      const rateLimited = info.canPost === false

      setState({
        creatorInfo: info,
        isLoading: false,
        error: null,
        isRateLimited: rateLimited,
      })
    } catch (err) {
      // Detect rate limit errors (HTTP 429 or specific error messages)
      const isRateLimit =
        err instanceof ApiError &&
        (err.status === 429 ||
          err.message.toLowerCase().includes('rate limit') ||
          err.message.toLowerCase().includes('too many') ||
          err.message.toLowerCase().includes('spam_risk'))

      const message = err instanceof ApiError ? err.message : 'Failed to load TikTok creator info'
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: message,
        isRateLimited: isRateLimit,
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
        isRateLimited: false,
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
    isRateLimited: state.isRateLimited,
  }
}
