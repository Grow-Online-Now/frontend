/**
 * ExecutionDataTab
 * Displays execution data for the selected node in execution mode.
 * Shows status, duration, input/output JSON, error, and action buttons.
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Check,
  XCircle,
  Loader2,
  Database,
  SkipForward,
  Clock,
  ChevronDown,
  ChevronRight,
  RefreshCw,
  Play,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDurationMs } from '@/lib/workflow-utils'
import { useWorkflowEditorStore } from '@/stores/workflowEditorStore'
import type { StepStatus } from '@/types/workflow'

const statusIcon: Record<StepStatus, typeof Check> = {
  success: Check,
  failed: XCircle,
  running: Loader2,
  skipped: SkipForward,
  pending: Clock,
  cached: Database,
}

const statusBg: Record<StepStatus, string> = {
  success: 'bg-success-muted text-success',
  failed: 'bg-destructive-muted text-destructive',
  running: 'bg-info-muted text-info',
  skipped: 'bg-bg-hover text-text-muted',
  pending: 'bg-bg-hover text-text-muted',
  cached: 'bg-info-muted text-info/60',
}

function CollapsibleJson({ label, data }: { label: string; data: Record<string, unknown> | null }) {
  const [expanded, setExpanded] = useState(false)

  if (!data || Object.keys(data).length === 0) return null

  return (
    <div>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="mb-1.5 flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-text-muted"
      >
        {expanded ? (
          <ChevronDown className="h-2.5 w-2.5" />
        ) : (
          <ChevronRight className="h-2.5 w-2.5" />
        )}
        {label}
      </button>
      {expanded && (
        <pre className="max-h-[200px] overflow-auto rounded-md bg-bg-elevated p-2.5 font-mono text-[11px] leading-relaxed text-text-secondary">
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
      <div className="flex flex-1 items-center justify-center py-8 text-xs text-text-muted">
        {t('dashboard.workflows.execution.noData')}
      </div>
    )
  }

  const step = nodeStepMap[selectedNodeId]

  if (!step) {
    return (
      <div className="flex flex-1 items-center justify-center py-8 text-xs text-text-muted">
        {t('dashboard.workflows.execution.noData')}
      </div>
    )
  }

  const Icon = statusIcon[step.status]

  return (
    <div className="space-y-4">
      {/* Status badge + duration */}
      <div className="flex items-center justify-between">
        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded-sm px-2 py-1 text-xs font-semibold',
            statusBg[step.status],
          )}
        >
          <Icon
            className={cn('h-3 w-3', step.status === 'running' && 'animate-spin')}
          />
          {t(`dashboard.workflows.execution.status.${step.status}`)}
        </span>
        {step.durationMs != null && (
          <span className="font-mono text-xs text-text-muted">
            {formatDurationMs(step.durationMs)}
          </span>
        )}
      </div>

      {/* Error section */}
      {step.error && (
        <div>
          <div className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-destructive">
            {t('dashboard.workflows.execution.error')}
          </div>
          <pre className="max-h-[100px] overflow-auto rounded-md bg-destructive-muted p-2.5 font-mono text-[11px] leading-relaxed text-destructive">
            {step.error}
          </pre>
        </div>
      )}

      {/* Input data */}
      <CollapsibleJson
        label={t('dashboard.workflows.execution.input')}
        data={step.input}
      />

      {/* Output data */}
      <CollapsibleJson
        label={t('dashboard.workflows.execution.output')}
        data={step.output}
      />

      {/* Action buttons */}
      <div className="flex gap-2 pt-2">
        {step.status === 'failed' && (
          <button
            type="button"
            onClick={() => retryFromNode(activeRun.id, selectedNodeId)}
            disabled={isRunning}
            className="flex items-center gap-1.5 rounded-md border border-destructive/30 bg-destructive-muted px-3 py-1.5 text-xs font-medium text-destructive transition-colors duration-150 hover:opacity-80 disabled:opacity-40"
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
            className="flex items-center gap-1.5 rounded-md border border-border-subtle bg-bg-elevated px-3 py-1.5 text-xs font-medium text-text-primary transition-colors duration-150 hover:bg-bg-hover disabled:opacity-40"
          >
            <Play className="h-3 w-3" />
            {t('dashboard.workflows.execution.runThisNode')}
          </button>
        )}
        <button
          type="button"
          onClick={() => runFromNode(activeRun.id, selectedNodeId)}
          disabled={isRunning}
          className="flex items-center gap-1.5 rounded-md border border-border-subtle bg-bg-elevated px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors duration-150 hover:bg-bg-hover disabled:opacity-40"
        >
          <Play className="h-3 w-3" />
          {t('dashboard.workflows.execution.runFromHere')}
        </button>
      </div>
    </div>
  )
}
