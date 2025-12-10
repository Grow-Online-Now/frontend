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
 */
export function getConnectUrl(platform: SocialPlatform): string {
  return getOAuthUrl(ENDPOINTS.connect(platform))
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
}
