import { useTranslation } from 'react-i18next'
import { Calendar, Users, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { OverviewStats } from '@/types/activity'

interface OverviewStatsCardsProps {
  stats: OverviewStats | null
  isLoading: boolean
}

const statItems = [
  {
    key: 'postsThisWeek' as const,
    labelKey: 'dashboard.overview.stats.postsThisWeek',
    icon: BarChart3,
    color: 'text-info',
    bg: 'bg-info/10',
  },
  {
    key: 'scheduledPosts' as const,
    labelKey: 'dashboard.overview.stats.scheduledPosts',
    icon: Calendar,
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    key: 'connectedAccounts' as const,
    labelKey: 'dashboard.overview.stats.connectedAccounts',
    icon: Users,
    color: 'text-success',
    bg: 'bg-success/10',
  },
]

export function OverviewStatsCards({ stats, isLoading }: OverviewStatsCardsProps) {
  const { t } = useTranslation()

  return (
    <div className="border-border-subtle bg-card rounded-xl border p-4">
      <div className="flex flex-col gap-3">
        {statItems.map((item) => (
          <div key={item.key} className="flex items-center gap-3">
            <div
              className={cn(
                'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                item.bg
              )}
            >
              <item.icon className={cn('h-4 w-4', item.color)} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-text-tertiary truncate text-xs">{t(item.labelKey)}</p>
              {isLoading ? (
                <div className="bg-bg-subtle mt-0.5 h-5 w-8 animate-pulse rounded" />
              ) : (
                <p className="text-text-primary text-lg font-semibold">
                  {stats?.[item.key] ?? 0}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
