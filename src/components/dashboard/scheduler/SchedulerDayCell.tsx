/**
 * SchedulerDayCell Component
 * Renders a single day cell in the calendar with post badges
 */

import { useTranslation } from 'react-i18next'
import { MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SchedulerPostBadge } from './SchedulerPostBadge'
import type { PostResponse } from '@/types/posts'

interface SchedulerDayCellProps {
  day: Date
  posts: PostResponse[]
  isSelected: boolean
  isToday: boolean
  isOutside: boolean
  onClick: () => void
  maxBadges?: number
}

export function SchedulerDayCell({
  day,
  posts,
  isSelected,
  isToday,
  isOutside,
  onClick,
  maxBadges = 2,
}: SchedulerDayCellProps) {
  const { t } = useTranslation()
  const visiblePosts = posts.slice(0, maxBadges)
  const remainingCount = posts.length - maxBadges
  const hasPosts = posts.length > 0

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group relative flex min-h-[100px] w-full flex-col p-2 text-left transition-all duration-150',
        'border-border-subtle border-r border-b',
        'hover:bg-surface-elevated/80 focus-visible:ring-primary focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset',
        isSelected && 'bg-primary/[0.06] ring-primary/30 ring-1 ring-inset',
        isToday && !isSelected && 'bg-primary/[0.03]',
        isOutside && 'bg-muted/30 opacity-60'
      )}
    >
      {/* Day Number with Today pill */}
      <div className="mb-1.5 flex items-start justify-between">
        <span
          className={cn(
            'flex h-7 min-w-7 items-center justify-center rounded-full text-sm font-medium transition-colors',
            isToday &&
              'bg-primary text-primary-foreground shadow-primary/25 px-2 font-semibold shadow-sm',
            isOutside && !isToday && 'text-muted-foreground/40',
            !isToday && !isOutside && 'text-foreground group-hover:bg-foreground/5'
          )}
        >
          {day.getDate()}
        </span>

        {/* Post count indicator dot */}
        {hasPosts && !isToday && (
          <span className="mt-1.5 flex items-center gap-0.5">
            <span className="bg-primary/60 h-1 w-1 rounded-full" />
          </span>
        )}
      </div>

      {/* Post Badges */}
      <div className="flex flex-1 flex-col gap-1">
        {visiblePosts.map((post) => (
          <SchedulerPostBadge key={post.id} post={post} />
        ))}

        {/* More indicator */}
        {remainingCount > 0 && (
          <div className="text-muted-foreground/60 mt-0.5 flex items-center gap-1 text-xs font-medium">
            <MoreHorizontal className="h-3 w-3" />
            <span>{t('dashboard.scheduler.calendar.moreCount', { count: remainingCount })}</span>
          </div>
        )}
      </div>
    </button>
  )
}
