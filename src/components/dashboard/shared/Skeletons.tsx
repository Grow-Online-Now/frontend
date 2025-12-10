/**
 * Dashboard Skeleton Components
 * Reusable loading skeleton states for various dashboard components
 */

import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

/**
 * Skeleton for DashboardCard content
 */
export function CardSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-10 w-full" />
    </div>
  )
}

/**
 * Skeleton for a stat/metric card
 */
export function StatCardSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('border-border-subtle bg-card rounded-xl border p-5', className)}>
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
      <Skeleton className="mt-3 h-8 w-24" />
      <Skeleton className="mt-2 h-3 w-16" />
    </div>
  )
}

/**
 * Skeleton for a post/item row
 */
export function PostRowSkeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'border-border-subtle bg-card flex items-center gap-4 rounded-xl border p-4',
        className
      )}
    >
      {/* Platform icon */}
      <Skeleton className="h-10 w-10 shrink-0 rounded-xl" />

      {/* Content */}
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/3" />
      </div>

      {/* Status badge */}
      <Skeleton className="h-6 w-20 rounded-full" />

      {/* Actions */}
      <Skeleton className="h-8 w-8 rounded-lg" />
    </div>
  )
}

/**
 * Skeleton for platform/account row
 */
export function PlatformRowSkeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'border-border-subtle bg-card flex items-center gap-4 rounded-xl border px-4 py-3',
        className
      )}
    >
      {/* Platform icon */}
      <Skeleton className="h-12 w-12 shrink-0 rounded-xl" />

      {/* Platform name */}
      <div className="hidden w-28 shrink-0 space-y-1.5 sm:block">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-3 w-14" />
      </div>

      {/* Connect button */}
      <Skeleton className="h-8 w-24 shrink-0 rounded-lg" />

      {/* Account badges */}
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <Skeleton className="h-7 w-28 rounded-full" />
        <Skeleton className="h-7 w-24 rounded-full" />
      </div>
    </div>
  )
}

/**
 * Skeleton for calendar day cell
 */
export function CalendarDaySkeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'border-border-subtle flex min-h-[100px] flex-col border-r border-b p-2',
        className
      )}
    >
      <Skeleton className="mb-1.5 h-7 w-7 rounded-full" />
      <div className="flex flex-1 flex-col gap-1">
        <Skeleton className="h-6 w-full rounded-lg" />
        <Skeleton className="h-6 w-3/4 rounded-lg" />
      </div>
    </div>
  )
}

/**
 * Skeleton for a full calendar grid
 */
export function CalendarGridSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-8 w-16 rounded-lg" />
      </div>

      {/* Weekday headers */}
      <div className="border-border-subtle grid grid-cols-7 gap-px border-b border-l">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="border-border-subtle border-r py-2.5 text-center">
            <Skeleton className="mx-auto h-3 w-8" />
          </div>
        ))}
      </div>

      {/* Calendar grid - 5 weeks */}
      <div className="border-border-subtle grid grid-cols-7 border-l">
        {Array.from({ length: 35 }).map((_, i) => (
          <CalendarDaySkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

/**
 * Skeleton for page header
 */
export function PageHeaderSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('flex items-center justify-between', className)}>
      <div className="space-y-2">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-64" />
      </div>
      <Skeleton className="h-10 w-32 rounded-lg" />
    </div>
  )
}

/**
 * Skeleton for account selector in create post
 */
export function AccountSelectorSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="border-border-subtle bg-card rounded-xl border p-2">
        <div className="space-y-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg p-2.5">
              <Skeleton className="h-[18px] w-[18px] rounded-[5px]" />
              <Skeleton className="h-8 w-8 rounded-xl" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * Skeleton for streak widget
 */
export function StreakWidgetSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('border-border-subtle bg-card rounded-xl border p-4', className)}>
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-xl" />
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
      {/* Week dots */}
      <div className="mt-4 flex justify-between">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-2 w-4" />
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Skeleton for textarea/form input
 */
export function TextareaSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-40 w-full rounded-xl" />
    </div>
  )
}

/**
 * Skeleton for table rows
 */
interface TableSkeletonProps extends SkeletonProps {
  rows?: number
  columns?: number
}

export function TableSkeleton({ rows = 5, columns = 4, className }: TableSkeletonProps) {
  return (
    <div className={cn('border-border-subtle rounded-xl border', className)}>
      {/* Header */}
      <div className="border-border-subtle bg-muted/30 flex items-center gap-4 border-b px-4 py-3">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className={cn(
            'flex items-center gap-4 px-4 py-3',
            rowIndex < rows - 1 && 'border-border-subtle border-b'
          )}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}
