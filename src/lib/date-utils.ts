/**
 * Date utilities for scheduler calendar
 */

import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  isToday,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
} from 'date-fns'
import type { PostResponse } from '@/types/posts'

/**
 * Format a date as YYYY-MM-DD for Map key lookup
 */
export function formatDateKey(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

/**
 * Format time for display in badges (e.g., "9:30 AM")
 */
export function formatPostTime(scheduledAt: string, locale?: string): string {
  const date = new Date(scheduledAt)
  return new Intl.DateTimeFormat(locale ?? 'en', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

/**
 * Get the visible date range for month view
 * Includes days from prev/next month that fill the calendar grid
 */
export function getMonthViewRange(month: Date): { start: Date; end: Date } {
  const monthStart = startOfMonth(month)
  const monthEnd = endOfMonth(month)

  // Get the start of the week containing the first day of the month
  const start = startOfWeek(monthStart, { weekStartsOn: 0 }) // Sunday

  // Get the end of the week containing the last day of the month
  const end = endOfWeek(monthEnd, { weekStartsOn: 0 })

  return { start, end }
}

/**
 * Get the visible date range for week view
 */
export function getWeekViewRange(date: Date): { start: Date; end: Date } {
  const start = startOfWeek(date, { weekStartsOn: 0 }) // Sunday
  const end = endOfWeek(date, { weekStartsOn: 0 })

  return { start, end }
}

/**
 * Get all days in a month view grid (includes overflow days)
 */
export function getMonthDays(month: Date): Date[] {
  const { start, end } = getMonthViewRange(month)
  return eachDayOfInterval({ start, end })
}

/**
 * Get all days in a week view
 */
export function getWeekDays(date: Date): Date[] {
  const { start, end } = getWeekViewRange(date)
  return eachDayOfInterval({ start, end })
}

/**
 * Get the display date for a post (scheduled_at or created_at as fallback)
 */
export function getPostDisplayDate(post: PostResponse): Date {
  return new Date(post.scheduled_at ?? post.created_at)
}

/**
 * Group posts by their display date (scheduled_at or created_at)
 * Returns a Map where keys are "YYYY-MM-DD" and values are arrays of posts
 */
export function groupPostsByDate(posts: PostResponse[]): Map<string, PostResponse[]> {
  const map = new Map<string, PostResponse[]>()

  for (const post of posts) {
    const displayDate = getPostDisplayDate(post)
    const key = formatDateKey(displayDate)
    const existing = map.get(key) || []
    existing.push(post)
    map.set(key, existing)
  }

  // Sort posts within each day by time
  for (const [key, dayPosts] of map.entries()) {
    map.set(
      key,
      dayPosts.sort((a, b) => {
        const timeA = getPostDisplayDate(a).getTime()
        const timeB = getPostDisplayDate(b).getTime()
        return timeA - timeB
      })
    )
  }

  return map
}

/**
 * Get posts for a specific date from the grouped map
 */
export function getPostsForDate(
  postsByDate: Map<string, PostResponse[]>,
  date: Date
): PostResponse[] {
  return postsByDate.get(formatDateKey(date)) || []
}

// Re-export useful date-fns functions
export {
  isSameDay,
  isSameMonth,
  isToday,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  startOfWeek,
  endOfWeek,
  format,
}
