/**
 * PostStatusBadge Component
 * Displays post status with appropriate styling and translation
 */

import { useTranslation } from 'react-i18next'
import { Clock, Loader2, CheckCircle2, XCircle, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PostStatus } from '@/types/posts'

type BadgeSize = 'sm' | 'md'

interface PostStatusBadgeProps {
  status: PostStatus
  isDraft?: boolean
  size?: BadgeSize
  className?: string
}

const sizeClasses: Record<BadgeSize, { badge: string; icon: string }> = {
  sm: { badge: 'px-2 py-0.5 text-[10px]', icon: 'size-3' },
  md: { badge: 'px-2.5 py-1 text-xs', icon: 'size-3.5' },
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

export function PostStatusBadge({ status, isDraft, size = 'md', className }: PostStatusBadgeProps) {
  const { t } = useTranslation()

  // If it's a draft, show draft status instead
  const displayStatus = isDraft ? 'draft' : status
  const config = statusConfig[displayStatus]
  const Icon = config.icon
  const sizes = sizeClasses[size]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border font-medium',
        sizes.badge,
        config.colorClasses,
        className
      )}
    >
      <Icon className={cn(sizes.icon, displayStatus === 'processing' && 'animate-spin')} />
      {t(config.translationKey)}
    </span>
  )
}
