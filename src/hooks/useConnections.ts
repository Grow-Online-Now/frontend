import { useState, useEffect, useCallback, useRef } from 'react'
import {
  getConnections,
  getConnectUrl,
  disconnectConnection,
  selectFacebookPage,
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
  selectFacebookPageAndConnect: (pageId: string) => Promise<void>
  clearFacebookPages: () => void
}

const POPUP_WIDTH = 600
const POPUP_HEIGHT = 700
const POPUP_POLL_INTERVAL = 500

/**
 * Hook to manage social media connections
 * Handles fetching, connecting (OAuth popup), and disconnecting
 */
export function useConnections(): UseConnectionsReturn {
  const { currentWorkspace } = useWorkspace()
  const [state, setState] = useState<UseConnectionsState>({
    connections: [],
    isLoading: true,
    error: null,
  })
  const [facebookPagesData, setFacebookPagesData] = useState<FacebookPagesData | null>(null)
  const popupRef = useRef<Window | null>(null)
  const receivedFacebookPagesRef = useRef(false)

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
   * Handle messages from OAuth popup (for Facebook page selection)
   */
  const handleOAuthMessage = useCallback(
    (event: MessageEvent) => {
      // Verify origin matches our frontend (the popup sends from same origin)
      if (event.origin !== window.location.origin) {
        return
      }

      const data = event.data
      if (data?.type === 'oauth-callback' && data?.platform === 'facebook' && data?.pages) {
        // Facebook OAuth returned pages for selection
        receivedFacebookPagesRef.current = true
        setFacebookPagesData({
          pendingKey: data.pendingKey,
          pages: data.pages,
        })
        // Close the popup
        popupRef.current?.close()
      } else if (data?.type === 'oauth-callback' && data?.success) {
        // Other platforms: connection complete
        popupRef.current?.close()
        fetchConnections()
      }
    },
    [fetchConnections]
  )

  /**
   * Open OAuth popup for connecting a platform
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

      const url = getConnectUrl(platform, currentWorkspace.id)

      // Calculate popup position (centered)
      const left = window.screenX + (window.outerWidth - POPUP_WIDTH) / 2
      const top = window.screenY + (window.outerHeight - POPUP_HEIGHT) / 2

      const popup = window.open(
        url,
        'oauth-popup',
        `width=${POPUP_WIDTH},height=${POPUP_HEIGHT},left=${left},top=${top},toolbar=no,menubar=no`
      )

      if (!popup) {
        setState((prev) => ({
          ...prev,
          error: 'Popup was blocked. Please allow popups and try again.',
        }))
        return
      }

      popupRef.current = popup
      receivedFacebookPagesRef.current = false

      // Poll for popup close
      const pollInterval = setInterval(() => {
        if (popup.closed) {
          clearInterval(pollInterval)
          popupRef.current = null
          // Refetch connections after popup closes (unless we received Facebook pages to select)
          if (!receivedFacebookPagesRef.current) {
            fetchConnections()
          }
        }
      }, POPUP_POLL_INTERVAL)
    },
    [currentWorkspace, fetchConnections]
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
    receivedFacebookPagesRef.current = false
  }, [])

  // Fetch connections on mount
  useEffect(() => {
    fetchConnections()
  }, [fetchConnections])

  // Listen for OAuth callback messages
  useEffect(() => {
    window.addEventListener('message', handleOAuthMessage)
    return () => {
      window.removeEventListener('message', handleOAuthMessage)
    }
  }, [handleOAuthMessage])

  return {
    ...state,
    connect,
    disconnect,
    refetch: fetchConnections,
    facebookPagesData,
    selectFacebookPageAndConnect,
    clearFacebookPages,
  }
}
