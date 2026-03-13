/**
 * useWorkflows
 * Hook for fetching and filtering workflows
 */

import { useState, useEffect, useMemo, useCallback } from 'react'
import {
  getWorkflows,
  deleteWorkflow as deleteWorkflowApi,
  createWorkflow as createWorkflowApi,
  updateWorkflow as updateWorkflowApi,
} from '@/services/workflows.service'
import type { Workflow, WorkflowStatus, CreateWorkflowRequest } from '@/types/workflow'

type WorkflowFilter = 'all' | WorkflowStatus

interface UseWorkflowsReturn {
  workflows: Workflow[]
  isLoading: boolean
  error: string | null
  filter: WorkflowFilter
  setFilter: (filter: WorkflowFilter) => void
  counts: Record<WorkflowFilter, number>
  refetch: () => void
  deleteWorkflow: (id: string) => Promise<boolean>
  createWorkflow: (data: CreateWorkflowRequest) => Promise<Workflow | null>
  renameWorkflow: (id: string, name: string) => Promise<boolean>
}

export function useWorkflows(): UseWorkflowsReturn {
  const [allWorkflows, setAllWorkflows] = useState<Workflow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<WorkflowFilter>('all')

  const fetchWorkflows = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getWorkflows()
      setAllWorkflows(data.workflows)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch workflows')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchWorkflows()
  }, [fetchWorkflows])

  const counts = useMemo(
    () => ({
      all: allWorkflows.length,
      active: allWorkflows.filter((w) => w.status === 'active').length,
      paused: allWorkflows.filter((w) => w.status === 'paused').length,
      draft: allWorkflows.filter((w) => w.status === 'draft').length,
    }),
    [allWorkflows]
  )

  const workflows = useMemo(
    () => (filter === 'all' ? allWorkflows : allWorkflows.filter((w) => w.status === filter)),
    [allWorkflows, filter]
  )

  const deleteWorkflow = useCallback(async (id: string): Promise<boolean> => {
    try {
      await deleteWorkflowApi(id)
      setAllWorkflows((prev) => prev.filter((w) => w.id !== id))
      return true
    } catch {
      return false
    }
  }, [])

  const createWorkflow = useCallback(
    async (data: CreateWorkflowRequest): Promise<Workflow | null> => {
      try {
        const wf = await createWorkflowApi(data)
        setAllWorkflows((prev) => [wf, ...prev])
        return wf
      } catch {
        return null
      }
    },
    []
  )

  const renameWorkflow = useCallback(async (id: string, name: string): Promise<boolean> => {
    try {
      const updated = await updateWorkflowApi(id, { name })
      setAllWorkflows((prev) => prev.map((w) => (w.id === id ? { ...w, name: updated.name } : w)))
      return true
    } catch {
      return false
    }
  }, [])

  return {
    workflows,
    isLoading,
    error,
    filter,
    setFilter,
    counts,
    refetch: fetchWorkflows,
    deleteWorkflow,
    createWorkflow,
    renameWorkflow,
  }
}
