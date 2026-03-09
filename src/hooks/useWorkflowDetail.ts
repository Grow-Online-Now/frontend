/**
 * useWorkflowDetail
 * Hook for fetching a single workflow by ID
 */

import { useState, useEffect, useCallback } from 'react'
import { getWorkflow } from '@/services/workflows.service'
import type { Workflow } from '@/types/workflow'

interface UseWorkflowDetailReturn {
  workflow: Workflow | null
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export function useWorkflowDetail(id: string | undefined): UseWorkflowDetailReturn {
  const [workflow, setWorkflow] = useState<Workflow | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchWorkflow = useCallback(async () => {
    if (!id) return
    try {
      setIsLoading(true)
      setError(null)
      const data = await getWorkflow(id)
      setWorkflow(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch workflow')
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchWorkflow()
  }, [fetchWorkflow])

  return { workflow, isLoading, error, refetch: fetchWorkflow }
}
