/**
 * YouTubeConfigSection
 * YouTube-specific configuration options for post creation
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Film, Smartphone } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PlatformIcon } from '@/components/dashboard/posts/PlatformIcon'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { YouTubeConfig, YouTubeContentType, YouTubePrivacyStatus } from '@/types/posts'
import type { MediaFile } from './MediaUploader'

interface YouTubeConfigSectionProps {
  config: YouTubeConfig
  onChange: (config: YouTubeConfig) => void
  media: MediaFile[]
  className?: string
}

const CONTENT_TYPE_OPTIONS: {
  value: YouTubeContentType
  labelKey: string
  descriptionKey: string
  icon: typeof Film
}[] = [
  {
    value: 'video',
    labelKey: 'dashboard.createPost.platformConfig.youtube.types.video',
    descriptionKey: 'dashboard.createPost.platformConfig.youtube.types.videoDesc',
    icon: Film,
  },
  {
    value: 'short',
    labelKey: 'dashboard.createPost.platformConfig.youtube.types.short',
    descriptionKey: 'dashboard.createPost.platformConfig.youtube.types.shortDesc',
    icon: Smartphone,
  },
]

const PRIVACY_OPTIONS: { value: YouTubePrivacyStatus; labelKey: string }[] = [
  {
    value: 'public',
    labelKey: 'dashboard.createPost.platformConfig.youtube.privacyLevels.public',
  },
  {
    value: 'unlisted',
    labelKey: 'dashboard.createPost.platformConfig.youtube.privacyLevels.unlisted',
  },
  {
    value: 'private',
    labelKey: 'dashboard.createPost.platformConfig.youtube.privacyLevels.private',
  },
]

export function YouTubeConfigSection({
  config,
  onChange,
  media,
  className,
}: YouTubeConfigSectionProps) {
  const { t } = useTranslation()
  const [tagsInput, setTagsInput] = useState(config.tags?.join(', ') || '')

  // Auto-detect content type based on media
  // Default to 'short' if only images, 'video' if there's video content
  const hasVideo = media.some((m) => m.type === 'video')
  const detectedType: YouTubeContentType = hasVideo ? 'video' : 'short'
  const currentType = config.contentType || detectedType

  const handleTypeChange = (type: YouTubeContentType) => {
    onChange({ ...config, contentType: type })
  }

  const handlePrivacyChange = (privacy: YouTubePrivacyStatus) => {
    onChange({ ...config, privacyStatus: privacy })
  }

  const handleTagsChange = (value: string) => {
    setTagsInput(value)
    const tags = value
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)
    onChange({ ...config, tags })
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center gap-2">
        <PlatformIcon platform="youtube" size="xs" />
        <h4 className="text-muted-foreground text-[11px] font-medium tracking-wide uppercase">
          {t('dashboard.createPost.platformConfig.youtube.title')}
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
          {t('dashboard.createPost.platformConfig.youtube.privacy')}
        </label>
        <Select
          value={config.privacyStatus || 'public'}
          onValueChange={(v) => handlePrivacyChange(v as YouTubePrivacyStatus)}
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

      {/* Tags */}
      <div className="space-y-1.5">
        <label className="text-muted-foreground text-xs font-medium">
          {t('dashboard.createPost.platformConfig.youtube.tags')}
        </label>
        <Input
          type="text"
          value={tagsInput}
          onChange={(e) => handleTagsChange(e.target.value)}
          placeholder={t('dashboard.createPost.platformConfig.youtube.tagsPlaceholder')}
          className="h-9"
        />
      </div>

      {/* Checkboxes */}
      <div className="space-y-2">
        <label className="border-border-subtle hover:bg-surface-elevated flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors">
          <input
            type="checkbox"
            checked={config.notifySubscribers ?? true}
            onChange={(e) => onChange({ ...config, notifySubscribers: e.target.checked })}
            className="text-primary focus:ring-primary h-4 w-4 rounded border-gray-300"
          />
          <span className="text-foreground text-sm">
            {t('dashboard.createPost.platformConfig.youtube.notifySubscribers')}
          </span>
        </label>

        <label className="border-border-subtle hover:bg-surface-elevated flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors">
          <input
            type="checkbox"
            checked={config.madeForKids ?? false}
            onChange={(e) => onChange({ ...config, madeForKids: e.target.checked })}
            className="text-primary focus:ring-primary h-4 w-4 rounded border-gray-300"
          />
          <span className="text-foreground text-sm">
            {t('dashboard.createPost.platformConfig.youtube.madeForKids')}
          </span>
        </label>
      </div>
    </div>
  )
}
