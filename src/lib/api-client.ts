/**
 * API Client
 * Typed fetch wrapper for backend API calls
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  status: number
  data?: unknown

  constructor(message: string, status: number, data?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

/**
 * Request options for API calls
 */
interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
}

/**
 * Make an API request with proper error handling
 */
async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, ...rest } = options

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    credentials: 'include', // Include cookies for better-auth session
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new ApiError(data.message || data.error || 'An error occurred', response.status, data)
  }

  return data as T
}

/**
 * API client with typed methods
 */
export const apiClient = {
  get: <T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(endpoint, { ...options, method: 'POST', body }),

  put: <T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(endpoint, { ...options, method: 'PUT', body }),

  patch: <T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(endpoint, { ...options, method: 'PATCH', body }),

  delete: <T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),
}

/**
 * Get the full URL for OAuth popup
 */
export function getOAuthUrl(endpoint: string): string {
  return `${API_BASE_URL}${endpoint}`
}
