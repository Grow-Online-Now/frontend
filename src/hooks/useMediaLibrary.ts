/**
 * useMediaLibrary Hook
 * Fetches and manages media items with infinite scroll pagination.
 * Caches the full "all" dataset and filters client-side for type tabs,
 * avoiding redundant API calls when switching between All / Images / Videos.
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { getMedia, deleteMedia, deleteMediaBatch } from '@/services/media.service'
import type { MediaItem, MediaType } from '@/types/media'

const DEFAULT_LIMIT = 24

interface UseMediaLibraryParams {
  type?: MediaType
  limit?: number
}

interface UseMediaLibraryState {
  /** All fetched items (unfiltered) */
  allMedia: MediaItem[]
  isLoading: boolean
  isLoadingMore: boolean
  error: string | null
  hasMoreOnServer: boolean
  totalOnServer: number
}

interface UseMediaLibraryReturn {
  media: MediaItem[]
  isLoading: boolean
  isLoadingMore: boolean
  error: string | null
  hasMore: boolean
  totalCount: number
  loadMore: () => Promise<void>
  deleteMediaById: (id: string) => Promise<boolean>
  deleteMediaByIds: (ids: string[]) => Promise<number>
  refetch: () => Promise<void>
}

export function useMediaLibrary(params?: UseMediaLibraryParams): UseMediaLibraryReturn {
  const { type, limit = DEFAULT_LIMIT } = params || {}

  const [state, setState] = useState<UseMediaLibraryState>({
    allMedia: [],
    isLoading: true,
    isLoadingMore: false,
    error: null,
    hasMoreOnServer: true,
    totalOnServer: 0,
  })

  const offsetRef = useRef(0)

  // Fetch from server (always fetches ALL types for caching)
  const fetchMedia = useCallback(
    async (append = false) => {
      if (append) {
        setState((prev) => ({ ...prev, isLoadingMore: true, error: null }))
      } else {
        setState((prev) => ({ ...prev, isLoading: true, error: null }))
        offsetRef.current = 0
      }

      try {
        const response = await getMedia({
          status: 'ready',
          limit,
          offset: append ? offsetRef.current : 0,
        })

        const newMedia = response.media
        const total = response.total

        setState((prev) => {
          const allMedia = append ? [...prev.allMedia, ...newMedia] : newMedia
          return {
            allMedia,
            isLoading: false,
            isLoadingMore: false,
            error: null,
            hasMoreOnServer: allMedia.length < total,
            totalOnServer: total,
          }
        })

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
    [limit]
  )

  // Initial fetch
  useEffect(() => {
    fetchMedia(false)
  }, [fetchMedia])

  // Client-side filtering by type
  const filtered = useMemo(() => {
    if (!type) return state.allMedia
    return state.allMedia.filter((m) => m.mediaType === type)
  }, [state.allMedia, type])

  // When filtered by type, there could be more matching items on the server
  // that we haven't loaded yet. We need to keep loading if the user scrolls.
  const hasMore = state.hasMoreOnServer

  // Load more items from server
  const loadMore = useCallback(async () => {
    if (state.isLoadingMore || !state.hasMoreOnServer) return
    await fetchMedia(true)
  }, [fetchMedia, state.isLoadingMore, state.hasMoreOnServer])

  // Delete media by ID
  const deleteMediaById = useCallback(async (id: string): Promise<boolean> => {
    try {
      await deleteMedia(id)
      setState((prev) => ({
        ...prev,
        allMedia: prev.allMedia.filter((m) => m.id !== id),
        totalOnServer: prev.totalOnServer - 1,
      }))
      return true
    } catch {
      return false
    }
  }, [])

  // Batch delete media by IDs
  const deleteMediaByIds = useCallback(async (ids: string[]): Promise<number> => {
    if (ids.length === 0) return 0
    try {
      const { deleted } = await deleteMediaBatch(ids)
      const idSet = new Set(ids)
      setState((prev) => ({
        ...prev,
        allMedia: prev.allMedia.filter((m) => !idSet.has(m.id)),
        totalOnServer: prev.totalOnServer - deleted,
      }))
      return deleted
    } catch {
      return 0
    }
  }, [])

  // Refetch all data
  const refetch = useCallback(async () => {
    await fetchMedia(false)
  }, [fetchMedia])

  return {
    media: filtered,
    isLoading: state.isLoading,
    isLoadingMore: state.isLoadingMore,
    error: state.error,
    hasMore,
    totalCount: type ? filtered.length : state.totalOnServer,
    loadMore,
    deleteMediaById,
    deleteMediaByIds,
    refetch,
  }
}
