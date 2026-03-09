/**
 * WorkflowStatusBadge
 * Displays workflow status as a soft colored badge.
 * Uses semantic color tokens for theme support.
 */

import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import type { WorkflowStatus } from '@/types/workflow'

interface WorkflowStatusBadgeProps {
  status: WorkflowStatus
  className?: string
}

const statusStyles: Record<WorkflowStatus, string> = {
  active: 'bg-success-muted text-success',
  paused: 'bg-warning-muted text-warning',
  draft: 'bg-bg-active text-text-muted',
}

const statusKeys: Record<WorkflowStatus, string> = {
  active: 'dashboard.workflows.status.active',
  paused: 'dashboard.workflows.status.paused',
  draft: 'dashboard.workflows.status.draft',
}

export function WorkflowStatusBadge({ status, className }: WorkflowStatusBadgeProps) {
  const { t } = useTranslation()

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm px-2 py-0.5 text-[10px] font-semibold',
        statusStyles[status],
        className
      )}
    >
      {t(statusKeys[status])}
    </span>
  )
}
