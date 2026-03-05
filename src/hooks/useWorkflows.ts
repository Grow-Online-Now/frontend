/**
 * useWorkflows Hook
 * Fetches and manages workflows with filtering and pagination
 */

import { useState, useEffect, useCallback } from 'react'
import { getWorkflows, deleteWorkflow } from '@/services/automations.service'
import type { Workflow, WorkflowsQueryParams } from '@/types/automations'

interface UseWorkflowsState {
  workflows: Workflow[]
  total: number
  isLoading: boolean
  error: string | null
}

const DEFAULT_FILTERS: WorkflowsQueryParams = {
  limit: 20,
  offset: 0,
}

export function useWorkflows(initialFilters?: WorkflowsQueryParams) {
  const [filters, setFilters] = useState<WorkflowsQueryParams>({
    ...DEFAULT_FILTERS,
    ...initialFilters,
  })

  const [state, setState] = useState<UseWorkflowsState>({
    workflows: [],
    total: 0,
    isLoading: true,
    error: null,
  })

  const fetchWorkflows = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      const response = await getWorkflows(filters)
      setState({
        workflows: response.workflows,
        total: response.total,
        isLoading: false,
        error: null,
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch workflows'
      setState((prev) => ({ ...prev, isLoading: false, error: message }))
    }
  }, [filters])

  useEffect(() => {
    fetchWorkflows()
  }, [fetchWorkflows])

  const updateFilters = useCallback((newFilters: Partial<WorkflowsQueryParams>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      offset: newFilters.offset ?? 0,
    }))
  }, [])

  const deleteWorkflowById = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        await deleteWorkflow(id)
        await fetchWorkflows()
        return true
      } catch {
        return false
      }
    },
    [fetchWorkflows]
  )

  return {
    ...state,
    filters,
    updateFilters,
    refetch: fetchWorkflows,
    deleteWorkflowById,
  }
}
