/**
 * usePinterestBoards Hook
 * Manages Pinterest board data and default board selection
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  getPinterestBoards,
  setDefaultPinterestBoard,
  refreshPinterestBoards,
} from '@/services/pinterest.service'
import { ApiError } from '@/lib/api-client'
import type { PinterestBoard } from '@/types/connections'

interface UsePinterestBoardsState {
  boards: PinterestBoard[]
  defaultBoardId: string | null
  isLoading: boolean
  isRefreshing: boolean
  isSettingDefault: boolean
  error: string | null
}

interface UsePinterestBoardsReturn extends UsePinterestBoardsState {
  setDefaultBoard: (boardId: string) => Promise<boolean>
  refresh: () => Promise<void>
  refetch: () => Promise<void>
  defaultBoard: PinterestBoard | null
}

/**
 * Hook to manage Pinterest boards for a connection
 * @param connectionId - The Pinterest connection ID (null to skip fetching)
 */
export function usePinterestBoards(connectionId: string | null): UsePinterestBoardsReturn {
  const [state, setState] = useState<UsePinterestBoardsState>({
    boards: [],
    defaultBoardId: null,
    isLoading: false,
    isRefreshing: false,
    isSettingDefault: false,
    error: null,
  })

  /**
   * Fetch boards for the connection
   */
  const fetchBoards = useCallback(async () => {
    if (!connectionId) return

    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await getPinterestBoards(connectionId)
      setState({
        boards: response.boards,
        defaultBoardId: response.defaultBoardId,
        isLoading: false,
        isRefreshing: false,
        isSettingDefault: false,
        error: null,
      })
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to load boards'
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: message,
      }))
    }
  }, [connectionId])

  /**
   * Set the default board
   */
  const setDefaultBoard = useCallback(
    async (boardId: string): Promise<boolean> => {
      if (!connectionId) return false

      setState((prev) => ({ ...prev, isSettingDefault: true, error: null }))

      try {
        await setDefaultPinterestBoard(connectionId, boardId)
        setState((prev) => ({
          ...prev,
          defaultBoardId: boardId,
          isSettingDefault: false,
        }))
        return true
      } catch (err) {
        const message = err instanceof ApiError ? err.message : 'Failed to set default board'
        setState((prev) => ({
          ...prev,
          isSettingDefault: false,
          error: message,
        }))
        return false
      }
    },
    [connectionId]
  )

  /**
   * Refresh boards list from Pinterest
   */
  const refresh = useCallback(async () => {
    if (!connectionId) return

    setState((prev) => ({ ...prev, isRefreshing: true, error: null }))

    try {
      const response = await refreshPinterestBoards(connectionId)
      setState((prev) => ({
        ...prev,
        boards: response.boards,
        defaultBoardId: response.defaultBoardId,
        isRefreshing: false,
      }))
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to refresh boards'
      setState((prev) => ({
        ...prev,
        isRefreshing: false,
        error: message,
      }))
    }
  }, [connectionId])

  // Fetch on mount/connectionId change
  useEffect(() => {
    if (connectionId) {
      fetchBoards()
    } else {
      // Reset state when no connection
      setState({
        boards: [],
        defaultBoardId: null,
        isLoading: false,
        isRefreshing: false,
        isSettingDefault: false,
        error: null,
      })
    }
  }, [connectionId, fetchBoards])

  // Computed: default board object
  const defaultBoard = useMemo(
    () => state.boards.find((b) => b.id === state.defaultBoardId) ?? null,
    [state.boards, state.defaultBoardId]
  )

  return {
    ...state,
    setDefaultBoard,
    refresh,
    refetch: fetchBoards,
    defaultBoard,
  }
}
