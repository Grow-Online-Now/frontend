/**
 * PlatformConfigPanel
 * Wrapper component for platform-specific configuration sections
 */

import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { InstagramConfigSection } from './InstagramConfigSection'
import { TikTokConfigSection } from './TikTokConfigSection'
import { YouTubeConfigSection } from './YouTubeConfigSection'
import { LinkedInConfigSection } from './LinkedInConfigSection'
import { PinterestConfigSection } from './PinterestConfigSection'
import type { PlatformConfigurations } from '@/types/posts'
import type { Connection, SocialPlatform } from '@/types/connections'
import type { MediaFile } from './MediaUploader'

interface PlatformConfigPanelProps {
  selectedPlatforms: SocialPlatform[]
  selectedAccounts: Connection[]
  media: MediaFile[]
  platformConfigs: PlatformConfigurations
  onConfigChange: (configs: PlatformConfigurations) => void
  className?: string
  // YouTube thumbnail props
  onYouTubeThumbnailUpload?: (file: File) => Promise<string | null>
  youTubeThumbnailPreviewUrl?: string | null
  isUploadingYouTubeThumbnail?: boolean
}

export function PlatformConfigPanel({
  selectedPlatforms,
  selectedAccounts,
  media,
  platformConfigs,
  onConfigChange,
  className,
  onYouTubeThumbnailUpload,
  youTubeThumbnailPreviewUrl,
  isUploadingYouTubeThumbnail,
}: PlatformConfigPanelProps) {
  const { t } = useTranslation()

  const hasInstagram = selectedPlatforms.includes('instagram')
  const hasTikTok = selectedPlatforms.includes('tiktok')
  const hasYouTube = selectedPlatforms.includes('youtube')
  const hasLinkedIn = selectedPlatforms.includes('linkedin')
  const hasPinterest = selectedPlatforms.includes('pinterest')

  // Get Pinterest connection ID for board fetching
  const pinterestConnectionId = useMemo(
    () => selectedAccounts.find((c) => c.platform === 'pinterest')?.id ?? null,
    [selectedAccounts]
  )

  // Only show if at least one configurable platform is selected
  if (!hasInstagram && !hasTikTok && !hasYouTube && !hasLinkedIn && !hasPinterest) {
    return null
  }

  return (
    <div className={cn('space-y-4', className)}>
      <h3 className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
        {t('dashboard.createPost.platformConfig.title')}
      </h3>

      <div className="space-y-6">
        {hasInstagram && (
          <InstagramConfigSection
            config={platformConfigs.instagram || {}}
            onChange={(instagram) => onConfigChange({ ...platformConfigs, instagram })}
            media={media}
          />
        )}

        {hasTikTok && (
          <TikTokConfigSection
            config={platformConfigs.tiktok || {}}
            onChange={(tiktok) => onConfigChange({ ...platformConfigs, tiktok })}
            media={media}
          />
        )}

        {hasYouTube && (
          <YouTubeConfigSection
            config={platformConfigs.youtube || {}}
            onChange={(youtube) => onConfigChange({ ...platformConfigs, youtube })}
            media={media}
            onThumbnailUpload={onYouTubeThumbnailUpload}
            thumbnailPreviewUrl={youTubeThumbnailPreviewUrl}
            isUploadingThumbnail={isUploadingYouTubeThumbnail}
          />
        )}

        {hasLinkedIn && (
          <LinkedInConfigSection
            config={platformConfigs.linkedin || {}}
            onChange={(linkedin) => onConfigChange({ ...platformConfigs, linkedin })}
          />
        )}

        {hasPinterest && (
          <PinterestConfigSection
            connectionId={pinterestConnectionId}
            config={platformConfigs.pinterest || {}}
            onChange={(pinterest) => onConfigChange({ ...platformConfigs, pinterest })}
          />
        )}
      </div>
    </div>
  )
}
