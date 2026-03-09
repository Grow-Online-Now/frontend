/**
 * useNodeTypes
 * Fetches node type definitions from the API
 */

import { useState, useEffect, useMemo, useCallback } from 'react'
import { getNodeTypes } from '@/services/workflows.service'
import type { NodeTypeDefinition, NodeCategory } from '@/types/workflow'

interface UseNodeTypesReturn {
  nodeTypes: NodeTypeDefinition[]
  nodeTypeMap: Record<string, NodeTypeDefinition>
  nodesByCategory: Record<NodeCategory, NodeTypeDefinition[]>
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export function useNodeTypes(): UseNodeTypesReturn {
  const [nodeTypes, setNodeTypes] = useState<NodeTypeDefinition[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchNodeTypes = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getNodeTypes()
      setNodeTypes(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch node types')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchNodeTypes()
  }, [fetchNodeTypes])

  const nodeTypeMap = useMemo(() => {
    const map: Record<string, NodeTypeDefinition> = {}
    for (const nt of nodeTypes) {
      map[nt.type] = nt
    }
    return map
  }, [nodeTypes])

  const nodesByCategory = useMemo(() => {
    const map = {} as Record<NodeCategory, NodeTypeDefinition[]>
    for (const nt of nodeTypes) {
      if (!map[nt.category]) map[nt.category] = []
      map[nt.category].push(nt)
    }
    return map
  }, [nodeTypes])

  return { nodeTypes, nodeTypeMap, nodesByCategory, isLoading, error, refetch: fetchNodeTypes }
}
