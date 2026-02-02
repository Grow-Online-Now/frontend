/**
 * InstagramConfigSection
 * Instagram-specific configuration options for post creation
 */

import { useTranslation } from 'react-i18next'
import { Image, Film, Clock, LayoutGrid } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { InstagramConfig, InstagramContentType } from '@/types/posts'
import type { MediaFile } from './MediaUploader'

interface InstagramConfigSectionProps {
  config: InstagramConfig
  onChange: (config: InstagramConfig) => void
  media: MediaFile[]
  className?: string
}

const CONTENT_TYPE_OPTIONS: {
  value: InstagramContentType
  labelKey: string
  descriptionKey: string
  icon: typeof Image
}[] = [
  {
    value: 'post',
    labelKey: 'dashboard.createPost.platformConfig.instagram.types.post',
    descriptionKey: 'dashboard.createPost.platformConfig.instagram.types.postDesc',
    icon: Image,
  },
  {
    value: 'reel',
    labelKey: 'dashboard.createPost.platformConfig.instagram.types.reel',
    descriptionKey: 'dashboard.createPost.platformConfig.instagram.types.reelDesc',
    icon: Film,
  },
  {
    value: 'story',
    labelKey: 'dashboard.createPost.platformConfig.instagram.types.story',
    descriptionKey: 'dashboard.createPost.platformConfig.instagram.types.storyDesc',
    icon: Clock,
  },
  {
    value: 'carousel',
    labelKey: 'dashboard.createPost.platformConfig.instagram.types.carousel',
    descriptionKey: 'dashboard.createPost.platformConfig.instagram.types.carouselDesc',
    icon: LayoutGrid,
  },
]

export function InstagramConfigSection({
  config,
  onChange,
  media,
  className,
}: InstagramConfigSectionProps) {
  const { t } = useTranslation()

  // Auto-detect content type based on media
  const hasVideo = media.some((m) => m.type === 'video')
  const mediaCount = media.length
  const detectedType: InstagramContentType =
    mediaCount > 1 ? 'carousel' : hasVideo ? 'reel' : 'post'

  const currentType = config.contentType || detectedType

  const handleTypeChange = (type: InstagramContentType) => {
    onChange({ ...config, contentType: type })
  }

  const handleShareToFeedChange = (checked: boolean) => {
    onChange({ ...config, shareToFeed: checked })
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="space-y-2">
        {CONTENT_TYPE_OPTIONS.map((option) => {
          const Icon = option.icon
          const isSelected = currentType === option.value

          return (
            <div
              key={option.value}
              className={cn(
                'flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-all duration-150',
                isSelected
                  ? 'border-primary/40 bg-primary/5'
                  : 'border-border-subtle hover:border-border hover:bg-surface-elevated'
              )}
              onClick={() => handleTypeChange(option.value)}
            >
              <div
                className={cn(
                  'mt-0.5 flex size-5 items-center justify-center rounded-full border-2 transition-colors duration-150',
                  isSelected ? 'border-primary' : 'border-border-muted'
                )}
              >
                {isSelected && <div className="bg-primary size-2 rounded-full" />}
              </div>

              <Icon
                className={cn(
                  'mt-0.5 h-4 w-4 shrink-0 transition-colors',
                  isSelected ? 'text-primary' : 'text-muted-foreground'
                )}
              />

              <div className="flex-1">
                <p className="text-foreground text-sm font-medium">{t(option.labelKey)}</p>
                <p className="text-muted-foreground text-xs">{t(option.descriptionKey)}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Share to Feed option for Reels */}
      {currentType === 'reel' && (
        <label className="border-border-subtle hover:bg-surface-elevated mt-2 flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors">
          <input
            type="checkbox"
            checked={config.shareToFeed ?? true}
            onChange={(e) => handleShareToFeedChange(e.target.checked)}
            className="border-input text-primary focus:ring-primary h-4 w-4 rounded accent-[var(--color-primary)]"
          />
          <span className="text-foreground text-sm">
            {t('dashboard.createPost.platformConfig.instagram.shareToFeed')}
          </span>
        </label>
      )}
    </div>
  )
}
