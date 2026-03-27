/**
 * useWorkflowRuns
 * Hook for fetching execution history for a workflow
 */

import { getWorkflowRuns } from '@/services/workflows.service'
import { useWorkflowEditorStore } from '@/stores/workflowEditorStore'
import { useFetchData } from '@/hooks/useFetchData'
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

  const { data, isLoading, error, refetch } = useFetchData(async () => {
    if (!workflowId) return { runs: [] as WorkflowRun[], total: 0 }
    return getWorkflowRuns(workflowId)
  }, [workflowId, runCount])

  return {
    runs: data?.runs ?? [],
    total: data?.total ?? 0,
    isLoading,
    error,
    refetch,
  }
}
