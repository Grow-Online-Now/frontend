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
  const completeRun = useWorkflowEditorStore((s) => s.completeRun)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const activeRunId = activeRun?.id
  const activeRunStatus = activeRun?.status
  const shouldPoll = !!workflowId && !!activeRunId && activeRunStatus === 'running'

  useEffect(() => {
    if (!shouldPoll || !workflowId || !activeRunId) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    const poll = async () => {
      try {
        const freshRun = await getWorkflowRun(workflowId, activeRunId)
        updateActiveRun(freshRun)

        // Run completed — stop polling, update store
        if (freshRun.status !== 'running') {
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
          }

          completeRun(freshRun)

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
  }, [shouldPoll, workflowId, activeRunId, updateActiveRun, completeRun, t])
}
