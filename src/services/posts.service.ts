/**
 * Posts Service
 * Handles API calls for post creation and management
 */

import { apiClient } from '@/lib/api-client'
import type {
  CreatePostRequest,
  PostResponse,
  PostsListResponse,
  PostsQueryParams,
  PostsCountsResponse,
} from '@/types/posts'

const ENDPOINTS = {
  posts: '/api/posts',
  postById: (id: string) => `/api/posts/${id}`,
  postsCounts: '/api/posts/counts',
} as const

/**
 * Build query string from PostsQueryParams
 */
function buildQueryString(params?: PostsQueryParams): string {
  if (!params) return ''

  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value))
    }
  })

  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

/**
 * Create a new post
 */
export async function createPost(data: CreatePostRequest): Promise<PostResponse> {
  return apiClient.post<PostResponse>(ENDPOINTS.posts, data)
}

/**
 * Get all posts for the authenticated user with optional filters
 */
export async function getPosts(params?: PostsQueryParams): Promise<PostsListResponse> {
  const query = buildQueryString(params)
  return apiClient.get<PostsListResponse>(`${ENDPOINTS.posts}${query}`)
}

/**
 * Get a specific post by ID
 */
export async function getPost(id: string): Promise<PostResponse> {
  return apiClient.get<PostResponse>(ENDPOINTS.postById(id))
}

/**
 * Delete a post
 */
export async function deletePost(id: string): Promise<{ success: boolean }> {
  return apiClient.delete<{ success: boolean }>(ENDPOINTS.postById(id))
}

/**
 * Get post counts by status for tabs
 * TODO: Backend endpoint needs to be implemented
 */
export async function getPostsCounts(): Promise<PostsCountsResponse> {
  return apiClient.get<PostsCountsResponse>(ENDPOINTS.postsCounts)
}

/**
 * Posts service object (alternative API)
 */
export const postsService = {
  create: createPost,
  getAll: getPosts,
  getById: getPost,
  delete: deletePost,
  getCounts: getPostsCounts,
}
