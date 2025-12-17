/**
 * Step1PreviewPanel Component
 * Desktop-only sticky preview panel for Step 1 of the text-first flow
 * Shows live preview with platform tabs for switching between selected platforms
 */

import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Play } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PlatformIcon } from '@/components/dashboard/posts/PlatformIcon'
import { AccountAvatar } from '@/components/common/AccountAvatar'
import { TwitterPreview } from '@/components/dashboard/create-post/TwitterPreview'
import { LinkedInPreview } from '@/components/dashboard/create-post/LinkedInPreview'
import { FacebookPreview } from '@/components/dashboard/create-post/FacebookPreview'
import type { PlatformWithValidation } from '@/types/create'
import type { FileUploadState } from '@/hooks/useMediaUpload'
import type { MediaFile } from '@/components/dashboard/create-post/MediaUploader'

interface Step1PreviewPanelProps {
  content: string
  media: FileUploadState[]
  selectedPlatforms: PlatformWithValidation[]
  className?: string
}

export function Step1PreviewPanel({
  content,
  media,
  selectedPlatforms,
  className,
}: Step1PreviewPanelProps) {
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

  // Convert FileUploadState to MediaFile for TwitterPreview
  const mediaFiles: MediaFile[] = useMemo(
    () =>
      media.map((m) => ({
        id: m.id,
        file: m.file,
        url: m.localUrl,
        type: m.type,
      })),
    [media]
  )

  // Check if active platform is Twitter, LinkedIn, or Facebook
  const isTwitter = activePlatform?.platform === 'twitter'
  const isLinkedIn = activePlatform?.platform === 'linkedin'
  const isFacebook = activePlatform?.platform === 'facebook'

  return (
    <div
      className={cn(
        'border-border bg-surface-muted sticky top-8 flex h-fit w-full flex-col rounded-2xl border',
        className
      )}
    >
      {/* Header with title */}
      <div className="border-border border-b px-5 py-4">
        <div className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
          {t('dashboard.create.text.preview.title')}
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
                    ? 'bg-surface-elevated text-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-surface-hover'
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
            <p className="text-muted-foreground text-center text-sm">
              {t('dashboard.create.text.preview.noPlatforms')}
            </p>
          </div>
        ) : activePlatform ? (
          <>
            {/* Twitter uses its own themed preview */}
            {isTwitter ? (
              <TwitterPreview
                account={{
                  id: activePlatform.id,
                  platform: 'twitter',
                  displayName: activePlatform.displayName,
                  platformUserId: activePlatform.id,
                  platformUsername: activePlatform.platformUsername,
                  avatarUrl: activePlatform.avatarUrl,
                  isActive: true,
                  expiresAt: null,
                  isExpired: false,
                  needsRefresh: false,
                  createdAt: new Date().toISOString(),
                }}
                media={mediaFiles}
                caption={content}
              />
            ) : isLinkedIn ? (
              <LinkedInPreview
                account={{
                  id: activePlatform.id,
                  platform: 'linkedin',
                  displayName: activePlatform.displayName,
                  platformUserId: activePlatform.id,
                  platformUsername: activePlatform.platformUsername,
                  avatarUrl: activePlatform.avatarUrl,
                  isActive: true,
                  expiresAt: null,
                  isExpired: false,
                  needsRefresh: false,
                  createdAt: new Date().toISOString(),
                }}
                media={mediaFiles}
                caption={content}
              />
            ) : isFacebook ? (
              <FacebookPreview
                account={{
                  id: activePlatform.id,
                  platform: 'facebook',
                  displayName: activePlatform.displayName,
                  platformUserId: activePlatform.id,
                  platformUsername: activePlatform.platformUsername,
                  avatarUrl: activePlatform.avatarUrl,
                  isActive: true,
                  expiresAt: null,
                  isExpired: false,
                  needsRefresh: false,
                  createdAt: new Date().toISOString(),
                }}
                media={mediaFiles}
                caption={content}
              />
            ) : (
              // Generic platform preview card
              <div className="border-border bg-surface-elevated overflow-hidden rounded-xl border">
                {/* Platform header */}
                <div className="border-border flex items-center gap-3 border-b p-3">
                  <AccountAvatar
                    src={activePlatform.avatarUrl}
                    platform={activePlatform.platform}
                    name={activePlatform.displayName || activePlatform.platformUsername}
                    size="sm"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-foreground truncate text-sm font-medium">
                      {activePlatform.displayName || activePlatform.platformUsername}
                    </div>
                    <div className="text-muted-foreground truncate text-[11px]">
                      @{activePlatform.platformUsername}
                    </div>
                  </div>
                </div>

                {/* Media preview */}
                {media.length > 0 && (
                  <div className="border-border border-b">
                    <MediaPreviewThumbnails media={media} />
                  </div>
                )}

                {/* Content preview */}
                <div className="p-3">
                  {content.trim() ? (
                    <p className="text-foreground line-clamp-6 text-sm leading-relaxed whitespace-pre-wrap">
                      {content}
                    </p>
                  ) : (
                    <p className="text-muted-foreground text-sm italic">
                      {t('dashboard.create.text.preview.noContent')}
                    </p>
                  )}
                </div>

                {/* Character count footer */}
                <div className="border-border border-t px-3 py-2">
                  <div
                    className={cn(
                      'font-mono text-[11px]',
                      activePlatform.isOverLimit && 'text-error',
                      activePlatform.isNearLimit && !activePlatform.isOverLimit && 'text-warning',
                      !activePlatform.isOverLimit &&
                        !activePlatform.isNearLimit &&
                        'text-muted-foreground'
                    )}
                  >
                    {activePlatform.characterCount}/{activePlatform.characterLimit}{' '}
                    {t('dashboard.create.text.preview.characters')}
                  </div>
                </div>
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  )
}

/**
 * Simple read-only media thumbnails for preview
 */
function MediaPreviewThumbnails({ media }: { media: FileUploadState[] }) {
  if (media.length === 0) return null

  // Single media = aspect-video, multiple = grid
  if (media.length === 1) {
    const item = media[0]
    return (
      <div className="relative aspect-video w-full overflow-hidden">
        {item.type === 'image' ? (
          <img src={item.localUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <>
            <video src={item.localUrl} className="h-full w-full object-cover" muted />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60">
                <Play className="h-4 w-4 text-white" />
              </div>
            </div>
          </>
        )}
      </div>
    )
  }

  // Multiple media = 2-column grid (max 4 visible)
  const visible = media.slice(0, 4)
  const extra = media.length - 4

  return (
    <div className="grid grid-cols-2 gap-0.5">
      {visible.map((item, idx) => (
        <div key={item.id} className="relative aspect-square overflow-hidden">
          {item.type === 'image' ? (
            <img src={item.localUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <>
              <video src={item.localUrl} className="h-full w-full object-cover" muted />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-black/60">
                  <Play className="h-3 w-3 text-white" />
                </div>
              </div>
            </>
          )}
          {idx === 3 && extra > 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <span className="font-semibold text-white">+{extra}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
