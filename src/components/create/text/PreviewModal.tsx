/**
 * PreviewModal Component
 * Bottom sheet modal for mobile platform preview
 * Uses Sheet component with side="bottom" for native mobile feel
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Play } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { PlatformIcon } from '@/components/dashboard/posts/PlatformIcon'
import type { PlatformWithValidation } from '@/types/create'
import type { FileUploadState } from '@/hooks/useMediaUpload'

interface PreviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  content: string
  media: FileUploadState[]
  selectedPlatforms: PlatformWithValidation[]
}

export function PreviewModal({
  open,
  onOpenChange,
  content,
  media,
  selectedPlatforms,
}: PreviewModalProps) {
  const { t } = useTranslation()
  const [activePlatformIndex, setActivePlatformIndex] = useState(0)

  // Get the active platform for preview
  const activePlatform = selectedPlatforms[activePlatformIndex] || selectedPlatforms[0]

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[85vh] rounded-t-2xl px-0">
        <SheetHeader className="px-4 pb-0">
          <div className="bg-muted mx-auto mb-2 h-1 w-12 rounded-full" />
          <SheetTitle className="text-center">
            {t('dashboard.create.text.preview.title')}
          </SheetTitle>
        </SheetHeader>

        {/* Platform tabs */}
        {selectedPlatforms.length > 1 && (
          <div className="border-border border-b px-4 pb-3">
            <div className="scrollbar-none flex gap-2 overflow-x-auto">
              {selectedPlatforms.map((platform, index) => (
                <button
                  key={platform.id}
                  type="button"
                  onClick={() => setActivePlatformIndex(index)}
                  className={cn(
                    'flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
                    index === activePlatformIndex
                      ? 'bg-surface-elevated text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
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
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {selectedPlatforms.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground text-sm">
                {t('dashboard.create.text.preview.noPlatforms')}
              </p>
            </div>
          ) : (
            <div className="mx-auto max-w-[340px]">
              {/* Platform preview card */}
              <div className="border-border bg-surface-elevated overflow-hidden rounded-xl border">
                {/* Platform header */}
                <div className="border-border flex items-center gap-3 border-b p-4">
                  <PlatformIcon platform={activePlatform.platform} size="md" showBackground />
                  <div className="min-w-0 flex-1">
                    <div className="text-foreground truncate text-sm font-medium">
                      {activePlatform.displayName || activePlatform.platformUsername}
                    </div>
                    <div className="text-muted-foreground truncate text-xs">
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
                <div className="p-4">
                  {content.trim() ? (
                    <p className="text-foreground text-sm leading-relaxed whitespace-pre-wrap">
                      {truncateContent(content, activePlatform.platform)}
                    </p>
                  ) : (
                    <p className="text-muted-foreground text-sm italic">
                      {t('dashboard.create.text.preview.noContent')}
                    </p>
                  )}
                </div>

                {/* Character count footer */}
                <div className="border-border border-t px-4 py-3">
                  <div
                    className={cn(
                      'font-mono text-xs',
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
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
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

/**
 * Truncate content based on platform for preview
 */
function truncateContent(content: string, platform: string): string {
  const limits: Record<string, number> = {
    twitter: 280,
    linkedin: 200,
    facebook: 200,
  }
  const limit = limits[platform] || 150

  if (content.length <= limit) return content
  return content.slice(0, limit) + '...'
}
