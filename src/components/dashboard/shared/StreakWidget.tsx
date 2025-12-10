/**
 * StreakWidget Component
 * A visually striking widget to display the user's posting streak
 */

import { useTranslation } from 'react-i18next'
import { Flame, Check, Trophy, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import type { StreakResponse } from '@/types/streak'

interface StreakWidgetProps {
  streak: StreakResponse | null
  isLoading?: boolean
  error?: string | null
  className?: string
}

export function StreakWidget({ streak, isLoading, error, className }: StreakWidgetProps) {
  const { t } = useTranslation()

  // Loading state
  if (isLoading) {
    return (
      <div className={cn('border-border-subtle bg-card rounded-2xl border p-6', className)}>
        <div className="flex items-center gap-6">
          <Skeleton className="h-20 w-20 rounded-2xl" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-2 w-full max-w-xs" />
          </div>
        </div>
      </div>
    )
  }

  // Error state - silently fail, don't show widget
  if (error || !streak) {
    return null
  }

  const { currentStreak, longestStreak, isActiveToday, nextMilestone } = streak
  const hasStreak = currentStreak > 0
  const isAtMilestone = currentStreak === nextMilestone

  // Generate progress dots
  const progressDots = generateProgressDots(currentStreak, nextMilestone)

  return (
    <div
      className={cn(
        'bg-card relative overflow-hidden rounded-2xl border p-6',
        'border-orange-500/20',
        'bg-gradient-to-br from-orange-500/5 via-transparent to-amber-500/5',
        className
      )}
    >
      {/* Background glow effect */}
      <div className="pointer-events-none absolute -top-20 -left-20 h-40 w-40 rounded-full bg-orange-500/10 blur-3xl" />

      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
        {/* Flame Icon Container */}
        <div
          className={cn(
            'flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl',
            'bg-gradient-to-br from-orange-500/20 to-amber-500/20',
            'ring-1 ring-orange-500/20',
            hasStreak && isActiveToday && 'animate-pulse'
          )}
        >
          <Flame
            className={cn('h-10 w-10', hasStreak ? 'text-orange-500' : 'text-muted-foreground/50')}
          />
        </div>

        {/* Content */}
        <div className="flex-1 space-y-3">
          {/* Streak Count */}
          <div className="flex items-baseline gap-2">
            <span
              className={cn(
                'text-4xl font-bold tracking-tight',
                hasStreak ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              {currentStreak}
            </span>
            <span className="text-muted-foreground text-lg">
              {currentStreak === 1 ? t('dashboard.streak.day') : t('dashboard.streak.days')}
            </span>
            {isAtMilestone && (
              <span className="ml-2 flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400">
                <Trophy className="h-3 w-3" />
                {t('dashboard.streak.milestoneReached')}
              </span>
            )}
          </div>

          {/* Stats Row */}
          <div className="flex flex-wrap items-center gap-4 text-sm">
            {/* Best Streak */}
            <div className="text-muted-foreground flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-amber-500" />
              <span>{t('dashboard.streak.bestStreak', { count: longestStreak })}</span>
            </div>

            {/* Next Milestone */}
            {!isAtMilestone && hasStreak && (
              <div className="text-muted-foreground">
                {t('dashboard.streak.nextMilestone', { count: nextMilestone })}
              </div>
            )}
          </div>

          {/* Progress Bar */}
          {hasStreak && !isAtMilestone && (
            <div className="max-w-xs">
              <div className="flex gap-1">
                {progressDots.map((filled, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      'h-1.5 flex-1 rounded-full transition-colors',
                      filled ? 'bg-orange-500' : 'bg-muted'
                    )}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Posted Today Indicator */}
          <div className="flex items-center gap-2">
            {isActiveToday ? (
              <div className="text-success flex items-center gap-1.5 text-sm font-medium">
                <div className="bg-success/10 flex h-5 w-5 items-center justify-center rounded-full">
                  <Check className="h-3 w-3" />
                </div>
                {t('dashboard.streak.postedToday')}
              </div>
            ) : hasStreak ? (
              <div className="text-warning flex items-center gap-1.5 text-sm">
                <div className="bg-warning h-2 w-2 animate-pulse rounded-full" />
                {t('dashboard.streak.postToKeepStreak')}
              </div>
            ) : (
              <div className="text-muted-foreground text-sm">{t('dashboard.streak.noStreak')}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Get the previous milestone before the given one
 */
function getPreviousMilestone(nextMilestone: number): number {
  const milestones = [0, 3, 7, 14, 30, 60, 90, 180, 365]
  for (let i = milestones.length - 1; i >= 0; i--) {
    if (milestones[i] < nextMilestone) {
      return milestones[i]
    }
  }
  return 0
}

/**
 * Generate an array of boolean values for progress dots
 */
function generateProgressDots(current: number, next: number): boolean[] {
  const prev = getPreviousMilestone(next)
  const total = next - prev
  const filled = current - prev

  // Show max 7 dots for visual clarity
  const dotCount = Math.min(total, 7)
  const dots: boolean[] = []

  for (let i = 0; i < dotCount; i++) {
    const threshold = (i + 1) * (total / dotCount)
    dots.push(filled >= threshold)
  }

  return dots
}
