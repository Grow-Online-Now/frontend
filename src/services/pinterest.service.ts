/**
 * Pinterest Service
 * Handles Pinterest-specific API calls (boards management)
 */

import { apiClient } from '@/lib/api-client'
import type { PinterestBoardsResponse, SetDefaultBoardResponse } from '@/types/connections'

const ENDPOINTS = {
  boards: (connectionId: string) => `/api/oauth/pinterest/boards/${connectionId}`,
  setDefault: (connectionId: string) => `/api/oauth/pinterest/boards/${connectionId}/default`,
  refresh: (connectionId: string) => `/api/oauth/pinterest/boards/${connectionId}/refresh`,
} as const

/**
 * Get boards and default board for a Pinterest connection
 */
export async function getPinterestBoards(connectionId: string): Promise<PinterestBoardsResponse> {
  return apiClient.get<PinterestBoardsResponse>(ENDPOINTS.boards(connectionId))
}

/**
 * Set the default board for a Pinterest connection
 */
export async function setDefaultPinterestBoard(
  connectionId: string,
  boardId: string
): Promise<SetDefaultBoardResponse> {
  return apiClient.post<SetDefaultBoardResponse>(ENDPOINTS.setDefault(connectionId), { boardId })
}

/**
 * Refresh the boards list from Pinterest
 */
export async function refreshPinterestBoards(
  connectionId: string
): Promise<PinterestBoardsResponse> {
  return apiClient.post<PinterestBoardsResponse>(ENDPOINTS.refresh(connectionId))
}

/**
 * Pinterest service object (alternative API)
 */
export const pinterestService = {
  getBoards: getPinterestBoards,
  setDefaultBoard: setDefaultPinterestBoard,
  refreshBoards: refreshPinterestBoards,
}
