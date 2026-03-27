/**
 * useNodeTypes
 * Fetches node type definitions from the API
 */

import { useMemo } from 'react'
import { getNodeTypes } from '@/services/workflows.service'
import { useFetchData } from '@/hooks/useFetchData'
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
  const { data, isLoading, error, refetch } = useFetchData(() => getNodeTypes(), [])

  const nodeTypes = useMemo(() => data ?? [], [data])

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

  return { nodeTypes, nodeTypeMap, nodesByCategory, isLoading, error, refetch }
}
