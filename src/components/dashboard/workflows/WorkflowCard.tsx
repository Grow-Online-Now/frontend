/**
 * WorkflowCard
 * Card displaying workflow summary in the list view.
 * Uses CSS variable tokens for light/dark theme support.
 */

import { useTranslation } from 'react-i18next'
import { Play, MoreHorizontal, Clock, Link, Layers } from 'lucide-react'
import { WorkflowStatusBadge } from './WorkflowStatusBadge'
import type { Workflow } from '@/types/workflow'

interface WorkflowCardProps {
  workflow: Workflow
  index: number
  onClick: (id: string) => void
  onDelete?: (id: string) => Promise<boolean>
}

export function WorkflowCard({ workflow, onClick }: WorkflowCardProps) {
  const { t } = useTranslation()

  const triggerIcon =
    workflow.triggerType === 'cron' ? (
      <Clock className="h-3 w-3" />
    ) : workflow.triggerType === 'webhook' ? (
      <Link className="h-3 w-3" />
    ) : (
      <Play className="h-3 w-3" />
    )

  const triggerLabel = t(
    `dashboard.workflows.card.trigger${workflow.triggerType.charAt(0).toUpperCase() + workflow.triggerType.slice(1)}`
  )

  return (
    <div
      onClick={() => onClick(workflow.id)}
      className="cursor-pointer rounded-xl border border-border-subtle bg-bg-elevated p-5 transition-all duration-150 hover:border-border-default hover:bg-bg-hover"
    >
      {/* Row 1: Name + status + actions */}
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="text-md font-semibold tracking-tight text-text-primary">
            {t(workflow.name, { defaultValue: workflow.name })}
          </span>
          <WorkflowStatusBadge status={workflow.status} />
        </div>
        <div className="flex items-center gap-2">
          {workflow.status !== 'draft' && (
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-md border border-border-subtle bg-bg-elevated px-3 py-1.5 text-xs font-medium text-text-secondary transition-all duration-150 hover:border-border-default hover:bg-bg-hover"
              onClick={(e) => e.stopPropagation()}
            >
              <Play className="h-3 w-3" />
              {t('dashboard.workflows.card.run')}
            </button>
          )}
          <button
            type="button"
            className="p-1 text-text-muted transition-colors duration-150 hover:text-text-secondary"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Row 2: Description */}
      {workflow.description && (
        <p className="mb-4 text-sm leading-relaxed text-text-tertiary">
          {workflow.description}
        </p>
      )}

      {/* Row 3: Metadata */}
      <div className="flex items-center gap-5 text-xs text-text-muted">
        <span className="flex items-center gap-1.5">
          {triggerIcon}
          {triggerLabel}
        </span>
        <span className="text-border-emphasis">·</span>
        <span className="flex items-center gap-1.5">
          <Layers className="h-3 w-3" />
          {t('dashboard.workflows.card.nodes', { count: workflow.nodes.length })}
        </span>
      </div>
    </div>
  )
}
