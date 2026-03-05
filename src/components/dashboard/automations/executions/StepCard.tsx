/**
 * StepCard Component
 * Displays a single step execution with expandable I/O data
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { StepStatusBadge } from '../StepStatusBadge'
import { JsonViewer } from './JsonViewer'
import type { StepExecution } from '@/types/automations'

interface StepCardProps {
  step: StepExecution
  index: number
}

export function StepCard({ step, index }: StepCardProps) {
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)

  const duration =
    step.startedAt && step.completedAt
      ? Math.round(
          (new Date(step.completedAt).getTime() - new Date(step.startedAt).getTime()) /
            1000
        )
      : null

  return (
    <div className="bg-bg-elevated border-border rounded-xl border">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="hover:bg-bg-hover flex w-full items-center gap-3 rounded-xl px-4 py-3 transition-all duration-150"
      >
        <span className="text-text-muted flex size-6 items-center justify-center rounded-md font-mono text-xs">
          {index + 1}
        </span>

        {isExpanded ? (
          <ChevronDown className="text-text-muted size-4" />
        ) : (
          <ChevronRight className="text-text-muted size-4" />
        )}

        <div className="flex-1 text-left">
          <span className="text-text-primary text-sm font-medium">{step.nodeId}</span>
          <span className="text-text-muted ml-2 text-xs">{step.nodeType}</span>
        </div>

        <StepStatusBadge status={step.status} />

        {duration !== null && (
          <span className="text-text-muted text-xs">
            {t('dashboard.automations.executions.duration', { seconds: duration })}
          </span>
        )}
      </button>

      {isExpanded && (
        <div className="border-border space-y-3 border-t px-4 py-3">
          {step.error && (
            <div className="bg-destructive/5 border-destructive/20 rounded-lg border p-3">
              <p className="text-destructive text-xs font-medium">
                {t('dashboard.automations.executions.error')}
              </p>
              <p className="text-destructive/80 mt-1 text-xs">{step.error}</p>
            </div>
          )}

          <div>
            <p className="text-text-muted mb-1.5 text-xs font-medium uppercase tracking-wider">
              {t('dashboard.automations.executions.input')}
            </p>
            <JsonViewer data={step.inputData} />
          </div>

          <div>
            <p className="text-text-muted mb-1.5 text-xs font-medium uppercase tracking-wider">
              {t('dashboard.automations.executions.output')}
            </p>
            <JsonViewer data={step.outputData} />
          </div>
        </div>
      )}
    </div>
  )
}
