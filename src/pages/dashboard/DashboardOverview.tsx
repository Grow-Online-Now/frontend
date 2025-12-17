import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '@/components/dashboard/shared/PageHeader'
import { DashboardCard } from '@/components/dashboard/shared/DashboardCard'
import { EmptyState } from '@/components/dashboard/shared/EmptyState'
import { TooltipIcon } from '@/components/dashboard/shared/TooltipIcon'
import { InfoHint } from '@/components/dashboard/shared/InfoHint'
import { StreakWidget } from '@/components/dashboard/shared/StreakWidget'
import { CreatePostTypeModal } from '@/components/dashboard/shared/CreatePostTypeModal'
import { Button } from '@/components/ui/button'
import { Calendar, Users, PenSquare, BarChart3, Link2 } from 'lucide-react'
import { useStreak } from '@/hooks/useStreak'

export default function DashboardOverview() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { lang = 'en' } = useParams<{ lang: string }>()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  // Fetch streak data
  const { streak, isLoading: isStreakLoading, error: streakError } = useStreak()

  // Mock data - replace with actual data from your backend
  const hasAccounts = false
  const stats = {
    scheduledPosts: 0,
    connectedAccounts: 0,
    postsThisWeek: 0,
  }

  const handleConnectAccount = () => {
    navigate(`/${lang}/dashboard/accounts`)
  }

  const handleCreatePost = () => {
    setIsCreateModalOpen(true)
  }

  if (!hasAccounts) {
    return (
      <div>
        <PageHeader
          titleKey="dashboard.overview.title"
          descriptionKey="dashboard.overview.description"
        />

        {/* Streak Widget - always visible */}
        <StreakWidget
          streak={streak}
          isLoading={isStreakLoading}
          error={streakError}
          className="mb-8"
        />

        <EmptyState
          icon={<Link2 className="h-6 w-6" />}
          titleKey="dashboard.overview.empty.title"
          descriptionKey="dashboard.overview.empty.description"
          ctaKey="dashboard.overview.empty.cta"
          onCtaClick={handleConnectAccount}
        />

        {/* Create Post Type Modal */}
        <CreatePostTypeModal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} />
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        titleKey="dashboard.overview.title"
        descriptionKey="dashboard.overview.description"
      />

      {/* Stats Grid */}
      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardCard className="flex items-center gap-4">
          <div className="bg-primary/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full">
            <Calendar className="text-primary h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-foreground text-2xl font-semibold">{stats.scheduledPosts}</p>
            <div className="flex items-center gap-1.5">
              <p className="text-muted-foreground truncate text-sm">
                {t('dashboard.overview.stats.scheduledPosts')}
              </p>
              <TooltipIcon tooltipKey="dashboard.hints.overview.stats.scheduledPosts" />
            </div>
          </div>
        </DashboardCard>

        <DashboardCard className="flex items-center gap-4">
          <div className="bg-success/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full">
            <Users className="text-success h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-foreground text-2xl font-semibold">{stats.connectedAccounts}</p>
            <div className="flex items-center gap-1.5">
              <p className="text-muted-foreground truncate text-sm">
                {t('dashboard.overview.stats.connectedAccounts')}
              </p>
              <TooltipIcon tooltipKey="dashboard.hints.overview.stats.connectedAccounts" />
            </div>
          </div>
        </DashboardCard>

        <DashboardCard className="flex items-center gap-4">
          <div className="bg-info/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full">
            <BarChart3 className="text-info h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-foreground text-2xl font-semibold">{stats.postsThisWeek}</p>
            <div className="flex items-center gap-1.5">
              <p className="text-muted-foreground truncate text-sm">
                {t('dashboard.overview.stats.postsThisWeek')}
              </p>
              <TooltipIcon tooltipKey="dashboard.hints.overview.stats.postsThisWeek" />
            </div>
          </div>
        </DashboardCard>
      </div>

      {/* Streak Widget */}
      <StreakWidget
        streak={streak}
        isLoading={isStreakLoading}
        error={streakError}
        className="mb-8"
      />

      {/* Quick Actions */}
      <DashboardCard titleKey="dashboard.overview.quickActions.title">
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleCreatePost} className="gap-2 rounded-full">
            <PenSquare className="h-4 w-4" />
            {t('dashboard.overview.quickActions.createPost')}
          </Button>
          <Button onClick={handleConnectAccount} variant="outline" className="gap-2 rounded-full">
            <Users className="h-4 w-4" />
            {t('dashboard.overview.quickActions.connectAccount')}
          </Button>
        </div>
        <InfoHint textKey="dashboard.hints.overview.quickActions" className="mt-4" />
      </DashboardCard>

      {/* Create Post Type Modal */}
      <CreatePostTypeModal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} />
    </div>
  )
}
