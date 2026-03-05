/**
 * useWorkflowExecutions Hook
 * Fetches execution history for a workflow
 */

import { useState, useEffect, useCallback } from 'react'
import { getExecutions } from '@/services/automations.service'
import type { WorkflowExecution, ExecutionsQueryParams } from '@/types/automations'

interface UseWorkflowExecutionsState {
  executions: WorkflowExecution[]
  total: number
  isLoading: boolean
  error: string | null
}

const DEFAULT_PARAMS: ExecutionsQueryParams = {
  limit: 20,
  offset: 0,
}

export function useWorkflowExecutions(
  workflowId: string | undefined,
  initialParams?: ExecutionsQueryParams
) {
  const [params, setParams] = useState<ExecutionsQueryParams>({
    ...DEFAULT_PARAMS,
    ...initialParams,
  })

  const [state, setState] = useState<UseWorkflowExecutionsState>({
    executions: [],
    total: 0,
    isLoading: true,
    error: null,
  })

  const fetchExecutions = useCallback(async () => {
    if (!workflowId) return
    setState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      const response = await getExecutions(workflowId, params)
      setState({
        executions: response.executions,
        total: response.total,
        isLoading: false,
        error: null,
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch executions'
      setState((prev) => ({ ...prev, isLoading: false, error: message }))
    }
  }, [workflowId, params])

  useEffect(() => {
    fetchExecutions()
  }, [fetchExecutions])

  const updateParams = useCallback((newParams: Partial<ExecutionsQueryParams>) => {
    setParams((prev) => ({ ...prev, ...newParams }))
  }, [])

  return {
    ...state,
    params,
    updateParams,
    refetch: fetchExecutions,
  }
}
