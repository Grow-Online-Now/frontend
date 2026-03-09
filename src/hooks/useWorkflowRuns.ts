/**
 * useWorkflowRuns
 * Hook for fetching execution history for a workflow
 * Currently uses mock data, will integrate with API later
 */

import { useState } from 'react'
import { MOCK_EXECUTIONS } from '@/data/workflow-mocks'
import type { WorkflowRun } from '@/types/workflow'

interface UseWorkflowRunsReturn {
  runs: WorkflowRun[]
  isLoading: boolean
  error: string | null
}

export function useWorkflowRuns(_workflowId: string | undefined): UseWorkflowRunsReturn {
  const [isLoading] = useState(false)
  const [error] = useState<string | null>(null)

  return { runs: MOCK_EXECUTIONS, isLoading, error }
}
