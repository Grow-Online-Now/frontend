/**
 * PostsStatusTabs Component
 * Tab-based filtering for posts by status with counts
 */

import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import type { PostStatusTab, PostStatusCounts } from '@/types/posts'

interface PostsStatusTabsProps {
  activeTab: PostStatusTab
  counts: PostStatusCounts | null
  onTabChange: (tab: PostStatusTab) => void
  isLoading?: boolean
  className?: string
}

const TABS: PostStatusTab[] = ['all', 'draft', 'scheduled', 'published', 'failed']

export function PostsStatusTabs({
  activeTab,
  counts,
  onTabChange,
  isLoading = false,
  className,
}: PostsStatusTabsProps) {
  const { t } = useTranslation()

  const getTabLabel = (tab: PostStatusTab): string => {
    const labels: Record<PostStatusTab, string> = {
      all: t('dashboard.posts.filters.all'),
      draft: t('dashboard.posts.status.draft'),
      scheduled: t('dashboard.posts.filters.scheduled'),
      published: t('dashboard.posts.status.completed'),
      failed: t('dashboard.posts.status.failed'),
    }
    return labels[tab]
  }

  return (
    <div
      className={cn(
        'bg-muted/50 scrollbar-hide inline-flex gap-1 overflow-x-auto rounded-xl p-1',
        className
      )}
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab
        const count = counts?.[tab] ?? 0

        return (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={cn(
              'flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all',
              'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
              isActive
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
            )}
          >
            <span>{getTabLabel(tab)}</span>
            <span
              className={cn(
                'min-w-5 rounded-md px-1.5 py-0.5 text-xs font-medium tabular-nums',
                isActive ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground',
                isLoading && 'animate-pulse'
              )}
            >
              {isLoading ? '-' : count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
