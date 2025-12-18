/**
 * Connections Service
 * Handles API calls for social media connections
 */

import { apiClient, getOAuthUrl } from '@/lib/api-client'
import type {
  SocialPlatform,
  Connection,
  ConnectionsResponse,
  DisconnectResponse,
  RefreshConnectionResponse,
  FacebookPagesResponse,
} from '@/types/connections'

const ENDPOINTS = {
  connections: '/api/connections',
  connect: (platform: SocialPlatform) => `/api/connections/${platform}/connect`,
  disconnect: (id: string) => `/api/connections/${id}`,
  refresh: (id: string) => `/api/connections/${id}/refresh`,
  facebookSelectPage: '/api/oauth/facebook/select-page',
  facebookPendingPages: (pendingKey: string) =>
    `/api/oauth/facebook/pages?pendingKey=${pendingKey}`,
  // Bluesky endpoints (credential-based, not OAuth)
  blueskyConnect: '/api/connections/bluesky/connect',
  blueskyStatus: '/api/connections/bluesky/status',
  blueskyRefresh: '/api/connections/bluesky/refresh',
} as const

/**
 * Get all connections for the authenticated user
 */
export async function getConnections(): Promise<ConnectionsResponse> {
  return apiClient.get<ConnectionsResponse>(ENDPOINTS.connections)
}

/**
 * Get the OAuth URL for connecting a platform
 * Used to open in popup window
 * @param platform - The social platform to connect
 * @param workspaceId - The workspace ID to associate the connection with
 */
export function getConnectUrl(platform: SocialPlatform, workspaceId: string): string {
  return getOAuthUrl(`${ENDPOINTS.connect(platform)}?workspaceId=${workspaceId}`)
}

/**
 * Disconnect a social connection
 */
export async function disconnectConnection(connectionId: string): Promise<DisconnectResponse> {
  return apiClient.delete<DisconnectResponse>(ENDPOINTS.disconnect(connectionId))
}

/**
 * Refresh tokens for a connection
 */
export async function refreshConnection(connectionId: string): Promise<RefreshConnectionResponse> {
  return apiClient.post<RefreshConnectionResponse>(ENDPOINTS.refresh(connectionId))
}

/**
 * Select a Facebook Page to complete the connection
 * Called after OAuth callback returns pending pages
 */
export async function selectFacebookPage(pendingKey: string, pageId: string): Promise<Connection> {
  const response = await apiClient.post<{ data: Connection }>(ENDPOINTS.facebookSelectPage, {
    pendingKey,
    pageId,
  })
  return response.data
}

/**
 * Get pending Facebook pages for a given pending key
 * Used when user navigates away and returns within 10 minutes
 */
export async function getPendingFacebookPages(pendingKey: string): Promise<FacebookPagesResponse> {
  return apiClient.get<FacebookPagesResponse>(ENDPOINTS.facebookPendingPages(pendingKey))
}

// ============================================
// BLUESKY (Credential-based, not OAuth)
// ============================================

/**
 * Bluesky connection response
 */
export interface BlueskyConnectResponse {
  success: boolean
  message: string
  connection: Connection
}

/**
 * Bluesky status response
 */
export interface BlueskyStatusResponse {
  connected: boolean
  connection?: {
    id: string
    platformUsername: string
    displayName: string
    avatarUrl?: string
    isActive: boolean
    needsRefresh: boolean
  }
}

/**
 * Connect Bluesky account with handle and app password
 * Unlike other platforms, Bluesky uses credential-based auth, not OAuth
 * @param handle - Bluesky handle (e.g., "username.bsky.social")
 * @param appPassword - App password from Bluesky settings (NOT account password)
 */
export async function connectBluesky(
  handle: string,
  appPassword: string
): Promise<BlueskyConnectResponse> {
  return apiClient.post<BlueskyConnectResponse>(ENDPOINTS.blueskyConnect, {
    handle,
    appPassword,
  })
}

/**
 * Check Bluesky connection status
 */
export async function getBlueskyStatus(): Promise<BlueskyStatusResponse> {
  return apiClient.get<BlueskyStatusResponse>(ENDPOINTS.blueskyStatus)
}

/**
 * Refresh Bluesky session tokens
 */
export async function refreshBlueskySession(): Promise<{ success: boolean; message: string }> {
  return apiClient.post<{ success: boolean; message: string }>(ENDPOINTS.blueskyRefresh)
}

/**
 * Connections service object (alternative API)
 */
export const connectionsService = {
  getAll: getConnections,
  getConnectUrl,
  disconnect: disconnectConnection,
  refresh: refreshConnection,
  selectFacebookPage,
  getPendingFacebookPages,
  // Bluesky
  connectBluesky,
  getBlueskyStatus,
  refreshBlueskySession,
}
