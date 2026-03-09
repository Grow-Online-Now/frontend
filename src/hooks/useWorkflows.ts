/**
 * useWorkflows
 * Hook for fetching and filtering workflows
 * Currently uses mock data, will integrate with API later
 */

import { useState, useMemo, useCallback } from 'react'
import { MOCK_WORKFLOWS } from '@/data/workflow-mocks'
import type { Workflow, WorkflowStatus } from '@/types/workflow'

type WorkflowFilter = 'all' | WorkflowStatus

interface UseWorkflowsReturn {
  workflows: Workflow[]
  isLoading: boolean
  error: string | null
  filter: WorkflowFilter
  setFilter: (filter: WorkflowFilter) => void
  counts: Record<WorkflowFilter, number>
  refetch: () => void
}

export function useWorkflows(): UseWorkflowsReturn {
  const [isLoading] = useState(false)
  const [error] = useState<string | null>(null)
  const [filter, setFilter] = useState<WorkflowFilter>('all')

  const allWorkflows = MOCK_WORKFLOWS

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

  const refetch = useCallback(() => {
    // Will trigger API refetch when integrated
  }, [])

  return { workflows, isLoading, error, filter, setFilter, counts, refetch }
}
