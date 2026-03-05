/**
 * useExecutionPolling Hook
 * Polls a single execution until it reaches a terminal status
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { getExecution } from '@/services/automations.service'
import type { WorkflowExecution, ExecutionStatus } from '@/types/automations'

const POLL_INTERVAL = 2500
const TERMINAL_STATUSES: ExecutionStatus[] = ['COMPLETED', 'FAILED', 'CANCELLED']

export function useExecutionPolling(executionId: string | undefined) {
  const [execution, setExecution] = useState<WorkflowExecution | null>(null)
  const [isPolling, setIsPolling] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const mountedRef = useRef(true)

  const stopPolling = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setIsPolling(false)
  }, [])

  const poll = useCallback(async () => {
    if (!executionId || !mountedRef.current) return

    try {
      const data = await getExecution(executionId)
      if (!mountedRef.current) return

      setExecution(data)
      setError(null)

      if (TERMINAL_STATUSES.includes(data.status)) {
        stopPolling()
      } else {
        timeoutRef.current = setTimeout(poll, POLL_INTERVAL)
      }
    } catch (err) {
      if (!mountedRef.current) return
      setError(err instanceof Error ? err.message : 'Failed to fetch execution')
      stopPolling()
    }
  }, [executionId, stopPolling])

  const startPolling = useCallback(() => {
    setIsPolling(true)
    poll()
  }, [poll])

  // Auto-start polling when executionId is provided
  useEffect(() => {
    if (executionId) {
      startPolling()
    }
    return () => {
      stopPolling()
    }
  }, [executionId, startPolling, stopPolling])

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  return { execution, isPolling, error, startPolling, stopPolling }
}
