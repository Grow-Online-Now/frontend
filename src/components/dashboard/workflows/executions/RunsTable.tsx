/**
 * RunsTable
 * Table listing workflow execution runs.
 * Clicking a row selects the run and switches to the Logs tab.
 */

import { useTranslation } from 'react-i18next'
import { Check, XCircle, Loader2, Pause, Play } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDurationMs } from '@/lib/workflow-utils'
import { useWorkflowEditorStore } from '@/stores/workflowEditorStore'
import type { WorkflowRun } from '@/types/workflow'

interface RunsTableProps {
  runs: WorkflowRun[]
  isLoading: boolean
}

export function RunsTable({ runs, isLoading }: RunsTableProps) {
  const { t } = useTranslation()
  const selectRun = useWorkflowEditorStore((s) => s.selectRun)
  const selectedRunId = useWorkflowEditorStore((s) => s.selectedRunId)
  const runFromNode = useWorkflowEditorStore((s) => s.runFromNode)
  const isRunning = useWorkflowEditorStore((s) => s.isRunning)

  const handleContinue = (run: WorkflowRun) => {
    // Find the first pending step to continue from
    const pendingStep = run.steps.find((s) => s.status === 'pending')
    if (pendingStep) {
      runFromNode(run.id, pendingStep.nodeId)
    }
  }

  return (
    <div className="overflow-y-auto" style={{ height: 'calc(100% - 37px)' }}>
      <div className="grid grid-cols-[100px_65px_130px_70px_50px_1fr] px-5 py-2 text-[10px] font-medium uppercase tracking-wider text-text-muted">
        <span>{t('dashboard.workflows.executions.columns.runId')}</span>
        <span>{t('dashboard.workflows.executions.columns.status')}</span>
        <span>{t('dashboard.workflows.executions.columns.time')}</span>
        <span>{t('dashboard.workflows.executions.columns.duration')}</span>
        <span>{t('dashboard.workflows.executions.columns.steps')}</span>
        <span />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-text-muted" />
        </div>
      ) : runs.length === 0 ? (
        <div className="px-5 py-6 text-center text-xs text-text-muted">
          {t('dashboard.workflows.executions.empty')}
        </div>
      ) : (
        runs.map((run) => {
          const stepsCompleted = run.steps.filter(
            (s) => s.status === 'success' || s.status === 'cached'
          ).length
          const startedFormatted = new Date(run.startedAt).toLocaleString()

          return (
            <div
              key={run.id}
              onClick={() => selectRun(run.id)}
              className={cn(
                'grid cursor-pointer grid-cols-[100px_65px_130px_70px_50px_1fr] items-center border-t border-border-subtle px-5 py-[7px] transition-colors duration-100 hover:bg-bg-hover',
                selectedRunId === run.id && 'bg-bg-active'
              )}
            >
              <span className="truncate font-mono text-xs text-text-tertiary">
                {run.id.slice(0, 8)}
              </span>
              <span>
                <span
                  className={cn(
                    'inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-[10px] font-semibold',
                    run.status === 'success'
                      ? 'bg-success-muted text-success'
                      : run.status === 'running'
                        ? 'bg-info-muted text-info'
                        : run.status === 'paused'
                          ? 'bg-warning-muted text-warning'
                          : 'bg-destructive-muted text-destructive'
                  )}
                >
                  {run.status === 'success' ? (
                    <Check className="h-2.5 w-2.5" />
                  ) : run.status === 'running' ? (
                    <Loader2 className="h-2.5 w-2.5 animate-spin" />
                  ) : run.status === 'paused' ? (
                    <Pause className="h-2.5 w-2.5" />
                  ) : (
                    <XCircle className="h-2.5 w-2.5" />
                  )}
                </span>
              </span>
              <span className="text-xs text-text-tertiary">{startedFormatted}</span>
              <span className="font-mono text-xs text-text-tertiary">
                {formatDurationMs(run.durationMs)}
              </span>
              <span className="text-xs text-text-tertiary">
                {stepsCompleted}/{run.steps.length}
              </span>
              <span className="flex items-center justify-end gap-2">
                {run.status === 'paused' && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleContinue(run)
                    }}
                    disabled={isRunning}
                    className="flex items-center gap-1 rounded-sm bg-warning-muted px-1.5 py-0.5 text-[10px] font-medium text-warning transition-colors duration-100 hover:opacity-80 disabled:opacity-40"
                  >
                    <Play className="h-2.5 w-2.5" />
                    {t('dashboard.workflows.executions.continue')}
                  </button>
                )}
                <span className="text-[10px] text-text-muted">
                  {t('dashboard.workflows.executions.details')} →
                </span>
              </span>
            </div>
          )
        })
      )}
    </div>
  )
}
