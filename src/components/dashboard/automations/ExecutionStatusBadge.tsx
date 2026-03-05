/**
 * ExecutionStatusBadge Component
 * Displays execution status with appropriate styling
 */

import { useTranslation } from 'react-i18next'
import { Clock, Loader2, CheckCircle2, XCircle, Ban } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ExecutionStatus } from '@/types/automations'

interface ExecutionStatusBadgeProps {
  status: ExecutionStatus
  className?: string
}

const statusConfig: Record<
  ExecutionStatus,
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
    translationKey: 'dashboard.automations.executions.status.pending',
  },
  RUNNING: {
    icon: Loader2,
    colorClasses: 'bg-info/10 text-info border-info/20',
    translationKey: 'dashboard.automations.executions.status.running',
    animate: true,
  },
  COMPLETED: {
    icon: CheckCircle2,
    colorClasses: 'bg-success/10 text-success border-success/20',
    translationKey: 'dashboard.automations.executions.status.completed',
  },
  FAILED: {
    icon: XCircle,
    colorClasses: 'bg-destructive/10 text-destructive border-destructive/20',
    translationKey: 'dashboard.automations.executions.status.failed',
  },
  CANCELLED: {
    icon: Ban,
    colorClasses: 'bg-muted text-muted-foreground border-border',
    translationKey: 'dashboard.automations.executions.status.cancelled',
  },
}

export function ExecutionStatusBadge({ status, className }: ExecutionStatusBadgeProps) {
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
      <Icon className={cn('size-3.5', config.animate && 'animate-spin')} />
      {t(config.translationKey)}
    </span>
  )
}
