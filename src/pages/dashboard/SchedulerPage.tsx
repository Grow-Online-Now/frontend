import { useState, useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/dashboard/shared/PageHeader'
import { DashboardCard } from '@/components/dashboard/shared/DashboardCard'
import { InfoHint } from '@/components/dashboard/shared/InfoHint'
import { CreatePostTypeModal } from '@/components/dashboard/shared/CreatePostTypeModal'
import { Button } from '@/components/ui/button'
import {
  SchedulerCalendar,
  SchedulerWeekView,
  PostDetailModal,
} from '@/components/dashboard/scheduler'
import { useSchedulerPosts } from '@/hooks/useSchedulerPosts'
import { usePosts } from '@/hooks/usePosts'
import { getMonthViewRange, getWeekViewRange } from '@/lib/date-utils'
import { cn } from '@/lib/utils'
import { Plus, Loader2 } from 'lucide-react'
import type { CalendarView } from '@/types/dashboard'
import type { PostResponse } from '@/types/posts'

export default function SchedulerPage() {
  const { t } = useTranslation()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [calendarView, setCalendarView] = useState<CalendarView>('month')
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date())
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  // Post detail modal state
  const [selectedPost, setSelectedPost] = useState<PostResponse | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  // Row expansion state for month view
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set())

  // Calculate date range based on current view
  const dateRange = useMemo(() => {
    if (calendarView === 'month') {
      return getMonthViewRange(currentMonth)
    }
    return getWeekViewRange(currentWeek)
  }, [calendarView, currentMonth, currentWeek])

  // Fetch posts for the visible range
  const { postsByDate, isLoading, refetch } = useSchedulerPosts({
    startDate: dateRange.start,
    endDate: dateRange.end,
  })

  // Get delete function from usePosts hook
  const { deletePostById } = usePosts()

  const handleCreatePost = () => {
    setIsCreateModalOpen(true)
  }

  // Handle post click to open detail modal
  const handlePostClick = useCallback((post: PostResponse) => {
    setSelectedPost(post)
    setIsDetailModalOpen(true)
  }, [])

  // Handle row expansion toggle
  const handleToggleRowExpansion = useCallback((rowIndex: number) => {
    setExpandedRows((prev) => {
      const next = new Set(prev)
      if (next.has(rowIndex)) {
        next.delete(rowIndex)
      } else {
        next.add(rowIndex)
      }
      return next
    })
  }, [])

  // Handle post deletion
  const handleDeletePost = useCallback(
    async (post: PostResponse) => {
      const success = await deletePostById(post.id)
      if (success) {
        refetch()
      }
    },
    [deletePostById, refetch]
  )

  // Reset expanded rows when changing month
  const handleMonthChange = useCallback((month: Date) => {
    setCurrentMonth(month)
    setExpandedRows(new Set())
  }, [])

  return (
    <div>
      <PageHeader
        titleKey="dashboard.scheduler.title"
        descriptionKey="dashboard.scheduler.description"
        actions={
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

      {/* Full-width Calendar */}
      <DashboardCard className="overflow-hidden">
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
            onMonthChange={handleMonthChange}
            onPostClick={handlePostClick}
            expandedRows={expandedRows}
            onToggleRowExpansion={handleToggleRowExpansion}
          />
        ) : (
          <SchedulerWeekView
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            postsByDate={postsByDate}
            currentWeek={currentWeek}
            onWeekChange={setCurrentWeek}
            onPostClick={handlePostClick}
          />
        )}
      </DashboardCard>

      {/* Create Post Type Modal */}
      <CreatePostTypeModal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} />

      {/* Post Detail Modal */}
      <PostDetailModal
        post={selectedPost}
        open={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        onDelete={handleDeletePost}
      />
    </div>
  )
}
