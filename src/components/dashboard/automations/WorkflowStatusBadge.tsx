/**
 * WorkflowStatusBadge Component
 * Displays workflow status with appropriate styling
 */

import { useTranslation } from 'react-i18next'
import { FileText, Zap, Pause, Archive } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { WorkflowStatus } from '@/types/automations'

interface WorkflowStatusBadgeProps {
  status: WorkflowStatus
  className?: string
}

const statusConfig: Record<
  WorkflowStatus,
  {
    icon: React.ComponentType<{ className?: string }>
    colorClasses: string
    translationKey: string
  }
> = {
  DRAFT: {
    icon: FileText,
    colorClasses: 'bg-muted text-muted-foreground border-border',
    translationKey: 'dashboard.automations.status.draft',
  },
  ACTIVE: {
    icon: Zap,
    colorClasses: 'bg-success/10 text-success border-success/20',
    translationKey: 'dashboard.automations.status.active',
  },
  PAUSED: {
    icon: Pause,
    colorClasses: 'bg-warning/10 text-warning border-warning/20',
    translationKey: 'dashboard.automations.status.paused',
  },
  ARCHIVED: {
    icon: Archive,
    colorClasses: 'bg-muted text-muted-foreground/60 border-border',
    translationKey: 'dashboard.automations.status.archived',
  },
}

export function WorkflowStatusBadge({ status, className }: WorkflowStatusBadgeProps) {
  const { t } = useTranslation()
  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium',
        config.colorClasses,
        className
      )}
    >
      <Icon className="size-3.5" />
      {t(config.translationKey)}
    </span>
  )
}
