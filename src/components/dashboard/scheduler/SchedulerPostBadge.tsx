/**
 * SchedulerPostBadge Component
 * Compact badge showing platform icon + time + status for calendar display
 */

import { CheckCircle2, XCircle, Clock, Loader2, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PlatformIcon } from '@/components/dashboard/posts/PlatformIcon'
import { formatPostTime, getPostDisplayDate } from '@/lib/date-utils'
import type { PostResponse } from '@/types/posts'

interface SchedulerPostBadgeProps {
  post: PostResponse
  className?: string
  onClick?: (e: React.MouseEvent) => void
}

const statusConfig = {
  pending: {
    icon: Clock,
    bg: 'bg-warning/8',
    border: 'border-warning/20',
    text: 'text-warning',
    iconClass: 'text-warning/70',
  },
  processing: {
    icon: Loader2,
    bg: 'bg-info/8',
    border: 'border-info/20',
    text: 'text-info',
    iconClass: 'text-info/70',
    animate: true,
  },
  completed: {
    icon: CheckCircle2,
    bg: 'bg-success/8',
    border: 'border-success/20',
    text: 'text-success',
    iconClass: 'text-success/70',
  },
  failed: {
    icon: XCircle,
    bg: 'bg-destructive/8',
    border: 'border-destructive/20',
    text: 'text-destructive',
    iconClass: 'text-destructive/70',
  },
  draft: {
    icon: FileText,
    bg: 'bg-muted/50',
    border: 'border-border-subtle',
    text: 'text-muted-foreground',
    iconClass: 'text-muted-foreground/60',
  },
} as const

export function SchedulerPostBadge({ post, className, onClick }: SchedulerPostBadgeProps) {
  // Determine status - draft takes precedence
  const status = post.is_draft ? 'draft' : post.status
  const config = statusConfig[status]
  const StatusIcon = config.icon

  // Get platforms for display (show up to 3 stacked)
  const visibleAccounts = post.social_accounts.slice(0, 3)
  const additionalCount = post.social_accounts.length - 3

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.stopPropagation() // Prevent triggering day cell click
      onClick(e)
    }
  }

  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={handleClick}
      onKeyDown={
        onClick
          ? (e) => e.key === 'Enter' && handleClick(e as unknown as React.MouseEvent)
          : undefined
      }
      className={cn(
        'flex items-center gap-1.5 rounded-lg border px-2 py-1 transition-all duration-150',
        config.bg,
        config.border,
        onClick && 'cursor-pointer',
        'hover:scale-[1.02] hover:shadow-sm',
        className
      )}
    >
      {/* Platform Icons - Stacked */}
      <div className="flex -space-x-1">
        {visibleAccounts.map((account, idx) => (
          <div
            key={account.id}
            className="relative"
            style={{ zIndex: visibleAccounts.length - idx }}
          >
            <PlatformIcon platform={account.platform} size="xs" className="ring-1 ring-white/20" />
          </div>
        ))}
      </div>

      {/* Additional platforms indicator */}
      {additionalCount > 0 && (
        <span className="text-muted-foreground/60 text-xs font-medium">+{additionalCount}</span>
      )}

      {/* Time */}
      <span className={cn('flex-1 text-xs leading-none font-medium', config.text)}>
        {formatPostTime(getPostDisplayDate(post).toISOString())}
      </span>

      {/* Status Icon */}
      <StatusIcon
        className={cn(
          'size-3 shrink-0',
          config.iconClass,
          'animate' in config && config.animate && 'animate-spin'
        )}
      />
    </div>
  )
}
