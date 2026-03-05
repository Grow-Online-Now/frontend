/**
 * useNodeRegistry Hook
 * Fetches available node types from the automations node registry
 */

import { useState, useEffect, useCallback } from 'react'
import { getNodeRegistry } from '@/services/automations.service'
import type { NodeHandlerDescriptor } from '@/types/automations'

interface UseNodeRegistryState {
  nodeTypes: NodeHandlerDescriptor[]
  isLoading: boolean
  error: string | null
}

export function useNodeRegistry() {
  const [state, setState] = useState<UseNodeRegistryState>({
    nodeTypes: [],
    isLoading: true,
    error: null,
  })

  const fetchNodeTypes = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      const nodeTypes = await getNodeRegistry()
      setState({ nodeTypes, isLoading: false, error: null })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch node types'
      setState((prev) => ({ ...prev, isLoading: false, error: message }))
    }
  }, [])

  useEffect(() => {
    fetchNodeTypes()
  }, [fetchNodeTypes])

  const getNodeType = useCallback(
    (type: string) => state.nodeTypes.find((n) => n.type === type),
    [state.nodeTypes]
  )

  return {
    ...state,
    getNodeType,
    refetch: fetchNodeTypes,
  }
}
