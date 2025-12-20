import { useState, useEffect, useCallback } from 'react'
import {
  getConnections,
  getConnectUrl,
  disconnectConnection,
  selectFacebookPage,
  connectBluesky,
} from '@/services/connections.service'
import { ApiError } from '@/lib/api-client'
import { useWorkspace } from '@/hooks/useWorkspace'
import type { Connection, SocialPlatform, FacebookPage } from '@/types/connections'

interface UseConnectionsState {
  connections: Connection[]
  isLoading: boolean
  error: string | null
}

interface FacebookPagesData {
  pendingKey: string
  pages: FacebookPage[]
}

interface UseConnectionsReturn extends UseConnectionsState {
  connect: (platform: SocialPlatform) => void
  disconnect: (connectionId: string) => Promise<void>
  refetch: () => Promise<void>
  facebookPagesData: FacebookPagesData | null
  setFacebookPagesData: (data: FacebookPagesData | null) => void
  selectFacebookPageAndConnect: (pageId: string) => Promise<void>
  clearFacebookPages: () => void
  // Bluesky credential flow (not OAuth)
  showBlueskyModal: boolean
  setShowBlueskyModal: (show: boolean) => void
  connectBlueskyAccount: (handle: string, appPassword: string) => Promise<void>
  blueskyLoading: boolean
  blueskyError: string | null
}

/**
 * Hook to manage social media connections
 * Handles fetching, connecting (OAuth redirect), and disconnecting
 */
export function useConnections(): UseConnectionsReturn {
  const { currentWorkspace } = useWorkspace()
  const [state, setState] = useState<UseConnectionsState>({
    connections: [],
    isLoading: true,
    error: null,
  })
  const [facebookPagesData, setFacebookPagesData] = useState<FacebookPagesData | null>(null)

  // Bluesky credential flow state
  const [showBlueskyModal, setShowBlueskyModal] = useState(false)
  const [blueskyLoading, setBlueskyLoading] = useState(false)
  const [blueskyError, setBlueskyError] = useState<string | null>(null)

  /**
   * Fetch all connections
   */
  const fetchConnections = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await getConnections()
      setState({
        connections: response.connections,
        isLoading: false,
        error: null,
      })
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to load connections'
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: message,
      }))
    }
  }, [])

  /**
   * Redirect to OAuth for connecting a platform
   * For Bluesky, opens modal instead (credential-based auth)
   */
  const connect = useCallback(
    (platform: SocialPlatform) => {
      if (!currentWorkspace) {
        setState((prev) => ({
          ...prev,
          error: 'Please select a workspace first.',
        }))
        return
      }

      // Bluesky uses credential-based auth, not OAuth
      if (platform === 'bluesky') {
        setBlueskyError(null)
        setShowBlueskyModal(true)
        return
      }

      // Full page redirect to OAuth
      const url = getConnectUrl(platform, currentWorkspace.id)
      window.location.href = url
    },
    [currentWorkspace]
  )

  /**
   * Disconnect a connection
   */
  const disconnect = useCallback(
    async (connectionId: string) => {
      try {
        await disconnectConnection(connectionId)
        // Optimistically remove from state
        setState((prev) => ({
          ...prev,
          connections: prev.connections.filter((c) => c.id !== connectionId),
        }))
      } catch (err) {
        const message = err instanceof ApiError ? err.message : 'Failed to disconnect'
        setState((prev) => ({ ...prev, error: message }))
        // Refetch to ensure state is accurate
        await fetchConnections()
      }
    },
    [fetchConnections]
  )

  /**
   * Select a Facebook page and complete the connection
   */
  const selectFacebookPageAndConnect = useCallback(
    async (pageId: string) => {
      if (!facebookPagesData) return

      try {
        await selectFacebookPage(facebookPagesData.pendingKey, pageId)
        setFacebookPagesData(null)
        await fetchConnections()
      } catch (err) {
        const message = err instanceof ApiError ? err.message : 'Failed to connect Facebook page'
        setState((prev) => ({ ...prev, error: message }))
        throw err
      }
    },
    [facebookPagesData, fetchConnections]
  )

  /**
   * Clear Facebook pages data (cancel page selection)
   */
  const clearFacebookPages = useCallback(() => {
    setFacebookPagesData(null)
  }, [])

  /**
   * Connect Bluesky account with credentials
   * Called from BlueskyConnectModal after user enters handle and app password
   */
  const connectBlueskyAccount = useCallback(
    async (handle: string, appPassword: string) => {
      setBlueskyLoading(true)
      setBlueskyError(null)

      try {
        await connectBluesky(handle, appPassword)
        setShowBlueskyModal(false)
        await fetchConnections()
      } catch (err) {
        const message =
          err instanceof ApiError
            ? err.message
            : 'Failed to connect Bluesky. Please check your handle and app password.'
        setBlueskyError(message)
        throw err
      } finally {
        setBlueskyLoading(false)
      }
    },
    [fetchConnections]
  )

  // Fetch connections on mount
  useEffect(() => {
    fetchConnections()
  }, [fetchConnections])

  return {
    ...state,
    connect,
    disconnect,
    refetch: fetchConnections,
    facebookPagesData,
    setFacebookPagesData,
    selectFacebookPageAndConnect,
    clearFacebookPages,
    // Bluesky
    showBlueskyModal,
    setShowBlueskyModal,
    connectBlueskyAccount,
    blueskyLoading,
    blueskyError,
  }
}
