/**
 * PlatformCardsGrid Component
 * Responsive grid of platform cards
 */

import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { PlatformCard } from './PlatformCard'
import { AddPlatformCard } from './AddPlatformCard'
import type { Connection } from '@/types/connections'
import type { PlatformVariation, MediaAsset } from '../../types'
import type { PlatformConfigurations } from '@/types/posts'

interface PlatformCardsGridProps {
  connections: Connection[]
  variations: PlatformVariation[]
  assets: MediaAsset[]
  masterCaption: string
  dragOverConnectionId?: string | null
  onToggleInclude: (connectionId: string) => void
  onMediaDrop: (connectionId: string, assetId: string) => void
  onMediaRemove: (connectionId: string) => void
  onCaptionChange: (connectionId: string, caption: string) => void
  onToggleSync: (connectionId: string) => void
  onPlatformSettingsChange: (
    connectionId: string,
    settings: PlatformConfigurations[keyof PlatformConfigurations]
  ) => void
  onAddPlatform: () => void
  className?: string
}

export function PlatformCardsGrid({
  connections,
  variations,
  assets,
  masterCaption,
  dragOverConnectionId,
  onToggleInclude,
  onMediaDrop,
  onMediaRemove,
  onCaptionChange,
  onToggleSync,
  onPlatformSettingsChange,
  onAddPlatform,
  className,
}: PlatformCardsGridProps) {
  const { t } = useTranslation()

  // Get variation for a connection
  const getVariation = useCallback(
    (connectionId: string): PlatformVariation | undefined => {
      return variations.find((v) => v.connectionId === connectionId)
    },
    [variations]
  )

  // Get asset for a variation
  const getAsset = useCallback(
    (assetId: string | null): MediaAsset | null => {
      if (!assetId) return null
      return assets.find((a) => a.id === assetId) || null
    },
    [assets]
  )

  // Filter to only active connections that have variations
  const activeConnections = useMemo(() => {
    return connections.filter((c) => c.isActive && !c.isExpired && !c.needsRefresh)
  }, [connections])

  // Count included platforms
  const includedCount = useMemo(() => {
    return variations.filter((v) => v.included).length
  }, [variations])

  if (activeConnections.length === 0) {
    return (
      <div className={cn('flex flex-1 flex-col items-center justify-center py-12', className)}>
        <div className="max-w-sm text-center">
          <p className="text-foreground mb-2 text-lg font-medium">
            {t('dashboard.campaign.platformCards.noConnections.title')}
          </p>
          <p className="text-muted-foreground mb-4 text-sm">
            {t('dashboard.campaign.platformCards.noConnections.description')}
          </p>
          <AddPlatformCard onClick={onAddPlatform} />
        </div>
      </div>
    )
  }

  return (
    <div className={cn('flex h-full flex-col', className)}>
      {/* Header */}
      <div className="mb-4 flex flex-shrink-0 items-center justify-between">
        <div>
          <h2 className="text-foreground text-sm font-semibold">
            {t('dashboard.campaign.platformCards.title')}
          </h2>
          <p className="text-muted-foreground mt-0.5 text-xs">
            {t('dashboard.campaign.platformCards.subtitle', {
              count: includedCount,
              total: activeConnections.length,
            })}
          </p>
        </div>
      </div>

      {/* Grid */}
      <div
        className={cn(
          '-mx-2 flex-1 overflow-y-auto px-2',
          'grid gap-4',
          'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3',
          'auto-rows-max'
        )}
      >
        {activeConnections.map((connection) => {
          const variation = getVariation(connection.id)
          if (!variation) return null

          const asset = getAsset(variation.mediaAssetId)

          return (
            <PlatformCard
              key={connection.id}
              connection={connection}
              variation={variation}
              asset={asset}
              masterCaption={masterCaption}
              isDragOver={dragOverConnectionId === connection.id}
              onToggleInclude={() => onToggleInclude(connection.id)}
              onMediaDrop={(assetId) => onMediaDrop(connection.id, assetId)}
              onMediaRemove={() => onMediaRemove(connection.id)}
              onCaptionChange={(caption) => onCaptionChange(connection.id, caption)}
              onToggleSync={() => onToggleSync(connection.id)}
              onPlatformSettingsChange={(settings) =>
                onPlatformSettingsChange(connection.id, settings)
              }
            />
          )
        })}

        {/* Add platform card */}
        <AddPlatformCard onClick={onAddPlatform} />
      </div>
    </div>
  )
}
