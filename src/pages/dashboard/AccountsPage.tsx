import { useState } from 'react'
import { PageHeader } from '@/components/dashboard/shared/PageHeader'
import {
  PlatformRow,
  ConnectPlatformModal,
  FacebookPageSelector,
} from '@/components/dashboard/accounts'
import { ErrorAlert } from '@/components/dashboard/shared/ErrorAlert'
import { InfoHint } from '@/components/dashboard/shared/InfoHint'
import { ProgressIndicator } from '@/components/dashboard/shared/ProgressIndicator'
import { Skeleton } from '@/components/ui/skeleton'
import { useConnections } from '@/hooks/useConnections'
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
]

export default function AccountsPage() {
  const {
    connections,
    isLoading,
    error,
    connect,
    disconnect,
    facebookPagesData,
    clearFacebookPages,
    refetch,
  } = useConnections()
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformConfig | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const getConnectionsForPlatform = (platformId: SocialPlatform): Connection[] => {
    return connections.filter((connection) => connection.platform === platformId)
  }

  const connectedPlatformsCount = platforms.filter(
    (platform) => getConnectionsForPlatform(platform.id).length > 0
  ).length

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
        <div className="mt-6 space-y-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        titleKey="dashboard.accounts.title"
        descriptionKey="dashboard.accounts.description"
      />

      <InfoHint textKey="dashboard.hints.accounts.intro" className="mt-2 mb-6" />

      <ProgressIndicator
        current={connectedPlatformsCount}
        total={platforms.length}
        labelKey="dashboard.hints.accounts.progress"
        showBar
        className="mb-6"
      />

      {error && <ErrorAlert message={error} className="mb-6" />}

      <div className="space-y-4">
        {platforms.map((platform) => (
          <PlatformRow
            key={platform.id}
            platform={platform}
            connections={getConnectionsForPlatform(platform.id)}
            onConnect={handleConnectClick}
            onDisconnect={handleDisconnect}
          />
        ))}
      </div>

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
    </div>
  )
}
