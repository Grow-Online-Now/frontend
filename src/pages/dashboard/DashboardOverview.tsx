import { useActivityFeed } from '@/hooks/useActivityFeed'
import { useOverviewStats } from '@/hooks/useOverviewStats'
import { useStreak } from '@/hooks/useStreak'
import { usePosts } from '@/hooks/usePosts'
import { OverviewHero } from '@/components/dashboard/overview/OverviewHero'
import { ActivityFeed } from '@/components/dashboard/overview/ActivityFeed'
import { SmartQuickActions } from '@/components/dashboard/overview/SmartQuickActions'
import { StreakCompact } from '@/components/dashboard/overview/StreakCompact'
import { UpcomingPosts } from '@/components/dashboard/overview/UpcomingPosts'
import { ConnectedAccountsStrip } from '@/components/dashboard/overview/ConnectedAccountsStrip'
import { RecentPosts } from '@/components/dashboard/overview/RecentPosts'

export default function DashboardOverview() {
  const { items, isLoading: feedLoading, hasMore, loadMore } = useActivityFeed()
  const { stats, isLoading: statsLoading } = useOverviewStats()
  const { streak, isLoading: streakLoading } = useStreak()
  const { posts: recentPosts, isLoading: postsLoading } = usePosts({
    limit: 3,
    sort: 'created_at',
    order: 'desc',
  })

  return (
    <div>
      <OverviewHero stats={stats} isLoading={statsLoading} />

      {/* Main bento grid */}
      <div className="grid items-start gap-5 lg:grid-cols-[1fr_280px]">
        {/* Left: Activity Feed + Recent Posts */}
        <div className="flex flex-col gap-5">
          <ActivityFeed
            items={items}
            isLoading={feedLoading}
            hasMore={hasMore}
            onLoadMore={loadMore}
          />
          <RecentPosts posts={recentPosts} isLoading={postsLoading} />
        </div>

        {/* Right: Sidebar sections */}
        <div className="flex flex-col gap-5">
          <SmartQuickActions stats={stats} />
          <StreakCompact streak={streak} isLoading={streakLoading} />
          <UpcomingPosts posts={stats?.upcomingPosts ?? []} isLoading={statsLoading} />
          <ConnectedAccountsStrip />
        </div>
      </div>
    </div>
  )
}
