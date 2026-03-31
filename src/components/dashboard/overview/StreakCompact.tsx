import { useTranslation } from 'react-i18next'
import { Flame, Check } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { StreakResponse } from '@/types/streak'

interface StreakCompactProps {
  streak: StreakResponse | null
  isLoading: boolean
}

const ease = [0.16, 1, 0.3, 1] as const

export function StreakCompact({ streak, isLoading }: StreakCompactProps) {
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.26, ease }}
      >
        <p className="text-text-tertiary mb-2 text-xs font-medium uppercase tracking-wider">
          {t('dashboard.streak.title')}
        </p>
        <div className="space-y-3">
          <div className="bg-bg-subtle h-5 w-24 animate-pulse rounded" />
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="bg-bg-subtle h-2 w-full animate-pulse rounded-full" />
            ))}
          </div>
          <div className="bg-bg-subtle h-4 w-20 animate-pulse rounded" />
        </div>
      </motion.div>
    )
  }

  if (!streak) return null

  const { currentStreak, isActiveToday, nextMilestone } = streak
  const hasStreak = currentStreak > 0
  const progressDots = getProgressDots(currentStreak, nextMilestone)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.26, ease }}
    >
      <p className="text-text-tertiary mb-2 text-xs font-medium uppercase tracking-wider">
        {t('dashboard.streak.title')}
      </p>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Flame
            className={cn('h-4 w-4', hasStreak ? 'text-warning' : 'text-text-muted')}
          />
          <span className="text-text-primary font-mono text-lg font-semibold tabular-nums">
            {currentStreak}
          </span>
          <span className="text-text-tertiary text-sm">
            {currentStreak === 1 ? t('dashboard.streak.day') : t('dashboard.streak.days')}
          </span>
        </div>

        {hasStreak && (
          <div className="flex gap-1">
            {progressDots.map((filled, i) => (
              <div
                key={i}
                className={cn(
                  'h-1.5 flex-1 rounded-full transition-colors',
                  filled ? 'bg-warning' : 'bg-bg-subtle'
                )}
              />
            ))}
          </div>
        )}

        <div className="flex items-center gap-1.5">
          {isActiveToday ? (
            <>
              <Check className="text-success h-3.5 w-3.5" />
              <span className="text-success text-xs font-medium">
                {t('dashboard.streak.postedToday')}
              </span>
            </>
          ) : hasStreak ? (
            <>
              <div className="bg-warning h-1.5 w-1.5 animate-pulse rounded-full" />
              <span className="text-text-secondary text-xs">
                {t('dashboard.streak.postToKeepStreak')}
              </span>
            </>
          ) : (
            <span className="text-text-muted text-xs">
              {t('dashboard.streak.noStreak')}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function getProgressDots(current: number, next: number): boolean[] {
  const milestones = [0, 3, 7, 14, 30, 60, 90, 180, 365]
  let prev = 0
  for (let i = milestones.length - 1; i >= 0; i--) {
    if (milestones[i] < next) {
      prev = milestones[i]
      break
    }
  }
  const total = next - prev
  const filled = current - prev
  const dotCount = Math.min(total, 7)
  return Array.from({ length: dotCount }, (_, i) => filled >= ((i + 1) * total) / dotCount)
}
