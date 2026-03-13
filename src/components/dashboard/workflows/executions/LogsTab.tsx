/**
 * LogsTab
 * Chronological step-by-step log view for a selected workflow run.
 * Shows each node execution as a timestamped log entry.
 * Supports retry, run-from-here, and cached step display.
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronRight, ChevronDown, Play, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDurationMs, STEP_STATUS_ICONS, STEP_STATUS_TEXT_CLASSES } from '@/lib/workflow-utils'
import { useWorkflowEditorStore } from '@/stores/workflowEditorStore'
import type { WorkflowRun, WorkflowStepResult } from '@/types/workflow'

interface LogsTabProps {
  runs: WorkflowRun[]
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

  const Icon = STEP_STATUS_ICONS[step.status]
  const def = nodeTypeMap[step.nodeType]
  const label = def?.name ?? step.nodeType

  const hasDetails =
    step.error ||
    (step.input && Object.keys(step.input).length > 0) ||
    (step.output && Object.keys(step.output).length > 0)

  const isCached = step.status === 'cached'
  const isFailed = step.status === 'failed'

  return (
    <div className={cn('border-border-subtle border-b last:border-b-0', isCached && 'opacity-60')}>
      <div
        className={cn(
          'group/step flex w-full items-center gap-3 px-5 py-1.5 text-left transition-colors duration-100',
          hasDetails && 'hover:bg-bg-hover cursor-pointer',
          !hasDetails && 'cursor-default'
        )}
      >
        {/* Expand chevron */}
        <button
          type="button"
          onClick={() => hasDetails && setExpanded(!expanded)}
          className="w-3 shrink-0"
        >
          {hasDetails &&
            (expanded ? (
              <ChevronDown className="text-text-muted h-3 w-3" />
            ) : (
              <ChevronRight className="text-text-muted h-3 w-3" />
            ))}
        </button>

        {/* Timestamp */}
        <span className="text-text-muted w-[70px] shrink-0 font-mono text-[11px]">
          {formatTime(step.startedAt)}
        </span>

        {/* Status icon */}
        <Icon
          className={cn(
            'h-3.5 w-3.5 shrink-0',
            STEP_STATUS_TEXT_CLASSES[step.status],
            step.status === 'running' && 'animate-spin'
          )}
        />

        {/* Node name */}
        <button
          type="button"
          onClick={() => hasDetails && setExpanded(!expanded)}
          className="text-text-primary min-w-0 flex-1 truncate text-left text-xs"
        >
          {label}
          {isCached && (
            <span className="text-text-muted ml-1.5 text-[10px]">
              ({t('dashboard.workflows.executions.logs.cached')})
            </span>
          )}
        </button>

        {/* Duration */}
        <span className="text-text-muted shrink-0 font-mono text-[11px]">
          {formatDurationMs(step.durationMs ?? null)}
        </span>

        {/* Error preview */}
        {step.error && (
          <span className="text-destructive max-w-[200px] shrink-0 truncate text-[11px]">
            {step.error}
          </span>
        )}

        {/* Action buttons */}
        <div className="flex shrink-0 items-center gap-1.5">
          {/* Retry button — always visible on failed steps, with label */}
          {isFailed && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                retryFromNode(run.id, step.nodeId)
              }}
              disabled={isRunning}
              className="bg-destructive-muted text-destructive flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-[10px] font-medium transition-colors duration-100 hover:opacity-80 disabled:opacity-40"
            >
              <RefreshCw className="h-2.5 w-2.5" />
              {t('dashboard.workflows.executions.logs.retry')}
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
            className="text-text-muted hover:bg-bg-active hover:text-text-primary flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-[10px] font-medium opacity-0 transition-all duration-100 group-hover/step:opacity-100 disabled:opacity-40"
            title={t('dashboard.workflows.executions.logs.runFromHere')}
          >
            <Play className="h-2.5 w-2.5" />
          </button>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && hasDetails && (
        <div className="bg-bg-base space-y-2 px-5 py-3 pl-[52px]">
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
      <div className="text-text-muted mb-1 text-[10px] font-medium tracking-wider uppercase">
        {label}
      </div>
      <pre
        className={cn(
          'bg-bg-elevated text-text-secondary max-h-[80px] overflow-auto rounded-md p-2 font-mono text-[11px] leading-relaxed',
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
      <div className="text-text-muted flex h-full items-center justify-center text-xs">
        {t('dashboard.workflows.executions.empty')}
      </div>
    )
  }

  if (run.steps.length === 0) {
    return (
      <div className="text-text-muted flex h-full items-center justify-center text-xs">
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
