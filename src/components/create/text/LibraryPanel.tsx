/**
 * LibraryPanel Component
 * Left column containing recent media and recent drafts
 * Designed to fit within one page without scrolling
 */

import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Play, Image as ImageIcon, Film, FolderOpen, ImagePlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { RecentDraftsPanel } from './RecentDraftsPanel'
import type { MediaItem } from '@/types/media'
import type { PostResponse } from '@/types/posts'

interface LibraryPanelProps {
  recentMedia: MediaItem[]
  recentDrafts: PostResponse[]
  isLoadingMedia?: boolean
  isLoadingDrafts?: boolean
  onAddMedia: (media: MediaItem) => void
  onSelectDraft: (draft: PostResponse) => void
  onOpenMediaLibrary: () => void
  className?: string
}

interface MediaThumbnailProps {
  media: MediaItem
  onClick: () => void
}

function MediaThumbnail({ media, onClick }: MediaThumbnailProps) {
  const isVideo = media.mediaType === 'video'

  const handleDragStart = useCallback(
    (e: React.DragEvent) => {
      e.dataTransfer.setData('application/json', JSON.stringify(media))
      e.dataTransfer.effectAllowed = 'copy'
    },
    [media]
  )

  return (
    <button
      type="button"
      onClick={onClick}
      draggable
      onDragStart={handleDragStart}
      className={cn(
        'group border-border bg-surface-muted relative aspect-square overflow-hidden rounded-lg border',
        'hover:border-border-emphasis hover:bg-surface-hover transition-all',
        'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
        'cursor-grab active:cursor-grabbing'
      )}
    >
      {/* Media Preview */}
      {media.url ? (
        isVideo ? (
          <video src={media.url} className="h-full w-full object-cover" muted preload="metadata" />
        ) : (
          <img
            src={media.url}
            alt={media.fileName}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        )
      ) : (
        <div className="bg-surface-subtle flex h-full w-full items-center justify-center">
          {isVideo ? (
            <Film className="text-muted-foreground h-4 w-4" />
          ) : (
            <ImageIcon className="text-muted-foreground h-4 w-4" />
          )}
        </div>
      )}

      {/* Video Play Icon Overlay */}
      {isVideo && media.url && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm">
            <Play className="h-2.5 w-2.5 fill-current text-white" />
          </div>
        </div>
      )}

      {/* Hover overlay with + icon */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
        <Plus className="h-4 w-4 text-white" />
      </div>
    </button>
  )
}

function MediaThumbnailSkeleton() {
  return <Skeleton className="aspect-square rounded-lg" />
}

export function LibraryPanel({
  recentMedia,
  recentDrafts,
  isLoadingMedia = false,
  isLoadingDrafts = false,
  onAddMedia,
  onSelectDraft,
  onOpenMediaLibrary,
  className,
}: LibraryPanelProps) {
  const { t } = useTranslation()

  // Limit to 6 items (2x3 grid)
  const visibleMedia = recentMedia.slice(0, 6)

  return (
    <div className={cn('border-border/50 flex h-full flex-col rounded-2xl border p-4', className)}>
      {/* Recent Media Section */}
      <div className="shrink-0">
        {/* Media Header */}
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
            {t('dashboard.create.text.mediaPanel.title')}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenMediaLibrary}
            className="text-muted-foreground hover:text-foreground h-6 gap-1 px-2 text-xs"
          >
            <FolderOpen className="h-3 w-3" />
            {t('dashboard.create.text.mediaPanel.browse')}
          </Button>
        </div>

        {/* Media Grid - 2x3 */}
        {isLoadingMedia ? (
          <div className="grid grid-cols-2 gap-1.5">
            {Array.from({ length: 6 }).map((_, i) => (
              <MediaThumbnailSkeleton key={i} />
            ))}
          </div>
        ) : visibleMedia.length === 0 ? (
          <div className="border-border bg-surface-elevated flex flex-col items-center justify-center rounded-lg border border-dashed px-3 py-6">
            <ImagePlus className="text-muted-foreground mb-1.5 h-5 w-5" />
            <p className="text-muted-foreground text-center text-xs">
              {t('dashboard.create.text.mediaPanel.empty')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-1.5">
            {visibleMedia.map((item) => (
              <MediaThumbnail key={item.id} media={item} onClick={() => onAddMedia(item)} />
            ))}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="bg-border my-4 h-px shrink-0" />

      {/* Recent Drafts Section */}
      <div className="min-h-0 flex-1">
        <RecentDraftsPanel
          drafts={recentDrafts}
          isLoading={isLoadingDrafts}
          onSelectDraft={onSelectDraft}
          maxItems={2}
        />
      </div>

      {/* Drag hint */}
      <p className="text-muted-foreground mt-3 shrink-0 text-center text-[10px]">
        {t('dashboard.create.text.mediaPanel.hint')}
      </p>
    </div>
  )
}
