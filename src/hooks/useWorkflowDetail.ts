/**
 * useWorkflowDetail
 * Hook for fetching a single workflow by ID
 * Currently uses mock data, will integrate with API later
 */

import { useState, useEffect } from 'react'
import { MOCK_WORKFLOWS, MOCK_EDITOR_NODES, MOCK_EDITOR_EDGES } from '@/data/workflow-mocks'
import type { Workflow } from '@/types/workflow'

interface UseWorkflowDetailReturn {
  workflow: Workflow | null
  isLoading: boolean
  error: string | null
}

export function useWorkflowDetail(id: string | undefined): UseWorkflowDetailReturn {
  const [workflow, setWorkflow] = useState<Workflow | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error] = useState<string | null>(null)

  useEffect(() => {
    setIsLoading(true)
    const wf = MOCK_WORKFLOWS.find((w) => w.id === id)
    if (wf) {
      setWorkflow({
        ...wf,
        nodes: MOCK_EDITOR_NODES,
        edges: MOCK_EDITOR_EDGES,
      })
    }
    setIsLoading(false)
  }, [id])

  return { workflow, isLoading, error }
}
