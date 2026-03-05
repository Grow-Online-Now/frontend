/**
 * StepStatusBadge Component
 * Displays step execution status
 */

import { useTranslation } from 'react-i18next'
import { Clock, Loader2, CheckCircle2, XCircle, SkipForward } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { StepStatus } from '@/types/automations'

interface StepStatusBadgeProps {
  status: StepStatus
  className?: string
}

const statusConfig: Record<
  StepStatus,
  {
    icon: React.ComponentType<{ className?: string }>
    colorClasses: string
    translationKey: string
    animate?: boolean
  }
> = {
  PENDING: {
    icon: Clock,
    colorClasses: 'bg-warning/10 text-warning border-warning/20',
    translationKey: 'dashboard.automations.executions.stepStatus.pending',
  },
  RUNNING: {
    icon: Loader2,
    colorClasses: 'bg-info/10 text-info border-info/20',
    translationKey: 'dashboard.automations.executions.stepStatus.running',
    animate: true,
  },
  COMPLETED: {
    icon: CheckCircle2,
    colorClasses: 'bg-success/10 text-success border-success/20',
    translationKey: 'dashboard.automations.executions.stepStatus.completed',
  },
  FAILED: {
    icon: XCircle,
    colorClasses: 'bg-destructive/10 text-destructive border-destructive/20',
    translationKey: 'dashboard.automations.executions.stepStatus.failed',
  },
  SKIPPED: {
    icon: SkipForward,
    colorClasses: 'bg-muted text-muted-foreground border-border',
    translationKey: 'dashboard.automations.executions.stepStatus.skipped',
  },
}

export function StepStatusBadge({ status, className }: StepStatusBadgeProps) {
  const { t } = useTranslation()
  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium',
        config.colorClasses,
        className
      )}
    >
      <Icon className={cn('size-3', config.animate && 'animate-spin')} />
      {t(config.translationKey)}
    </span>
  )
}
