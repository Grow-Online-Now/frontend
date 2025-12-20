import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { PageHeader } from '@/components/dashboard/shared/PageHeader'
import { DashboardCard } from '@/components/dashboard/shared/DashboardCard'
import {
  ConnectedAccountRow,
  AvailablePlatformCard,
  ConnectPlatformModal,
  FacebookPageSelector,
  BlueskyConnectModal,
} from '@/components/dashboard/accounts'
import { ErrorAlert } from '@/components/dashboard/shared/ErrorAlert'
import { Skeleton } from '@/components/ui/skeleton'
import { useConnections } from '@/hooks/useConnections'
import { useOAuthResult } from '@/hooks/useOAuthResult'
import type { SocialPlatform, Connection } from '@/types/connections'

// Platform configuration with requirements for the connect modal
interface PlatformConfig {
  id: SocialPlatform
  requirements: { textKey: string }[]
}

const platforms: PlatformConfig[] = [
  {
    id: 'youtube',
    requirements: [
      { textKey: 'dashboard.accounts.requirements.youtube.channel' },
      { textKey: 'dashboard.accounts.requirements.youtube.permissions' },
    ],
  },
  {
    id: 'instagram',
    requirements: [
      { textKey: 'dashboard.accounts.requirements.instagram.business' },
      { textKey: 'dashboard.accounts.requirements.instagram.facebook' },
    ],
  },
  {
    id: 'facebook',
    requirements: [
      { textKey: 'dashboard.accounts.requirements.facebook.page' },
      { textKey: 'dashboard.accounts.requirements.facebook.permissions' },
    ],
  },
  {
    id: 'tiktok',
    requirements: [
      { textKey: 'dashboard.accounts.requirements.tiktok.creator' },
      { textKey: 'dashboard.accounts.requirements.tiktok.permissions' },
    ],
  },
  {
    id: 'twitter',
    requirements: [
      { textKey: 'dashboard.accounts.requirements.twitter.account' },
      { textKey: 'dashboard.accounts.requirements.twitter.permissions' },
    ],
  },
  {
    id: 'linkedin',
    requirements: [
      { textKey: 'dashboard.accounts.requirements.linkedin.page' },
      { textKey: 'dashboard.accounts.requirements.linkedin.permissions' },
    ],
  },
  {
    id: 'pinterest',
    requirements: [
      { textKey: 'dashboard.accounts.requirements.pinterest.business' },
      { textKey: 'dashboard.accounts.requirements.pinterest.permissions' },
    ],
  },
  {
    id: 'bluesky',
    requirements: [
      { textKey: 'dashboard.accounts.requirements.bluesky.account' },
      { textKey: 'dashboard.accounts.requirements.bluesky.appPassword' },
    ],
  },
  {
    id: 'threads',
    requirements: [
      { textKey: 'dashboard.accounts.requirements.threads.account' },
      { textKey: 'dashboard.accounts.requirements.threads.permissions' },
    ],
  },
]

export default function AccountsPage() {
  const { t } = useTranslation()
  const {
    connections,
    isLoading,
    error,
    connect,
    disconnect,
    facebookPagesData,
    setFacebookPagesData,
    clearFacebookPages,
    refetch,
    // Bluesky
    showBlueskyModal,
    setShowBlueskyModal,
    connectBlueskyAccount,
    blueskyLoading,
    blueskyError,
  } = useConnections()
  const oauthResult = useOAuthResult()
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformConfig | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [handledOAuthResult, setHandledOAuthResult] = useState(false)

  // Handle OAuth callback results from URL params (only once)
  useEffect(() => {
    if (!oauthResult || handledOAuthResult) return

    setHandledOAuthResult(true)

    if (oauthResult.success && oauthResult.platform === 'facebook' && oauthResult.facebookPages) {
      // Facebook: show page selector modal
      setFacebookPagesData({
        pendingKey: oauthResult.pendingKey!,
        pages: oauthResult.facebookPages,
      })
    } else if (oauthResult.success && oauthResult.platform) {
      // Other platforms: show success toast and refresh
      const platformName = t(`dashboard.accounts.platforms.${oauthResult.platform}`)
      toast.success(t('dashboard.accounts.oauth.success', { platform: platformName }))
      refetch()
    } else if (oauthResult.error) {
      toast.error(oauthResult.error)
    }
  }, [oauthResult, handledOAuthResult, refetch, setFacebookPagesData, t])

  // Filter platforms to show only unconnected ones
  const availablePlatforms = platforms.filter(
    (platform) => !connections.some((conn) => conn.platform === platform.id)
  )

  const handleConnectClick = (platformId: SocialPlatform) => {
    const platform = platforms.find((p) => p.id === platformId)
    if (platform) {
      setSelectedPlatform(platform)
      setIsModalOpen(true)
    }
  }

  const handleContinueConnect = (platformId: SocialPlatform) => {
    connect(platformId)
  }

  const handleDisconnect = async (connection: Connection) => {
    await disconnect(connection.id)
  }

  if (isLoading) {
    return (
      <div>
        <PageHeader
          titleKey="dashboard.accounts.title"
          descriptionKey="dashboard.accounts.description"
        />

        {/* Connected Accounts Skeleton */}
        <DashboardCard
          titleKey="dashboard.accounts.connected.title"
          descriptionKey="dashboard.accounts.connected.description"
          className="mt-6"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        </DashboardCard>

        {/* Available Platforms Skeleton */}
        <DashboardCard
          titleKey="dashboard.accounts.available.title"
          descriptionKey="dashboard.accounts.available.description"
          className="mt-6"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        </DashboardCard>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        titleKey="dashboard.accounts.title"
        descriptionKey="dashboard.accounts.description"
      />

      {error && <ErrorAlert message={error} className="mt-6" />}

      {/* Connected Accounts Section */}
      <DashboardCard
        titleKey="dashboard.accounts.connected.title"
        descriptionKey="dashboard.accounts.connected.description"
        className="mt-6"
      >
        {connections.length === 0 ? (
          <p className="text-muted-foreground text-sm">{t('dashboard.accounts.connected.empty')}</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {connections.map((connection) => (
              <ConnectedAccountRow
                key={connection.id}
                connection={connection}
                onDisconnect={handleDisconnect}
              />
            ))}
          </div>
        )}
      </DashboardCard>

      {/* Available Platforms Section */}
      {availablePlatforms.length > 0 && (
        <DashboardCard
          titleKey="dashboard.accounts.available.title"
          descriptionKey="dashboard.accounts.available.description"
          className="mt-6"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {availablePlatforms.map((platform) => (
              <AvailablePlatformCard
                key={platform.id}
                platform={platform}
                onConnect={handleConnectClick}
              />
            ))}
          </div>
          <p className="text-muted-foreground mt-4 text-sm">
            {t('dashboard.accounts.available.privacyNote')}
          </p>
        </DashboardCard>
      )}

      <ConnectPlatformModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        platform={selectedPlatform}
        onContinue={handleContinueConnect}
      />

      {facebookPagesData && (
        <FacebookPageSelector
          open={!!facebookPagesData}
          onOpenChange={(open) => {
            if (!open) clearFacebookPages()
          }}
          pendingKey={facebookPagesData.pendingKey}
          pages={facebookPagesData.pages}
          onSuccess={() => {
            clearFacebookPages()
            refetch()
          }}
          onCancel={clearFacebookPages}
        />
      )}

      <BlueskyConnectModal
        open={showBlueskyModal}
        onOpenChange={setShowBlueskyModal}
        onConnect={connectBlueskyAccount}
        isLoading={blueskyLoading}
        error={blueskyError}
      />
    </div>
  )
}
