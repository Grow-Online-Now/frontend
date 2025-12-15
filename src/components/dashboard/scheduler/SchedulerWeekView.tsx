/**
 * SchedulerWeekView Component
 * Week view with taller day columns for showing more posts
 */

import { useTranslation } from 'react-i18next'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { SchedulerPostBadge } from './SchedulerPostBadge'
import {
  getWeekDays,
  getPostsForDate,
  isSameDay,
  isToday,
  addWeeks,
  subWeeks,
  startOfWeek,
  endOfWeek,
} from '@/lib/date-utils'
import type { PostResponse } from '@/types/posts'

interface SchedulerWeekViewProps {
  selectedDate: Date | undefined
  onDateSelect: (date: Date) => void
  postsByDate: Map<string, PostResponse[]>
  currentWeek: Date
  onWeekChange: (week: Date) => void
  className?: string
}

const MAX_BADGES_WEEK = 5

export function SchedulerWeekView({
  selectedDate,
  onDateSelect,
  postsByDate,
  currentWeek,
  onWeekChange,
  className,
}: SchedulerWeekViewProps) {
  const { t, i18n } = useTranslation()
  const days = getWeekDays(currentWeek)

  const handlePrevWeek = () => {
    onWeekChange(subWeeks(currentWeek, 1))
  }

  const handleNextWeek = () => {
    onWeekChange(addWeeks(currentWeek, 1))
  }

  const handleToday = () => {
    const today = new Date()
    onWeekChange(today)
    onDateSelect(today)
  }

  // Format week range for display
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 0 })
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 0 })

  const formatOptions: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
  }

  const weekLabel = `${new Intl.DateTimeFormat(i18n.language, formatOptions).format(weekStart)} - ${new Intl.DateTimeFormat(i18n.language, formatOptions).format(weekEnd)}, ${weekEnd.getFullYear()}`

  return (
    <div className={cn('flex flex-col', className)}>
      {/* Header with navigation */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevWeek}
            className="text-muted-foreground hover:text-foreground size-8 transition-colors"
            aria-label={t('dashboard.scheduler.calendar.navigation.previousWeek')}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNextWeek}
            className="text-muted-foreground hover:text-foreground size-8 transition-colors"
            aria-label={t('dashboard.scheduler.calendar.navigation.nextWeek')}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>

        <h2 className="text-foreground text-lg font-semibold tracking-tight">{weekLabel}</h2>

        <Button
          variant="outline"
          size="sm"
          onClick={handleToday}
          className="rounded-lg text-xs font-medium"
        >
          {t('dashboard.scheduler.calendar.today')}
        </Button>
      </div>

      {/* Week grid */}
      <div className="border-border-subtle grid grid-cols-7 border-l">
        {days.map((day) => {
          const posts = getPostsForDate(postsByDate, day)
          const selected = selectedDate ? isSameDay(day, selectedDate) : false
          const today = isToday(day)
          const visiblePosts = posts.slice(0, MAX_BADGES_WEEK)
          const remainingCount = posts.length - MAX_BADGES_WEEK
          const hasPosts = posts.length > 0

          // Format day header
          const dayName = new Intl.DateTimeFormat(i18n.language, { weekday: 'short' }).format(day)
          const dayNum = day.getDate()

          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => onDateSelect(day)}
              className={cn(
                'group border-border-subtle flex min-h-[200px] flex-col border-r border-b p-3 text-left transition-all duration-150',
                'hover:bg-surface-elevated/80 focus-visible:ring-primary focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset',
                selected && 'bg-primary/[0.06] ring-primary/30 ring-1 ring-inset',
                today && !selected && 'bg-primary/[0.03]'
              )}
            >
              {/* Day header */}
              <div className="mb-3 flex flex-col items-center">
                <span
                  className={cn(
                    'text-xs font-medium tracking-wide uppercase',
                    today ? 'text-primary' : 'text-muted-foreground/60'
                  )}
                >
                  {dayName}
                </span>
                <span
                  className={cn(
                    'mt-1 flex h-8 w-8 items-center justify-center rounded-full text-base font-semibold transition-colors',
                    today && 'bg-primary text-primary-foreground shadow-primary/25 shadow-sm',
                    !today && 'text-foreground group-hover:bg-foreground/5'
                  )}
                >
                  {dayNum}
                </span>
                {/* Post indicator dot */}
                {hasPosts && !today && <span className="bg-primary/60 mt-1 h-1 w-1 rounded-full" />}
              </div>

              {/* Post badges */}
              <div className="flex flex-1 flex-col gap-1.5">
                {visiblePosts.map((post) => (
                  <SchedulerPostBadge key={post.id} post={post} />
                ))}

                {/* More indicator */}
                {remainingCount > 0 && (
                  <div className="text-muted-foreground/60 mt-0.5 flex items-center justify-center gap-1 text-xs font-medium">
                    <MoreHorizontal className="h-3 w-3" />
                    <span>
                      {t('dashboard.scheduler.calendar.moreCount', { count: remainingCount })}
                    </span>
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
