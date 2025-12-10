/**
 * PostStatusBadge Component
 * Displays post status with appropriate styling and translation
 */

import { useTranslation } from 'react-i18next'
import { Clock, Loader2, CheckCircle2, XCircle, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PostStatus } from '@/types/posts'

interface PostStatusBadgeProps {
  status: PostStatus
  isDraft?: boolean
  className?: string
}

const statusConfig: Record<
  PostStatus | 'draft',
  {
    icon: React.ComponentType<{ className?: string }>
    colorClasses: string
    translationKey: string
  }
> = {
  pending: {
    icon: Clock,
    colorClasses: 'bg-warning/10 text-warning border-warning/20',
    translationKey: 'dashboard.posts.status.pending',
  },
  processing: {
    icon: Loader2,
    colorClasses: 'bg-info/10 text-info border-info/20',
    translationKey: 'dashboard.posts.status.processing',
  },
  completed: {
    icon: CheckCircle2,
    colorClasses: 'bg-success/10 text-success border-success/20',
    translationKey: 'dashboard.posts.status.completed',
  },
  failed: {
    icon: XCircle,
    colorClasses: 'bg-destructive/10 text-destructive border-destructive/20',
    translationKey: 'dashboard.posts.status.failed',
  },
  draft: {
    icon: FileText,
    colorClasses: 'bg-muted text-muted-foreground border-border',
    translationKey: 'dashboard.posts.status.draft',
  },
}

export function PostStatusBadge({ status, isDraft, className }: PostStatusBadgeProps) {
  const { t } = useTranslation()

  // If it's a draft, show draft status instead
  const displayStatus = isDraft ? 'draft' : status
  const config = statusConfig[displayStatus]
  const Icon = config.icon

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium',
        config.colorClasses,
        className
      )}
    >
      <Icon className={cn('size-3.5', displayStatus === 'processing' && 'animate-spin')} />
      {t(config.translationKey)}
    </span>
  )
}
