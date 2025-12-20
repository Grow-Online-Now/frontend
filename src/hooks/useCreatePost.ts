/**
 * useCreatePost Hook
 * Handles post creation with loading, error, success states, and status polling
 */

import { useState, useCallback, useRef, useEffect } from 'react'
import { createPost, getPost } from '@/services/posts.service'
import { ApiError } from '@/lib/api-client'
import type { CreatePostRequest, PostResponse, PlatformPost } from '@/types/posts'

const POLL_INTERVAL = 2000 // 2 seconds
const MAX_POLL_ATTEMPTS = 60 // 2 minutes max

interface UseCreatePostState {
  isLoading: boolean
  error: string | null
  success: boolean
  createdPost: PostResponse | null
  isPolling: boolean
  platformPosts: PlatformPost[]
  showProgressModal: boolean
}

interface UseCreatePostReturn extends UseCreatePostState {
  submitPost: (data: CreatePostRequest) => Promise<PostResponse | null>
  reset: () => void
  startPolling: (postId: string) => void
  stopPolling: () => void
  setShowProgressModal: (show: boolean) => void
}

/**
 * Hook for creating posts with state management and status polling
 */
export function useCreatePost(): UseCreatePostReturn {
  const [state, setState] = useState<UseCreatePostState>({
    isLoading: false,
    error: null,
    success: false,
    createdPost: null,
    isPolling: false,
    platformPosts: [],
    showProgressModal: false,
  })

  const pollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pollAttemptsRef = useRef(0)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollTimeoutRef.current) {
        clearTimeout(pollTimeoutRef.current)
      }
    }
  }, [])

  const stopPolling = useCallback(() => {
    if (pollTimeoutRef.current) {
      clearTimeout(pollTimeoutRef.current)
      pollTimeoutRef.current = null
    }
    pollAttemptsRef.current = 0
    setState((prev) => ({ ...prev, isPolling: false }))
  }, [])

  const startPolling = useCallback(
    (postId: string) => {
      pollAttemptsRef.current = 0
      setState((prev) => ({ ...prev, isPolling: true }))

      const poll = async () => {
        if (pollAttemptsRef.current >= MAX_POLL_ATTEMPTS) {
          stopPolling()
          return
        }

        try {
          const response = await getPost(postId)

          // Update state with latest platform posts (API returns platform_results)
          setState((prev) => ({
            ...prev,
            createdPost: response,
            platformPosts: response.platform_results || response.platformPosts || [],
          }))

          // Check if all platforms are done
          const platformResults = response.platform_results || response.platformPosts || []
          const allDone =
            platformResults.length > 0 &&
            platformResults.every((p) => p.status === 'posted' || p.status === 'failed')

          if (allDone || response.status === 'completed' || response.status === 'failed') {
            stopPolling()
            return
          }

          pollAttemptsRef.current++
          pollTimeoutRef.current = setTimeout(poll, POLL_INTERVAL)
        } catch {
          // Continue polling on error
          pollAttemptsRef.current++
          pollTimeoutRef.current = setTimeout(poll, POLL_INTERVAL)
        }
      }

      poll()
    },
    [stopPolling]
  )

  const submitPost = useCallback(async (data: CreatePostRequest): Promise<PostResponse | null> => {
    setState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
      success: false,
      createdPost: null,
      platformPosts: [],
    }))

    try {
      const response = await createPost(data)
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: null,
        success: true,
        createdPost: response,
        platformPosts: response.platform_results || response.platformPosts || [],
      }))
      return response
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to create post'
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: message,
        success: false,
        createdPost: null,
      }))
      return null
    }
  }, [])

  const setShowProgressModal = useCallback((show: boolean) => {
    setState((prev) => ({ ...prev, showProgressModal: show }))
  }, [])

  const reset = useCallback(() => {
    stopPolling()
    setState({
      isLoading: false,
      error: null,
      success: false,
      createdPost: null,
      isPolling: false,
      platformPosts: [],
      showProgressModal: false,
    })
  }, [stopPolling])

  return {
    ...state,
    submitPost,
    reset,
    startPolling,
    stopPolling,
    setShowProgressModal,
  }
}
