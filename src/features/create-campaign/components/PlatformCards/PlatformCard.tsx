/**
 * PlatformCard Component
 * Individual platform card with media slot, caption, and settings
 */

import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { AlertTriangle, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { PlatformIcon } from '@/components/dashboard/posts/PlatformIcon'
import { MediaSlot } from './MediaSlot'
import { CaptionEditor } from './CaptionEditor'
import { PlatformSettings } from './PlatformSettings'
import type { Connection } from '@/types/connections'
import type { PlatformVariation, MediaAsset, PlatformCardState } from '../../types'
import type { PlatformConfigurations } from '@/types/posts'
import { PLATFORM_MEDIA_REQUIREMENTS } from '../../types'

interface PlatformCardProps {
  connection: Connection
  variation: PlatformVariation
  asset: MediaAsset | null
  masterCaption: string
  isDragOver?: boolean
  onToggleInclude: () => void
  onMediaDrop: (assetId: string) => void
  onMediaRemove: () => void
  onCaptionChange: (caption: string) => void
  onToggleSync: () => void
  onPlatformSettingsChange: (settings: PlatformConfigurations[keyof PlatformConfigurations]) => void
}

export function PlatformCard({
  connection,
  variation,
  asset,
  masterCaption,
  isDragOver,
  onToggleInclude,
  onMediaDrop: _onMediaDrop,
  onMediaRemove,
  onCaptionChange,
  onToggleSync,
  onPlatformSettingsChange,
}: PlatformCardProps) {
  // Note: onMediaDrop is handled at grid level via DnD context
  void _onMediaDrop
  const { t } = useTranslation()
  const { platform } = connection
  const requirements = PLATFORM_MEDIA_REQUIREMENTS[platform]

  // Determine card state
  const cardState = useMemo((): PlatformCardState => {
    if (!variation.included) return 'excluded'
    if (variation.validationWarnings.length > 0) return 'error'
    if (asset || variation.caption || masterCaption) {
      return variation.isSyncedToMaster ? 'synced' : 'custom'
    }
    return 'default'
  }, [variation, asset, masterCaption])

  // Validation warnings
  const warnings = useMemo(() => {
    const warns: string[] = []

    if (!variation.included) return warns

    // Check media requirement
    if (requirements.required && !asset) {
      warns.push(t('dashboard.campaign.platformCard.warnings.mediaRequired'))
    }

    return warns
  }, [variation.included, requirements.required, asset, t])

  return (
    <div
      className={cn(
        'campaign-platform-card p-4',
        isDragOver && 'campaign-card-drag-over',
        cardState === 'excluded' && 'campaign-platform-card-excluded',
        cardState === 'error' && 'campaign-platform-card-error'
      )}
      data-platform={platform}
      data-state={cardState}
    >
      {/* Card header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <PlatformIcon platform={platform} size="sm" showBackground />
          <div className="min-w-0">
            <p className="text-foreground truncate text-sm font-medium">
              {connection.displayName || connection.platformUsername}
            </p>
            <p className="text-muted-foreground truncate text-xs">@{connection.platformUsername}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Status indicator */}
          {cardState === 'error' && <AlertTriangle className="text-warning h-4 w-4" />}
          {cardState !== 'excluded' && cardState !== 'default' && cardState !== 'error' && (
            <Check className="text-success h-4 w-4" />
          )}

          {/* Include checkbox */}
          <Checkbox
            checked={variation.included}
            onCheckedChange={onToggleInclude}
            aria-label={t('dashboard.campaign.platformCard.include', {
              platform: connection.displayName || platform,
            })}
          />
        </div>
      </div>

      {/* Content area (collapsed when excluded) */}
      <div className={cn('campaign-expand', variation.included && 'campaign-expand-open')}>
        <div className="campaign-expand-content space-y-4">
          {/* Media slot */}
          <MediaSlot
            connectionId={connection.id}
            platform={platform}
            asset={asset}
            isRequired={requirements.required}
            onRemove={onMediaRemove}
            disabled={!variation.included}
          />

          {/* Caption editor */}
          <CaptionEditor
            platform={platform}
            caption={variation.caption}
            isSynced={variation.isSyncedToMaster}
            masterCaption={masterCaption}
            onCaptionChange={onCaptionChange}
            onToggleSync={onToggleSync}
            disabled={!variation.included}
          />

          {/* Validation warnings */}
          {warnings.length > 0 && (
            <div className="space-y-1">
              {warnings.map((warning, index) => (
                <div key={index} className="text-warning flex items-center gap-2 text-xs">
                  <AlertTriangle className="h-3 w-3 flex-shrink-0" />
                  <span>{warning}</span>
                </div>
              ))}
            </div>
          )}

          {/* Platform-specific settings */}
          <PlatformSettings
            platform={platform}
            settings={variation.platformSettings}
            onSettingsChange={onPlatformSettingsChange}
            disabled={!variation.included}
          />
        </div>
      </div>

      {/* Excluded state message */}
      {!variation.included && (
        <p className="text-muted-foreground mt-2 text-xs">
          {t('dashboard.campaign.platformCard.excluded')}
        </p>
      )}
    </div>
  )
}
