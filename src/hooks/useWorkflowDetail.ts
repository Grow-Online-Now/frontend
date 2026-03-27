/**
 * useWorkflowDetail
 * Hook for fetching a single workflow by ID
 */

import { getWorkflow } from '@/services/workflows.service'
import { useFetchData } from '@/hooks/useFetchData'
import type { Workflow } from '@/types/workflow'

interface UseWorkflowDetailReturn {
  workflow: Workflow | null
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export function useWorkflowDetail(id: string | undefined): UseWorkflowDetailReturn {
  const { data, isLoading, error, refetch } = useFetchData(async () => {
    if (!id) return null
    return getWorkflow(id)
  }, [id])

  return { workflow: data, isLoading, error, refetch }
}
