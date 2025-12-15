/**
 * SchedulerCalendar Component
 * Custom month calendar grid with post badges
 */

import { useTranslation } from 'react-i18next'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { SchedulerDayCell } from './SchedulerDayCell'
import {
  getMonthDays,
  getPostsForDate,
  isSameDay,
  isSameMonth,
  isToday,
  addMonths,
  subMonths,
} from '@/lib/date-utils'
import type { PostResponse } from '@/types/posts'

interface SchedulerCalendarProps {
  selectedDate: Date | undefined
  onDateSelect: (date: Date) => void
  postsByDate: Map<string, PostResponse[]>
  currentMonth: Date
  onMonthChange: (month: Date) => void
  className?: string
}

const WEEKDAY_KEYS = [
  'common.weekdays.sun',
  'common.weekdays.mon',
  'common.weekdays.tue',
  'common.weekdays.wed',
  'common.weekdays.thu',
  'common.weekdays.fri',
  'common.weekdays.sat',
]

export function SchedulerCalendar({
  selectedDate,
  onDateSelect,
  postsByDate,
  currentMonth,
  onMonthChange,
  className,
}: SchedulerCalendarProps) {
  const { t, i18n } = useTranslation()
  const days = getMonthDays(currentMonth)

  const handlePrevMonth = () => {
    onMonthChange(subMonths(currentMonth, 1))
  }

  const handleNextMonth = () => {
    onMonthChange(addMonths(currentMonth, 1))
  }

  const handleToday = () => {
    const today = new Date()
    onMonthChange(today)
    onDateSelect(today)
  }

  // Format month/year for display
  const monthLabel = new Intl.DateTimeFormat(i18n.language, {
    month: 'long',
    year: 'numeric',
  }).format(currentMonth)

  return (
    <div className={cn('flex flex-col', className)}>
      {/* Header with navigation */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevMonth}
            className="text-muted-foreground hover:text-foreground size-8 transition-colors"
            aria-label={t('dashboard.scheduler.calendar.navigation.previousMonth')}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNextMonth}
            className="text-muted-foreground hover:text-foreground size-8 transition-colors"
            aria-label={t('dashboard.scheduler.calendar.navigation.nextMonth')}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>

        <h2 className="text-foreground text-lg font-semibold tracking-tight capitalize">
          {monthLabel}
        </h2>

        <Button
          variant="outline"
          size="sm"
          onClick={handleToday}
          className="rounded-lg text-xs font-medium"
        >
          {t('dashboard.scheduler.calendar.today')}
        </Button>
      </div>

      {/* Weekday headers */}
      <div className="border-border-subtle grid grid-cols-7 border-b border-l">
        {WEEKDAY_KEYS.map((key) => (
          <div
            key={key}
            className="border-border-subtle text-muted-foreground/60 border-r py-2.5 text-center text-xs font-medium tracking-[0.05em] uppercase"
          >
            {t(key)}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="border-border-subtle grid grid-cols-7 border-l">
        {days.map((day) => {
          const posts = getPostsForDate(postsByDate, day)
          const selected = selectedDate ? isSameDay(day, selectedDate) : false
          const today = isToday(day)
          const outside = !isSameMonth(day, currentMonth)

          return (
            <SchedulerDayCell
              key={day.toISOString()}
              day={day}
              posts={posts}
              isSelected={selected}
              isToday={today}
              isOutside={outside}
              onClick={() => onDateSelect(day)}
            />
          )
        })}
      </div>
    </div>
  )
}
