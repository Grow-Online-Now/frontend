/**
 * MediaPreviewPanel Component
 * Desktop-only sticky preview panel for media-first flow
 * Shows platform-specific preview mockups for Instagram, TikTok, YouTube, Pinterest
 * Includes compact library/drafts section
 */

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Play, Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Music2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PlatformIcon } from '@/components/dashboard/posts/PlatformIcon'
import { AccountAvatar } from '@/components/common/AccountAvatar'
import { CompactLibrarySection } from '@/components/create/text/CompactLibrarySection'
import type { MediaPlatformWithValidation } from '@/types/create'
import type { FileUploadState } from '@/hooks/useMediaUpload'
import type { MediaItem } from '@/types/media'
import type { PostResponse } from '@/types/posts'

interface MediaPreviewPanelProps {
  caption: string
  media: FileUploadState[]
  selectedPlatforms: MediaPlatformWithValidation[]
  // Library section props
  recentMedia?: MediaItem[]
  recentDrafts?: PostResponse[]
  isLoadingMedia?: boolean
  isLoadingDrafts?: boolean
  onAddMedia?: (media: MediaItem) => void
  onSelectDraft?: (draft: PostResponse) => void
  onOpenMediaLibrary?: () => void
  className?: string
}

export function MediaPreviewPanel({
  caption,
  media,
  selectedPlatforms,
  recentMedia = [],
  recentDrafts = [],
  isLoadingMedia = false,
  isLoadingDrafts = false,
  onAddMedia,
  onSelectDraft,
  onOpenMediaLibrary,
  className,
}: MediaPreviewPanelProps) {
  const { t } = useTranslation()
  const [activePlatformId, setActivePlatformId] = useState<string | null>(null)

  // Auto-select first platform when selection changes
  useEffect(() => {
    if (selectedPlatforms.length > 0) {
      const currentExists = selectedPlatforms.some((p) => p.id === activePlatformId)
      if (!currentExists) {
        setActivePlatformId(selectedPlatforms[0].id)
      }
    } else {
      setActivePlatformId(null)
    }
  }, [selectedPlatforms, activePlatformId])

  // Get active platform
  const activePlatform = selectedPlatforms.find((p) => p.id === activePlatformId)

  return (
    <div
      className={cn(
        'border-border bg-bg-subtle sticky top-8 flex h-fit w-full flex-col rounded-2xl border',
        className
      )}
    >
      {/* Header with title */}
      <div className="border-border border-b px-5 py-4">
        <div className="text-text-muted text-xs font-medium tracking-wider uppercase">
          {t('dashboard.create.media.preview.title')}
        </div>
      </div>

      {/* Platform tabs - only show if multiple platforms selected */}
      {selectedPlatforms.length > 1 && (
        <div className="border-border border-b px-4 py-3">
          <div className="scrollbar-none flex gap-1.5 overflow-x-auto">
            {selectedPlatforms.map((platform) => (
              <button
                key={platform.id}
                type="button"
                onClick={() => setActivePlatformId(platform.id)}
                className={cn(
                  'flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs transition-colors',
                  platform.id === activePlatformId
                    ? 'bg-bg-elevated text-text-primary font-medium'
                    : 'text-text-muted hover:text-text-primary hover:bg-bg-hover'
                )}
              >
                <PlatformIcon platform={platform.platform} size="xs" />
                <span className="capitalize">{platform.platform}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Preview content */}
      <div className="flex-1 p-4">
        {selectedPlatforms.length === 0 ? (
          // Empty state - no platforms selected
          <div className="flex items-center justify-center py-8">
            <p className="text-text-muted text-center text-sm">
              {t('dashboard.create.media.preview.noPlatforms')}
            </p>
          </div>
        ) : media.length === 0 ? (
          // Empty state - no media
          <div className="flex items-center justify-center py-8">
            <p className="text-text-muted text-center text-sm">
              {t('dashboard.create.media.preview.noMedia')}
            </p>
          </div>
        ) : activePlatform ? (
          <>
            {activePlatform.platform === 'instagram' && (
              <InstagramPreview account={activePlatform} media={media} caption={caption} />
            )}
            {activePlatform.platform === 'tiktok' && (
              <TikTokPreview account={activePlatform} media={media} caption={caption} />
            )}
            {activePlatform.platform === 'youtube' && (
              <YouTubePreview account={activePlatform} media={media} caption={caption} />
            )}
            {activePlatform.platform === 'pinterest' && (
              <PinterestPreview account={activePlatform} media={media} caption={caption} />
            )}
          </>
        ) : null}
      </div>

      {/* Compact Library Section - only show if callbacks provided */}
      {onAddMedia && onSelectDraft && onOpenMediaLibrary && (
        <div className="border-border border-t px-4 py-4">
          <CompactLibrarySection
            recentMedia={recentMedia}
            recentDrafts={recentDrafts}
            isLoadingMedia={isLoadingMedia}
            isLoadingDrafts={isLoadingDrafts}
            onAddMedia={onAddMedia}
            onSelectDraft={onSelectDraft}
            onOpenMediaLibrary={onOpenMediaLibrary}
          />
        </div>
      )}
    </div>
  )
}

/**
 * Instagram-style preview mockup
 */
function InstagramPreview({
  account,
  media,
  caption,
}: {
  account: MediaPlatformWithValidation
  media: FileUploadState[]
  caption: string
}) {
  const firstMedia = media[0]
  const hasMultiple = media.length > 1

  return (
    <div className="border-border bg-bg-elevated overflow-hidden rounded-xl border">
      {/* Header */}
      <div className="flex items-center gap-3 p-3">
        <AccountAvatar
          src={account.avatarUrl}
          platform="instagram"
          name={account.platformUsername}
          size="sm"
        />
        <div className="min-w-0 flex-1">
          <div className="text-text-primary truncate text-sm font-semibold">
            {account.platformUsername}
          </div>
        </div>
        <MoreHorizontal className="text-text-muted h-5 w-5" />
      </div>

      {/* Media */}
      <div className="relative aspect-square w-full overflow-hidden bg-black">
        {firstMedia?.type === 'image' ? (
          <img src={firstMedia.localUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <>
            <video src={firstMedia?.localUrl} className="h-full w-full object-cover" muted />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/60">
                <Play className="h-6 w-6 text-white" fill="white" />
              </div>
            </div>
          </>
        )}
        {hasMultiple && (
          <div className="bg-bg-elevated/90 absolute top-3 right-3 rounded-full px-2 py-1 text-xs font-medium">
            1/{media.length}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-4">
          <Heart className="h-6 w-6" />
          <MessageCircle className="h-6 w-6" />
          <Send className="h-6 w-6" />
        </div>
        <Bookmark className="h-6 w-6" />
      </div>

      {/* Caption */}
      {caption && (
        <div className="px-3 pb-3">
          <p className="text-text-primary text-sm">
            <span className="font-semibold">{account.platformUsername}</span>{' '}
            <span className="line-clamp-2">{caption}</span>
          </p>
        </div>
      )}
    </div>
  )
}

/**
 * TikTok-style preview mockup (vertical phone frame)
 */
function TikTokPreview({
  account,
  media,
  caption,
}: {
  account: MediaPlatformWithValidation
  media: FileUploadState[]
  caption: string
}) {
  const firstMedia = media[0]

  return (
    <div className="bg-bg-elevated relative mx-auto aspect-[9/16] w-full max-w-[200px] overflow-hidden rounded-2xl">
      {/* Video/Image background */}
      <div className="absolute inset-0 bg-black">
        {firstMedia?.type === 'image' ? (
          <img src={firstMedia.localUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <video src={firstMedia?.localUrl} className="h-full w-full object-cover" muted />
        )}
      </div>

      {/* Overlay content */}
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 via-transparent to-transparent p-3">
        {/* Account info and caption */}
        <div className="mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-white">@{account.platformUsername}</span>
          </div>
          {caption && <p className="mt-1 line-clamp-2 text-xs text-white/90">{caption}</p>}
        </div>

        {/* Music bar */}
        <div className="flex items-center gap-2">
          <Music2 className="h-3 w-3 text-white" />
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/30">
            <div className="h-full w-1/3 rounded-full bg-white" />
          </div>
        </div>
      </div>

      {/* Right side actions */}
      <div className="absolute right-2 bottom-16 flex flex-col items-center gap-4">
        <div className="flex flex-col items-center">
          <div className="border-border flex h-8 w-8 items-center justify-center rounded-full border bg-white/10">
            <Heart className="h-4 w-4 text-white" />
          </div>
          <span className="mt-0.5 text-[10px] text-white">0</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="border-border flex h-8 w-8 items-center justify-center rounded-full border bg-white/10">
            <MessageCircle className="h-4 w-4 text-white" />
          </div>
          <span className="mt-0.5 text-[10px] text-white">0</span>
        </div>
      </div>
    </div>
  )
}

/**
 * YouTube-style preview mockup
 */
function YouTubePreview({
  account,
  media,
  caption,
}: {
  account: MediaPlatformWithValidation
  media: FileUploadState[]
  caption: string
}) {
  const firstMedia = media[0]

  return (
    <div className="border-border bg-bg-elevated overflow-hidden rounded-xl border">
      {/* Video thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden bg-black">
        {firstMedia?.type === 'image' ? (
          <img src={firstMedia.localUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <>
            <video src={firstMedia?.localUrl} className="h-full w-full object-cover" muted />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600">
                <Play className="h-7 w-7 text-white" fill="white" />
              </div>
            </div>
          </>
        )}
        {/* Duration badge */}
        <div className="absolute right-2 bottom-2 rounded bg-black/80 px-1.5 py-0.5 text-[11px] font-medium text-white">
          0:00
        </div>
      </div>

      {/* Video info */}
      <div className="flex gap-3 p-3">
        <AccountAvatar
          src={account.avatarUrl}
          platform="youtube"
          name={account.platformUsername}
          size="sm"
        />
        <div className="min-w-0 flex-1">
          {/* Title (using caption as title) */}
          <h3 className="text-text-primary line-clamp-2 text-sm leading-tight font-medium">
            {caption || 'Untitled video'}
          </h3>
          {/* Channel and stats */}
          <p className="text-text-muted mt-1 text-xs">
            {account.displayName || account.platformUsername}
          </p>
          <p className="text-text-muted text-xs">0 views • Just now</p>
        </div>
      </div>
    </div>
  )
}

/**
 * Pinterest-style preview mockup (pin card)
 */
function PinterestPreview({
  account,
  media,
  caption,
}: {
  account: MediaPlatformWithValidation
  media: FileUploadState[]
  caption: string
}) {
  const firstMedia = media[0]

  return (
    <div className="border-border bg-bg-elevated mx-auto w-full max-w-[220px] overflow-hidden rounded-2xl border">
      {/* Image */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-black">
        {firstMedia?.type === 'image' ? (
          <img src={firstMedia.localUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <>
            <video src={firstMedia?.localUrl} className="h-full w-full object-cover" muted />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/60">
                <Play className="h-5 w-5 text-white" fill="white" />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Pin info */}
      <div className="p-3">
        {caption && <p className="text-text-primary line-clamp-2 text-sm font-medium">{caption}</p>}
        <div className="mt-2 flex items-center gap-2">
          <AccountAvatar
            src={account.avatarUrl}
            platform="pinterest"
            name={account.platformUsername}
            size="xs"
          />
          <span className="text-text-secondary truncate text-xs">
            {account.displayName || account.platformUsername}
          </span>
        </div>
      </div>
    </div>
  )
}
