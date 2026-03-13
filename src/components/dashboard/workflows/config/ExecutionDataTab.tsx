/**
 * ExecutionDataTab
 * Displays execution data for the selected node in execution mode.
 * Shows status, duration, input/output JSON, error, and action buttons.
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDown, ChevronRight, RefreshCw, Play } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  formatDurationMs,
  STEP_STATUS_ICONS,
  STEP_STATUS_BADGE_CLASSES,
} from '@/lib/workflow-utils'
import { useWorkflowEditorStore } from '@/stores/workflowEditorStore'

function CollapsibleJson({ label, data }: { label: string; data: Record<string, unknown> | null }) {
  const [expanded, setExpanded] = useState(false)

  if (!data || Object.keys(data).length === 0) return null

  return (
    <div>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="text-text-muted mb-1.5 flex items-center gap-1 text-[10px] font-medium tracking-wider uppercase"
      >
        {expanded ? (
          <ChevronDown className="h-2.5 w-2.5" />
        ) : (
          <ChevronRight className="h-2.5 w-2.5" />
        )}
        {label}
      </button>
      {expanded && (
        <pre className="bg-bg-elevated text-text-secondary max-h-[200px] overflow-auto rounded-md p-2.5 font-mono text-[11px] leading-relaxed">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  )
}

export function ExecutionDataTab() {
  const { t } = useTranslation()
  const selectedNodeId = useWorkflowEditorStore((s) => s.selectedNodeId)
  const activeRun = useWorkflowEditorStore((s) => s.activeRun)
  const nodeStepMap = useWorkflowEditorStore((s) => s.nodeStepMap)
  const isRunning = useWorkflowEditorStore((s) => s.isRunning)
  const retryFromNode = useWorkflowEditorStore((s) => s.retryFromNode)
  const runFromNode = useWorkflowEditorStore((s) => s.runFromNode)
  const stepNode = useWorkflowEditorStore((s) => s.stepNode)

  if (!selectedNodeId || !activeRun) {
    return (
      <div className="text-text-muted flex flex-1 items-center justify-center py-8 text-xs">
        {t('dashboard.workflows.execution.noData')}
      </div>
    )
  }

  const step = nodeStepMap[selectedNodeId]

  if (!step) {
    return (
      <div className="text-text-muted flex flex-1 items-center justify-center py-8 text-xs">
        {t('dashboard.workflows.execution.noData')}
      </div>
    )
  }

  const Icon = STEP_STATUS_ICONS[step.status]

  return (
    <div className="space-y-4">
      {/* Status badge + duration */}
      <div className="flex items-center justify-between">
        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded-sm px-2 py-1 text-xs font-semibold',
            STEP_STATUS_BADGE_CLASSES[step.status]
          )}
        >
          <Icon className={cn('h-3 w-3', step.status === 'running' && 'animate-spin')} />
          {t(`dashboard.workflows.execution.status.${step.status}`)}
        </span>
        {step.durationMs != null && (
          <span className="text-text-muted font-mono text-xs">
            {formatDurationMs(step.durationMs)}
          </span>
        )}
      </div>

      {/* Error section */}
      {step.error && (
        <div>
          <div className="text-destructive mb-1.5 text-[10px] font-medium tracking-wider uppercase">
            {t('dashboard.workflows.execution.error')}
          </div>
          <pre className="bg-destructive-muted text-destructive max-h-[100px] overflow-auto rounded-md p-2.5 font-mono text-[11px] leading-relaxed">
            {step.error}
          </pre>
        </div>
      )}

      {/* Input data */}
      <CollapsibleJson label={t('dashboard.workflows.execution.input')} data={step.input} />

      {/* Output data */}
      <CollapsibleJson label={t('dashboard.workflows.execution.output')} data={step.output} />

      {/* Action buttons */}
      <div className="flex gap-2 pt-2">
        {step.status === 'failed' && (
          <button
            type="button"
            onClick={() => retryFromNode(activeRun.id, selectedNodeId)}
            disabled={isRunning}
            className="border-destructive/30 bg-destructive-muted text-destructive flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors duration-150 hover:opacity-80 disabled:opacity-40"
          >
            <RefreshCw className="h-3 w-3" />
            {t('dashboard.workflows.execution.retry')}
          </button>
        )}
        {step.status === 'pending' && (
          <button
            type="button"
            onClick={() => stepNode(activeRun.id, selectedNodeId)}
            disabled={isRunning}
            className="border-border-subtle bg-bg-elevated text-text-primary hover:bg-bg-hover flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors duration-150 disabled:opacity-40"
          >
            <Play className="h-3 w-3" />
            {t('dashboard.workflows.execution.runThisNode')}
          </button>
        )}
        <button
          type="button"
          onClick={() => runFromNode(activeRun.id, selectedNodeId)}
          disabled={isRunning}
          className="border-border-subtle bg-bg-elevated text-text-secondary hover:bg-bg-hover flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors duration-150 disabled:opacity-40"
        >
          <Play className="h-3 w-3" />
          {t('dashboard.workflows.execution.runFromHere')}
        </button>
      </div>
    </div>
  )
}
