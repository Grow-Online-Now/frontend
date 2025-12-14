/**
 * TikTokConfigSection
 * TikTok-specific configuration options for post creation
 */

import { useTranslation } from 'react-i18next'
import { Film, Image } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PlatformIcon } from '@/components/dashboard/posts/PlatformIcon'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { TikTokConfig, TikTokContentType, TikTokPrivacyLevel } from '@/types/posts'
import type { MediaFile } from './MediaUploader'

interface TikTokConfigSectionProps {
  config: TikTokConfig
  onChange: (config: TikTokConfig) => void
  media: MediaFile[]
  className?: string
}

const CONTENT_TYPE_OPTIONS: {
  value: TikTokContentType
  labelKey: string
  descriptionKey: string
  icon: typeof Film
}[] = [
  {
    value: 'video',
    labelKey: 'dashboard.createPost.platformConfig.tiktok.types.video',
    descriptionKey: 'dashboard.createPost.platformConfig.tiktok.types.videoDesc',
    icon: Film,
  },
  {
    value: 'photo',
    labelKey: 'dashboard.createPost.platformConfig.tiktok.types.photo',
    descriptionKey: 'dashboard.createPost.platformConfig.tiktok.types.photoDesc',
    icon: Image,
  },
]

const PRIVACY_OPTIONS: { value: TikTokPrivacyLevel; labelKey: string }[] = [
  {
    value: 'PUBLIC_TO_EVERYONE',
    labelKey: 'dashboard.createPost.platformConfig.tiktok.privacyLevels.PUBLIC_TO_EVERYONE',
  },
  {
    value: 'MUTUAL_FOLLOW_FRIENDS',
    labelKey: 'dashboard.createPost.platformConfig.tiktok.privacyLevels.MUTUAL_FOLLOW_FRIENDS',
  },
  {
    value: 'FOLLOWER_OF_CREATOR',
    labelKey: 'dashboard.createPost.platformConfig.tiktok.privacyLevels.FOLLOWER_OF_CREATOR',
  },
  {
    value: 'SELF_ONLY',
    labelKey: 'dashboard.createPost.platformConfig.tiktok.privacyLevels.SELF_ONLY',
  },
]

export function TikTokConfigSection({
  config,
  onChange,
  media,
  className,
}: TikTokConfigSectionProps) {
  const { t } = useTranslation()

  // Auto-detect content type based on media
  const hasVideo = media.some((m) => m.type === 'video')
  const detectedType: TikTokContentType = hasVideo ? 'video' : 'photo'
  const currentType = config.contentType || detectedType

  const handleTypeChange = (type: TikTokContentType) => {
    onChange({ ...config, contentType: type })
  }

  const handlePrivacyChange = (privacy: TikTokPrivacyLevel) => {
    onChange({ ...config, privacyLevel: privacy })
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center gap-2">
        <PlatformIcon platform="tiktok" size="xs" />
        <h4 className="text-muted-foreground text-[11px] font-medium tracking-wide uppercase">
          {t('dashboard.createPost.platformConfig.tiktok.title')}
        </h4>
      </div>

      {/* Content Type */}
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
                  'mt-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 transition-colors duration-150',
                  isSelected ? 'border-primary' : 'border-border-muted'
                )}
              >
                {isSelected && <div className="bg-primary h-2 w-2 rounded-full" />}
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

      {/* Privacy */}
      <div className="space-y-1.5">
        <label className="text-muted-foreground text-xs font-medium">
          {t('dashboard.createPost.platformConfig.tiktok.privacy')}
        </label>
        <Select
          value={config.privacyLevel || 'PUBLIC_TO_EVERYONE'}
          onValueChange={(v) => handlePrivacyChange(v as TikTokPrivacyLevel)}
        >
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PRIVACY_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {t(option.labelKey)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Checkboxes */}
      <div className="space-y-2">
        <label className="border-border-subtle hover:bg-surface-elevated flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors">
          <input
            type="checkbox"
            checked={config.disableComment ?? false}
            onChange={(e) => onChange({ ...config, disableComment: e.target.checked })}
            className="text-primary focus:ring-primary border-input accent-primary h-4 w-4 rounded"
          />
          <span className="text-foreground text-sm">
            {t('dashboard.createPost.platformConfig.tiktok.disableComment')}
          </span>
        </label>

        {currentType === 'photo' && (
          <label className="border-border-subtle hover:bg-surface-elevated flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors">
            <input
              type="checkbox"
              checked={config.autoAddMusic ?? false}
              onChange={(e) => onChange({ ...config, autoAddMusic: e.target.checked })}
              className="text-primary focus:ring-primary border-input accent-primary h-4 w-4 rounded"
            />
            <span className="text-foreground text-sm">
              {t('dashboard.createPost.platformConfig.tiktok.autoAddMusic')}
            </span>
          </label>
        )}
      </div>
    </div>
  )
}
