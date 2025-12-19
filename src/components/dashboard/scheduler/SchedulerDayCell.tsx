/**
 * SchedulerDayCell Component
 * Renders a single day cell in the calendar with post badges and hover previews
 */

import { useTranslation } from 'react-i18next'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { SchedulerPostBadge } from './SchedulerPostBadge'
import { PostHoverPreview } from './PostHoverPreview'
import type { PostResponse } from '@/types/posts'

interface SchedulerDayCellProps {
  day: Date
  posts: PostResponse[]
  isSelected: boolean
  isToday: boolean
  isOutside: boolean
  onClick: () => void
  onPostClick?: (post: PostResponse) => void
  maxBadges?: number
  rowIndex?: number
  isRowExpanded?: boolean
  onToggleRowExpansion?: (rowIndex: number) => void
}

export function SchedulerDayCell({
  day,
  posts,
  isSelected,
  isToday,
  isOutside,
  onClick,
  onPostClick,
  maxBadges = 3,
  rowIndex,
  isRowExpanded = false,
  onToggleRowExpansion,
}: SchedulerDayCellProps) {
  const { t } = useTranslation()

  const remainingCount = posts.length - maxBadges
  const hasPosts = posts.length > 0

  const handleMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onToggleRowExpansion && rowIndex !== undefined) {
      onToggleRowExpansion(rowIndex)
    }
  }

  const handlePostClick = (post: PostResponse) => (e: React.MouseEvent) => {
    e.stopPropagation()
    onPostClick?.(post)
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className={cn(
        'group relative flex w-full flex-col p-2 text-left transition-all duration-150',
        'border-border-subtle border-r border-b',
        'hover:bg-surface-elevated/80 focus-visible:ring-primary focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset',
        isSelected && 'bg-primary/[0.06] ring-primary/30 ring-1 ring-inset',
        isToday && !isSelected && 'bg-primary/[0.03]',
        isOutside && 'bg-muted/30 opacity-60',
        // Dynamic height based on content
        isRowExpanded ? 'min-h-[auto]' : 'min-h-[100px]'
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

        {/* Post count badge */}
        {hasPosts && (
          <span className="bg-muted text-muted-foreground flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-medium">
            {posts.length}
          </span>
        )}
      </div>

      {/* Post Badges - Always visible posts */}
      <div className="flex flex-col gap-1">
        {posts.slice(0, maxBadges).map((post) => (
          <HoverCard key={post.id} openDelay={300} closeDelay={100}>
            <HoverCardTrigger asChild>
              <div>
                <SchedulerPostBadge
                  post={post}
                  onClick={onPostClick ? handlePostClick(post) : undefined}
                />
              </div>
            </HoverCardTrigger>
            <HoverCardContent
              side="right"
              sideOffset={8}
              align="start"
              collisionPadding={16}
              className="w-auto p-3"
            >
              <PostHoverPreview post={post} />
            </HoverCardContent>
          </HoverCard>
        ))}
      </div>

      {/* Expandable posts - Animated container */}
      {remainingCount > 0 && (
        <div
          className={cn(
            'grid transition-[grid-template-rows] duration-300 ease-out',
            isRowExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
          )}
        >
          <div className="overflow-hidden">
            <div className="flex flex-col gap-1 pt-1">
              {posts.slice(maxBadges).map((post) => (
                <HoverCard key={post.id} openDelay={300} closeDelay={100}>
                  <HoverCardTrigger asChild>
                    <div>
                      <SchedulerPostBadge
                        post={post}
                        onClick={onPostClick ? handlePostClick(post) : undefined}
                      />
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent
                    side="right"
                    sideOffset={8}
                    align="start"
                    collisionPadding={16}
                    className="w-auto p-3"
                  >
                    <PostHoverPreview post={post} />
                  </HoverCardContent>
                </HoverCard>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Show more / Show less toggle */}
      {remainingCount > 0 && (
        <button
          type="button"
          onClick={handleMoreClick}
          className={cn(
            'text-muted-foreground hover:text-foreground mt-1 flex items-center gap-1 text-xs font-medium transition-colors',
            'hover:bg-foreground/5 -mx-1 rounded px-1 py-0.5'
          )}
        >
          {isRowExpanded ? (
            <>
              <ChevronUp className="h-3 w-3 transition-transform" />
              <span>{t('dashboard.scheduler.calendar.showLess')}</span>
            </>
          ) : (
            <>
              <ChevronDown className="h-3 w-3 transition-transform" />
              <span>{t('dashboard.scheduler.calendar.moreCount', { count: remainingCount })}</span>
            </>
          )}
        </button>
      )}
    </div>
  )
}
