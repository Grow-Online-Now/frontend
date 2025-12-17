import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/dashboard/shared/PageHeader'
import { DashboardCard } from '@/components/dashboard/shared/DashboardCard'
import { EmptyState } from '@/components/dashboard/shared/EmptyState'
import { InfoHint } from '@/components/dashboard/shared/InfoHint'
import { CreatePostTypeModal } from '@/components/dashboard/shared/CreatePostTypeModal'
import { Button } from '@/components/ui/button'
import { SchedulerCalendar, SchedulerWeekView } from '@/components/dashboard/scheduler'
import { PostCard } from '@/components/dashboard/posts/PostCard'
import { useSchedulerPosts } from '@/hooks/useSchedulerPosts'
import { getMonthViewRange, getWeekViewRange, getPostsForDate } from '@/lib/date-utils'
import { cn } from '@/lib/utils'
import { CalendarDays, Plus, Loader2 } from 'lucide-react'
import type { CalendarView } from '@/types/dashboard'

export default function SchedulerPage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [calendarView, setCalendarView] = useState<CalendarView>('month')
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date())
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  // Calculate date range based on current view
  const dateRange = useMemo(() => {
    if (calendarView === 'month') {
      return getMonthViewRange(currentMonth)
    }
    return getWeekViewRange(currentWeek)
  }, [calendarView, currentMonth, currentWeek])

  // Fetch posts for the visible range
  const { postsByDate, isLoading } = useSchedulerPosts({
    startDate: dateRange.start,
    endDate: dateRange.end,
  })

  // Get posts for the selected date
  const selectedDatePosts = useMemo(
    () => getPostsForDate(postsByDate, selectedDate),
    [postsByDate, selectedDate]
  )

  const handleCreatePost = () => {
    setIsCreateModalOpen(true)
  }

  // Format selected date for sidebar header
  const formattedSelectedDate = new Intl.DateTimeFormat(i18n.language, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(selectedDate)

  return (
    <div>
      <PageHeader
        titleKey="dashboard.scheduler.title"
        descriptionKey="dashboard.scheduler.description"
        actions={
          // Secondary/outline style - sidebar has primary CTA
          <Button variant="outline" onClick={handleCreatePost} className="gap-2 rounded-lg">
            <Plus className="h-4 w-4" />
            {t('dashboard.scheduler.createPost')}
          </Button>
        }
      />

      <InfoHint
        textKey="dashboard.hints.scheduler.calendarUsage"
        variant="tip"
        className="mt-2 mb-6"
      />

      {/* Calendar View Toggle - Pill style */}
      <div className="mb-6">
        <div className="bg-muted/50 inline-flex gap-0.5 rounded-lg p-1">
          <button
            onClick={() => setCalendarView('month')}
            className={cn(
              'rounded-md px-4 py-2 text-sm font-medium transition-all duration-150',
              calendarView === 'month'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {t('dashboard.scheduler.views.month')}
          </button>
          <button
            onClick={() => setCalendarView('week')}
            className={cn(
              'rounded-md px-4 py-2 text-sm font-medium transition-all duration-150',
              calendarView === 'week'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {t('dashboard.scheduler.views.week')}
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar */}
        <DashboardCard className="overflow-hidden lg:col-span-2">
          {isLoading ? (
            <div className="flex min-h-[400px] items-center justify-center">
              <Loader2 className="text-muted-foreground size-8 animate-spin" />
            </div>
          ) : calendarView === 'month' ? (
            <SchedulerCalendar
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              postsByDate={postsByDate}
              currentMonth={currentMonth}
              onMonthChange={setCurrentMonth}
            />
          ) : (
            <SchedulerWeekView
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              postsByDate={postsByDate}
              currentWeek={currentWeek}
              onWeekChange={setCurrentWeek}
            />
          )}
        </DashboardCard>

        {/* Scheduled Posts for Selected Date */}
        <div className="space-y-4">
          <h3 className="text-foreground font-semibold">{formattedSelectedDate}</h3>

          {selectedDatePosts.length === 0 ? (
            <EmptyState
              icon={<CalendarDays className="h-6 w-6" />}
              titleKey="dashboard.scheduler.empty.title"
              descriptionKey="dashboard.scheduler.empty.description"
              ctaKey="dashboard.scheduler.empty.cta"
              onCtaClick={handleCreatePost}
              compact
              className="min-h-[280px]"
            />
          ) : (
            <div className="space-y-3">
              {selectedDatePosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onView={() => {
                    // TODO: Open post detail modal
                  }}
                  onEdit={() => {
                    navigate(`/${i18n.language}/dashboard/posts/${post.id}/edit`)
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Post Type Modal */}
      <CreatePostTypeModal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} />
    </div>
  )
}
