/**
 * useWorkflowRunPolling
 * Polls the active workflow run every 1.5s while it's running.
 * Stops when the run completes/fails/pauses and updates the store.
 */

import { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { getWorkflowRun } from '@/services/workflows.service'
import { useWorkflowEditorStore } from '@/stores/workflowEditorStore'

const POLL_INTERVAL = 1500

export function useWorkflowRunPolling(workflowId: string | undefined) {
  const { t } = useTranslation()
  const activeRun = useWorkflowEditorStore((s) => s.activeRun)
  const updateActiveRun = useWorkflowEditorStore((s) => s.updateActiveRun)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    // Only poll when there's an active running run
    if (!workflowId || !activeRun || activeRun.status !== 'running') {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    const runId = activeRun.id

    const poll = async () => {
      try {
        const freshRun = await getWorkflowRun(workflowId, runId)
        updateActiveRun(freshRun)

        // Run completed — stop polling, update store
        if (freshRun.status !== 'running') {
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
          }

          // Set lastRun and increment runCount to trigger runs list refetch
          useWorkflowEditorStore.setState((state) => ({
            lastRun: freshRun,
            runCount: state.runCount + 1,
          }))

          if (freshRun.status === 'success') {
            toast.success(t('dashboard.workflows.editor.toasts.runSuccess'))
          } else if (freshRun.status === 'failed') {
            toast.error(t('dashboard.workflows.editor.toasts.runFailed'))
          } else if (freshRun.status === 'paused') {
            toast.info(t('dashboard.workflows.execution.runPaused'))
          }
        }
      } catch {
        // Silently ignore polling errors — next interval will retry
      }
    }

    intervalRef.current = setInterval(poll, POLL_INTERVAL)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [workflowId, activeRun?.id, activeRun?.status, updateActiveRun, t])
}
