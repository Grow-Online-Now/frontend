/**
 * YouTubeConfigSection
 * YouTube-specific configuration options for post creation
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Film, Smartphone, ImageIcon, X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PlatformIcon } from '@/components/dashboard/posts/PlatformIcon'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { YouTubeConfig, YouTubeContentType, YouTubePrivacyStatus } from '@/types/posts'
import { YOUTUBE_CATEGORIES } from '@/types/posts'
import type { MediaFile } from './MediaUploader'
import { ThumbnailSelectorModal } from './ThumbnailSelectorModal'

interface YouTubeConfigSectionProps {
  config: YouTubeConfig
  onChange: (config: YouTubeConfig) => void
  media: MediaFile[]
  className?: string
  onThumbnailUpload?: (file: File) => Promise<string | null>
  thumbnailPreviewUrl?: string | null
  isUploadingThumbnail?: boolean
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
  onThumbnailUpload,
  thumbnailPreviewUrl,
  isUploadingThumbnail,
}: YouTubeConfigSectionProps) {
  const { t } = useTranslation()
  const [tagsInput, setTagsInput] = useState(config.tags?.join(', ') || '')
  const [showThumbnailModal, setShowThumbnailModal] = useState(false)

  // Auto-detect content type based on media
  // Default to 'short' if only images, 'video' if there's video content
  const hasVideo = media.some((m) => m.type === 'video')
  const videoMedia = media.find((m) => m.type === 'video')
  const detectedType: YouTubeContentType = hasVideo ? 'video' : 'short'
  const currentType = config.contentType || detectedType

  const handleTypeChange = (type: YouTubeContentType) => {
    onChange({ ...config, contentType: type })
  }

  const handlePrivacyChange = (privacy: YouTubePrivacyStatus) => {
    onChange({ ...config, privacyStatus: privacy })
  }

  const handleCategoryChange = (categoryId: string) => {
    onChange({ ...config, categoryId: categoryId || undefined })
  }

  const handleTagsChange = (value: string) => {
    setTagsInput(value)
    const tags = value
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)
    onChange({ ...config, tags })
  }

  const handleFrameSelected = async (file: File) => {
    if (!onThumbnailUpload) return

    const mediaId = await onThumbnailUpload(file)
    if (mediaId) {
      onChange({ ...config, thumbnailMediaId: mediaId })
    }
  }

  const handleRemoveThumbnail = () => {
    onChange({ ...config, thumbnailMediaId: undefined })
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center gap-2">
        <PlatformIcon platform="youtube" size="xs" />
        <h4 className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
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

      {/* Category */}
      <div className="space-y-1.5">
        <label className="text-muted-foreground text-xs font-medium">
          {t('dashboard.createPost.platformConfig.youtube.category')}
        </label>
        <Select value={config.categoryId || ''} onValueChange={handleCategoryChange}>
          <SelectTrigger className="h-9">
            <SelectValue
              placeholder={t('dashboard.createPost.platformConfig.youtube.categoryPlaceholder')}
            />
          </SelectTrigger>
          <SelectContent>
            {YOUTUBE_CATEGORIES.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {t(category.labelKey)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Thumbnail */}
      <div className="space-y-1.5">
        <label className="text-muted-foreground text-xs font-medium">
          {t('dashboard.createPost.platformConfig.youtube.thumbnail.title')}
        </label>

        {config.thumbnailMediaId && thumbnailPreviewUrl ? (
          // Show thumbnail preview
          <div className="border-border-subtle relative overflow-hidden rounded-lg border">
            <img
              src={thumbnailPreviewUrl}
              alt="Thumbnail"
              className="aspect-video w-full object-cover"
            />
            <div className="bg-foreground/40 absolute inset-0 flex items-center justify-center opacity-0 transition-opacity hover:opacity-100">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleRemoveThumbnail}
                className="gap-1.5"
              >
                <X className="h-3.5 w-3.5" />
                {t('dashboard.createPost.platformConfig.youtube.thumbnail.remove')}
              </Button>
            </div>
            <div className="bg-success/90 text-success-foreground absolute bottom-2 left-2 flex items-center gap-1 rounded px-2 py-0.5 text-xs">
              <ImageIcon className="h-3 w-3" />
              {t('dashboard.createPost.platformConfig.youtube.thumbnail.selected')}
            </div>
          </div>
        ) : isUploadingThumbnail ? (
          // Show uploading state
          <div className="border-border-subtle flex aspect-video items-center justify-center rounded-lg border">
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              {t('dashboard.createPost.platformConfig.youtube.thumbnailSelector.extracting')}
            </div>
          </div>
        ) : hasVideo && videoMedia ? (
          // Show select button when video exists
          <Button
            variant="outline"
            className="h-auto w-full justify-start gap-2 py-3"
            onClick={() => setShowThumbnailModal(true)}
          >
            <ImageIcon className="text-muted-foreground h-4 w-4" />
            <span>{t('dashboard.createPost.platformConfig.youtube.thumbnail.selectFrame')}</span>
          </Button>
        ) : (
          // Show message when no video
          <p className="text-muted-foreground text-xs">
            {t('dashboard.createPost.platformConfig.youtube.thumbnail.needsVideo')}
          </p>
        )}
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
            className="border-input text-primary focus:ring-primary h-4 w-4 rounded accent-[var(--color-primary)]"
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
            className="border-input text-primary focus:ring-primary h-4 w-4 rounded accent-[var(--color-primary)]"
          />
          <span className="text-foreground text-sm">
            {t('dashboard.createPost.platformConfig.youtube.madeForKids')}
          </span>
        </label>
      </div>

      {/* Thumbnail Selector Modal */}
      {videoMedia && (
        <ThumbnailSelectorModal
          isOpen={showThumbnailModal}
          onClose={() => setShowThumbnailModal(false)}
          videoUrl={videoMedia.url}
          videoFileName={videoMedia.file.name}
          onFrameSelected={handleFrameSelected}
        />
      )}
    </div>
  )
}
