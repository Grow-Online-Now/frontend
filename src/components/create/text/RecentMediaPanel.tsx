/**
 * RecentMediaPanel Component
 * Sidebar showing recent media items for quick addition to posts
 */

import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, ImagePlus, Play, Image as ImageIcon, Film, FolderOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { MediaItem } from '@/types/media'

interface RecentMediaPanelProps {
  media: MediaItem[]
  isLoading?: boolean
  onAddMedia: (media: MediaItem) => void
  onOpenLibrary: () => void
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
        'border-border bg-bg-subtle group relative aspect-square overflow-hidden rounded-lg border',
        'hover:border-border-emphasis hover:bg-bg-hover transition-all',
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
        <div className="bg-bg-subtle flex h-full w-full items-center justify-center">
          {isVideo ? (
            <Film className="text-text-muted h-5 w-5" />
          ) : (
            <ImageIcon className="text-text-muted h-5 w-5" />
          )}
        </div>
      )}

      {/* Video Play Icon Overlay */}
      {isVideo && media.url && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="bg-bg-elevated/80 flex h-6 w-6 items-center justify-center rounded-full backdrop-blur-sm">
            <Play className="text-text-primary h-3 w-3 fill-current" />
          </div>
        </div>
      )}

      {/* Hover overlay with + icon */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
        <Plus className="h-5 w-5 text-white" />
      </div>
    </button>
  )
}

function MediaThumbnailSkeleton() {
  return <Skeleton className="aspect-square rounded-lg" />
}

export function RecentMediaPanel({
  media,
  isLoading = false,
  onAddMedia,
  onOpenLibrary,
  className,
}: RecentMediaPanelProps) {
  const { t } = useTranslation()

  return (
    <div className={cn('flex flex-col', className)}>
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-text-secondary text-sm font-medium">
          {t('dashboard.create.text.mediaPanel.title')}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenLibrary}
          className="text-text-muted hover:text-text-primary h-7 gap-1.5 px-2 text-xs"
        >
          <FolderOpen className="h-3.5 w-3.5" />
          {t('dashboard.create.text.mediaPanel.browse')}
        </Button>
      </div>

      {/* Media Grid */}
      {isLoading ? (
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <MediaThumbnailSkeleton key={i} />
          ))}
        </div>
      ) : media.length === 0 ? (
        <div className="bg-bg-subtle border-border flex flex-col items-center justify-center rounded-xl border border-dashed px-4 py-8">
          <ImagePlus className="text-text-muted mb-2 h-6 w-6" />
          <p className="text-text-muted text-center text-xs">
            {t('dashboard.create.text.mediaPanel.empty')}
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenLibrary}
            className="text-text-secondary hover:text-text-primary mt-2 h-7 text-xs"
          >
            {t('dashboard.create.text.mediaPanel.browseLibrary')}
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-2">
            {media.slice(0, 9).map((item) => (
              <MediaThumbnail key={item.id} media={item} onClick={() => onAddMedia(item)} />
            ))}
          </div>

          {/* Browse all button */}
          <Button variant="outline" size="sm" onClick={onOpenLibrary} className="mt-3 w-full gap-2">
            <Plus className="h-4 w-4" />
            {t('dashboard.create.text.mediaPanel.addFromLibrary')}
          </Button>
        </>
      )}

      {/* Hint */}
      <p className="text-text-muted mt-3 text-center text-xs">
        {t('dashboard.create.text.mediaPanel.hint')}
      </p>
    </div>
  )
}
