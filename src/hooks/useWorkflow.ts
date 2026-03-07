/**
 * useWorkflow Hook
 * Fetches and manages a single workflow
 */

import { useState, useEffect, useCallback } from 'react'
import { getWorkflow, updateWorkflow as updateWorkflowApi } from '@/services/automations.service'
import type { Workflow, UpdateWorkflowRequest } from '@/types/automations'

interface UseWorkflowState {
  workflow: Workflow | null
  isLoading: boolean
  error: string | null
}

export function useWorkflow(workflowId: string | undefined) {
  const [state, setState] = useState<UseWorkflowState>({
    workflow: null,
    isLoading: true,
    error: null,
  })

  const fetchWorkflow = useCallback(async () => {
    if (!workflowId) return
    setState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      const workflow = await getWorkflow(workflowId)
      setState({ workflow, isLoading: false, error: null })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch workflow'
      setState((prev) => ({ ...prev, isLoading: false, error: message }))
    }
  }, [workflowId])

  useEffect(() => {
    fetchWorkflow()
  }, [fetchWorkflow])

  const updateWorkflow = useCallback(
    async (data: UpdateWorkflowRequest): Promise<Workflow | null> => {
      if (!workflowId) return null
      try {
        const updated = await updateWorkflowApi(workflowId, data)
        setState((prev) => ({ ...prev, workflow: updated }))
        return updated
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update workflow'
        setState((prev) => ({ ...prev, error: message }))
        return null
      }
    },
    [workflowId]
  )

  return {
    ...state,
    updateWorkflow,
    refetch: fetchWorkflow,
  }
}
