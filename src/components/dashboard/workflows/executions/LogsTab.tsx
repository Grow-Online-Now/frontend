/**
 * LogsTab
 * Chronological step-by-step log view for a selected workflow run.
 * Shows each node execution as a timestamped log entry.
 * Supports retry, run-from-here, and cached step display.
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Check,
  XCircle,
  Loader2,
  SkipForward,
  ChevronRight,
  ChevronDown,
  Play,
  RefreshCw,
  Database,
  Clock,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDurationMs } from '@/lib/workflow-utils'
import { useWorkflowEditorStore } from '@/stores/workflowEditorStore'
import type { WorkflowRun, WorkflowStepResult, StepStatus } from '@/types/workflow'

interface LogsTabProps {
  runs: WorkflowRun[]
}

const statusIcon: Record<StepStatus, typeof Check> = {
  success: Check,
  failed: XCircle,
  running: Loader2,
  skipped: SkipForward,
  pending: Clock,
  cached: Database,
}

const statusStyle: Record<StepStatus, string> = {
  success: 'text-success',
  failed: 'text-destructive',
  running: 'text-info',
  skipped: 'text-text-muted',
  pending: 'text-text-muted',
  cached: 'text-info/60',
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

function StepRow({ step, run }: { step: WorkflowStepResult; run: WorkflowRun }) {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)
  const nodeTypeMap = useWorkflowEditorStore((s) => s.nodeTypeMap)
  const isRunning = useWorkflowEditorStore((s) => s.isRunning)
  const retryFromNode = useWorkflowEditorStore((s) => s.retryFromNode)
  const runFromNode = useWorkflowEditorStore((s) => s.runFromNode)

  const Icon = statusIcon[step.status]
  const def = nodeTypeMap[step.nodeType]
  const label = def?.name ?? step.nodeType

  const hasDetails =
    step.error || (step.input && Object.keys(step.input).length > 0) || (step.output && Object.keys(step.output).length > 0)

  const isCached = step.status === 'cached'
  const isFailed = step.status === 'failed'

  return (
    <div className={cn('border-b border-border-subtle last:border-b-0', isCached && 'opacity-60')}>
      <div
        className={cn(
          'group/step flex w-full items-center gap-3 px-5 py-1.5 text-left transition-colors duration-100',
          hasDetails && 'cursor-pointer hover:bg-bg-hover',
          !hasDetails && 'cursor-default'
        )}
      >
        {/* Expand chevron */}
        <button
          type="button"
          onClick={() => hasDetails && setExpanded(!expanded)}
          className="w-3 shrink-0"
        >
          {hasDetails && (
            expanded
              ? <ChevronDown className="h-3 w-3 text-text-muted" />
              : <ChevronRight className="h-3 w-3 text-text-muted" />
          )}
        </button>

        {/* Timestamp */}
        <span className="w-[70px] shrink-0 font-mono text-[11px] text-text-muted">
          {formatTime(step.startedAt)}
        </span>

        {/* Status icon */}
        <Icon
          className={cn(
            'h-3.5 w-3.5 shrink-0',
            statusStyle[step.status],
            step.status === 'running' && 'animate-spin'
          )}
        />

        {/* Node name */}
        <button
          type="button"
          onClick={() => hasDetails && setExpanded(!expanded)}
          className="min-w-0 flex-1 truncate text-left text-xs text-text-primary"
        >
          {label}
          {isCached && (
            <span className="ml-1.5 text-[10px] text-text-muted">
              ({t('dashboard.workflows.executions.logs.cached')})
            </span>
          )}
        </button>

        {/* Duration */}
        <span className="shrink-0 font-mono text-[11px] text-text-muted">
          {formatDurationMs(step.durationMs ?? null)}
        </span>

        {/* Error preview */}
        {step.error && (
          <span className="max-w-[200px] shrink-0 truncate text-[11px] text-destructive">
            {step.error}
          </span>
        )}

        {/* Action buttons */}
        <div className="flex shrink-0 items-center gap-1">
          {/* Retry button — always visible on failed steps */}
          {isFailed && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                retryFromNode(run.id, step.nodeId)
              }}
              disabled={isRunning}
              className="flex h-5 w-5 items-center justify-center rounded-sm text-destructive transition-colors duration-100 hover:bg-destructive-muted disabled:opacity-40"
              title={t('dashboard.workflows.executions.logs.retry')}
            >
              <RefreshCw className="h-3 w-3" />
            </button>
          )}

          {/* Run from here — visible on hover */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              runFromNode(run.id, step.nodeId)
            }}
            disabled={isRunning}
            className="flex h-5 w-5 items-center justify-center rounded-sm text-text-muted opacity-0 transition-all duration-100 hover:bg-bg-active hover:text-text-primary group-hover/step:opacity-100 disabled:opacity-40"
            title={t('dashboard.workflows.executions.logs.runFromHere')}
          >
            <Play className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && hasDetails && (
        <div className="space-y-2 bg-bg-base px-5 py-3 pl-[52px]">
          {step.error && (
            <DetailBlock
              label={t('dashboard.workflows.executions.logs.error')}
              content={step.error}
              className="text-destructive"
            />
          )}
          {step.input && Object.keys(step.input).length > 0 && (
            <DetailBlock
              label={t('dashboard.workflows.executions.logs.input')}
              content={JSON.stringify(step.input, null, 2)}
            />
          )}
          {step.output && Object.keys(step.output).length > 0 && (
            <DetailBlock
              label={t('dashboard.workflows.executions.logs.output')}
              content={JSON.stringify(step.output, null, 2)}
            />
          )}
        </div>
      )}
    </div>
  )
}

function DetailBlock({
  label,
  content,
  className,
}: {
  label: string
  content: string
  className?: string
}) {
  return (
    <div>
      <div className="mb-1 text-[10px] font-medium uppercase tracking-wider text-text-muted">
        {label}
      </div>
      <pre
        className={cn(
          'max-h-[80px] overflow-auto rounded-md bg-bg-elevated p-2 font-mono text-[11px] leading-relaxed text-text-secondary',
          className
        )}
      >
        {content}
      </pre>
    </div>
  )
}

export function LogsTab({ runs }: LogsTabProps) {
  const { t } = useTranslation()
  const selectedRunId = useWorkflowEditorStore((s) => s.selectedRunId)

  const run = runs.find((r) => r.id === selectedRunId) ?? runs[0] ?? null

  if (!run) {
    return (
      <div className="flex h-full items-center justify-center text-xs text-text-muted">
        {t('dashboard.workflows.executions.empty')}
      </div>
    )
  }

  if (run.steps.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-xs text-text-muted">
        {t('dashboard.workflows.executions.logs.noSteps')}
      </div>
    )
  }

  return (
    <div className="overflow-y-auto" style={{ height: 'calc(100% - 37px)' }}>
      {run.steps.map((step, i) => (
        <StepRow key={`${step.nodeId}-${i}`} step={step} run={run} />
      ))}
    </div>
  )
}
