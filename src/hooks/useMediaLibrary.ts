/**
 * useMediaLibrary Hook
 * Fetches and manages media items with infinite scroll pagination
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { getMedia, deleteMedia } from '@/services/media.service'
import type { MediaItem, MediaType } from '@/types/media'

const DEFAULT_LIMIT = 24

interface UseMediaLibraryParams {
  type?: MediaType
  limit?: number
}

interface UseMediaLibraryState {
  media: MediaItem[]
  isLoading: boolean
  isLoadingMore: boolean
  error: string | null
  hasMore: boolean
  totalCount: number
}

interface UseMediaLibraryReturn extends UseMediaLibraryState {
  loadMore: () => Promise<void>
  deleteMediaById: (id: string) => Promise<boolean>
  refetch: () => Promise<void>
}

export function useMediaLibrary(params?: UseMediaLibraryParams): UseMediaLibraryReturn {
  const { type, limit = DEFAULT_LIMIT } = params || {}

  const [state, setState] = useState<UseMediaLibraryState>({
    media: [],
    isLoading: true,
    isLoadingMore: false,
    error: null,
    hasMore: true,
    totalCount: 0,
  })

  // Track current offset for pagination
  const offsetRef = useRef(0)

  // Track if initial fetch has been done
  const initialFetchDoneRef = useRef(false)

  // Fetch media with optional append mode
  const fetchMedia = useCallback(
    async (append = false) => {
      // Set loading state
      if (append) {
        setState((prev) => ({ ...prev, isLoadingMore: true, error: null }))
      } else {
        setState((prev) => ({ ...prev, isLoading: true, error: null }))
        offsetRef.current = 0
      }

      try {
        const response = await getMedia({
          type,
          status: 'ready', // Only show ready media in library
          limit,
          offset: append ? offsetRef.current : 0,
        })

        const newMedia = response.media
        const total = response.total

        setState((prev) => ({
          media: append ? [...prev.media, ...newMedia] : newMedia,
          isLoading: false,
          isLoadingMore: false,
          error: null,
          hasMore: (append ? prev.media.length + newMedia.length : newMedia.length) < total,
          totalCount: total,
        }))

        // Update offset for next load
        if (append) {
          offsetRef.current += newMedia.length
        } else {
          offsetRef.current = newMedia.length
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch media'
        setState((prev) => ({
          ...prev,
          isLoading: false,
          isLoadingMore: false,
          error: message,
        }))
      }
    },
    [type, limit]
  )

  // Initial fetch and refetch when type changes
  useEffect(() => {
    initialFetchDoneRef.current = false
    fetchMedia(false)
    initialFetchDoneRef.current = true
  }, [fetchMedia])

  // Load more items
  const loadMore = useCallback(async () => {
    if (state.isLoadingMore || !state.hasMore) return
    await fetchMedia(true)
  }, [fetchMedia, state.isLoadingMore, state.hasMore])

  // Delete media by ID
  const deleteMediaById = useCallback(async (id: string): Promise<boolean> => {
    try {
      await deleteMedia(id)
      // Remove from local state immediately
      setState((prev) => ({
        ...prev,
        media: prev.media.filter((m) => m.id !== id),
        totalCount: prev.totalCount - 1,
      }))
      return true
    } catch {
      return false
    }
  }, [])

  // Refetch all data
  const refetch = useCallback(async () => {
    await fetchMedia(false)
  }, [fetchMedia])

  return {
    ...state,
    loadMore,
    deleteMediaById,
    refetch,
  }
}
