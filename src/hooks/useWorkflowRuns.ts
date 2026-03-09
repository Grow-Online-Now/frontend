/**
 * useWorkflowRuns
 * Hook for fetching execution history for a workflow
 */

import { useState, useEffect, useCallback } from 'react'
import { getWorkflowRuns } from '@/services/workflows.service'
import { useWorkflowEditorStore } from '@/stores/workflowEditorStore'
import type { WorkflowRun } from '@/types/workflow'

interface UseWorkflowRunsReturn {
  runs: WorkflowRun[]
  total: number
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export function useWorkflowRuns(workflowId: string | undefined): UseWorkflowRunsReturn {
  const runCount = useWorkflowEditorStore((s) => s.runCount)
  const [runs, setRuns] = useState<WorkflowRun[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRuns = useCallback(async () => {
    if (!workflowId) return
    try {
      setIsLoading(true)
      setError(null)
      const data = await getWorkflowRuns(workflowId)
      setRuns(data.runs)
      setTotal(data.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch runs')
    } finally {
      setIsLoading(false)
    }
  }, [workflowId])

  useEffect(() => {
    fetchRuns()
  }, [fetchRuns, runCount])

  return { runs, total, isLoading, error, refetch: fetchRuns }
}
