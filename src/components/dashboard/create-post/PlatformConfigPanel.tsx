/**
 * PlatformConfigPanel
 * Wrapper component for platform-specific configuration sections
 */

import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { InstagramConfigSection } from './InstagramConfigSection'
import { TikTokConfigSection } from './TikTokConfigSection'
import { YouTubeConfigSection } from './YouTubeConfigSection'
import type { PlatformConfigurations } from '@/types/posts'
import type { SocialPlatform } from '@/types/connections'
import type { MediaFile } from './MediaUploader'

interface PlatformConfigPanelProps {
  selectedPlatforms: SocialPlatform[]
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

  // Only show if at least one configurable platform is selected
  if (!hasInstagram && !hasTikTok && !hasYouTube) {
    return null
  }

  return (
    <div className={cn('space-y-4', className)}>
      <h3 className="text-muted-foreground text-[11px] font-medium tracking-wide uppercase">
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
      </div>
    </div>
  )
}
