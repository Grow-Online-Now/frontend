import { useTranslation } from 'react-i18next'
import { useSession } from '@/lib/auth-client'
import { motion } from 'framer-motion'
import { AnimatedNumber } from './AnimatedNumber'
import type { OverviewStats } from '@/types/activity'

interface OverviewHeroProps {
  stats: OverviewStats | null
  isLoading: boolean
}

const ease = [0.16, 1, 0.3, 1]

const metrics = [
  { key: 'postsThisWeek' as const, labelKey: 'dashboard.overview.stats.postsThisWeek' },
  { key: 'scheduledPosts' as const, labelKey: 'dashboard.overview.stats.scheduledPosts' },
  { key: 'connectedAccounts' as const, labelKey: 'dashboard.overview.stats.connectedAccounts' },
]

export function OverviewHero({ stats, isLoading }: OverviewHeroProps) {
  const { t } = useTranslation()
  const { data: session } = useSession()

  const hour = new Date().getHours()
  const greetingKey =
    hour < 12
      ? 'dashboard.overview.greeting.morning'
      : hour < 18
        ? 'dashboard.overview.greeting.afternoon'
        : 'dashboard.overview.greeting.evening'

  const firstName = session?.user?.name?.split(' ')[0] || ''

  return (
    <div className="mb-1">
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        className="text-text-primary text-2xl font-semibold tracking-tight"
      >
        {t(greetingKey, { name: firstName })}
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.08, ease }}
        className="mt-4 flex flex-wrap items-baseline gap-x-6 gap-y-2"
      >
        {metrics.map((m) => (
          <div key={m.key} className="flex items-baseline gap-1.5">
            {isLoading ? (
              <div className="bg-bg-subtle h-6 w-6 animate-pulse rounded" />
            ) : (
              <span className="text-text-primary font-mono text-xl font-semibold tabular-nums">
                <AnimatedNumber value={stats?.[m.key] ?? 0} />
              </span>
            )}
            <span className="text-text-tertiary text-sm">{t(m.labelKey)}</span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
