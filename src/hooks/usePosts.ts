/**
 * usePosts Hook
 * Fetches and manages posts with pagination and filtering
 */

import { useState, useEffect, useCallback } from 'react'
import { getPosts, deletePost } from '@/services/posts.service'
import type { PostResponse, PaginationMeta, PostsQueryParams } from '@/types/posts'

interface UsePostsState {
  posts: PostResponse[]
  pagination: PaginationMeta | null
  isLoading: boolean
  error: string | null
}

interface UsePostsReturn extends UsePostsState {
  filters: PostsQueryParams
  setFilters: (filters: PostsQueryParams) => void
  updateFilters: (filters: Partial<PostsQueryParams>) => void
  setPage: (page: number) => void
  refetch: () => Promise<void>
  deletePostById: (id: string) => Promise<boolean>
}

const DEFAULT_FILTERS: PostsQueryParams = {
  page: 1,
  limit: 10,
  sort: 'created_at',
  order: 'desc',
}

export function usePosts(initialFilters?: PostsQueryParams): UsePostsReturn {
  const [filters, setFilters] = useState<PostsQueryParams>({
    ...DEFAULT_FILTERS,
    ...initialFilters,
  })

  const [state, setState] = useState<UsePostsState>({
    posts: [],
    pagination: null,
    isLoading: true,
    error: null,
  })

  const fetchPosts = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await getPosts(filters)
      setState({
        posts: response.posts,
        pagination: response.pagination,
        isLoading: false,
        error: null,
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch posts'
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: message,
      }))
    }
  }, [filters])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const updateFilters = useCallback((newFilters: Partial<PostsQueryParams>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      // Reset to page 1 when filters change (except when explicitly changing page)
      page: newFilters.page ?? 1,
    }))
  }, [])

  const setPage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }))
  }, [])

  const deletePostById = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        await deletePost(id)
        // Refetch to update the list
        await fetchPosts()
        return true
      } catch {
        return false
      }
    },
    [fetchPosts]
  )

  return {
    ...state,
    filters,
    setFilters,
    updateFilters,
    setPage,
    refetch: fetchPosts,
    deletePostById,
  }
}
