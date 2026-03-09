/**
 * ExecutionPanel
 * Bottom collapsible panel showing workflow execution history
 */

import { useTranslation } from 'react-i18next'
import { X, Check, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useWorkflowEditorStore } from '@/stores/workflowEditorStore'
import { MOCK_EXECUTIONS } from '@/data/workflow-mocks'

export function ExecutionPanel() {
  const { t } = useTranslation()
  const bottomPanelOpen = useWorkflowEditorStore((s) => s.bottomPanelOpen)
  const setBottomPanelOpen = useWorkflowEditorStore((s) => s.setBottomPanelOpen)

  if (!bottomPanelOpen) return null

  return (
    <div className="h-[170px] shrink-0 border-t border-border-subtle bg-bg-elevated">
      {/* Tabs header */}
      <div className="flex items-center border-b border-border-subtle">
        <button
          type="button"
          className="border-b-2 border-foreground px-5 py-2.5 text-sm font-medium text-foreground"
        >
          {t('dashboard.workflows.executions.title')}
        </button>
        <button
          type="button"
          className="border-b-2 border-transparent px-5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          {t('dashboard.workflows.executions.logs')}
        </button>
        <button
          type="button"
          onClick={() => setBottomPanelOpen(false)}
          className="ml-auto px-4 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Table */}
      <div className="overflow-y-auto">
        {/* Header row */}
        <div className="grid grid-cols-[100px_65px_130px_70px_50px_1fr] px-5 py-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          <span>{t('dashboard.workflows.executions.columns.runId')}</span>
          <span>{t('dashboard.workflows.executions.columns.status')}</span>
          <span>{t('dashboard.workflows.executions.columns.time')}</span>
          <span>{t('dashboard.workflows.executions.columns.duration')}</span>
          <span>{t('dashboard.workflows.executions.columns.steps')}</span>
          <span />
        </div>

        {/* Data rows */}
        {MOCK_EXECUTIONS.map((run) => (
          <div
            key={run.id}
            className="grid cursor-pointer grid-cols-[100px_65px_130px_70px_50px_1fr] items-center border-t border-border-subtle px-5 py-[7px] transition-colors duration-100 hover:bg-bg-hover"
          >
            <span className="font-mono text-xs text-muted-foreground">{run.id}</span>
            <span>
              <span
                className={cn(
                  'inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-[10px] font-semibold',
                  run.status === 'success'
                    ? 'bg-success-muted text-success'
                    : 'bg-destructive-muted text-destructive'
                )}
              >
                {run.status === 'success' ? (
                  <Check className="h-2.5 w-2.5" />
                ) : (
                  <XCircle className="h-2.5 w-2.5" />
                )}
              </span>
            </span>
            <span className="text-xs text-muted-foreground">{run.startedAt}</span>
            <span className="font-mono text-xs text-muted-foreground">{run.duration}</span>
            <span className="text-xs text-muted-foreground">
              {run.stepsCompleted}/{run.stepsTotal}
            </span>
            <span className="text-right text-[10px] text-muted-foreground">
              {t('dashboard.workflows.executions.details')} →
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
