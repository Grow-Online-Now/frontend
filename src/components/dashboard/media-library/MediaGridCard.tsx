/**
 * MediaGridCard Component
 * Individual media card with hover actions and optional selection
 */

import { useTranslation } from 'react-i18next'
import { Eye, Trash2, PenSquare, Play, Image as ImageIcon, Film, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { MediaItem } from '@/types/media'

interface MediaGridCardProps {
  media: MediaItem
  onView?: (media: MediaItem) => void
  onDelete?: (media: MediaItem) => void
  onUseInPost?: (media: MediaItem) => void
  selectable?: boolean
  selected?: boolean
  onToggleSelect?: (media: MediaItem) => void
  className?: string
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function MediaGridCard({
  media,
  onView,
  onDelete,
  onUseInPost,
  selectable = false,
  selected = false,
  onToggleSelect,
  className,
}: MediaGridCardProps) {
  const { t } = useTranslation()
  const isVideo = media.mediaType === 'video'

  const handleClick = () => {
    if (selectable && onToggleSelect) {
      onToggleSelect(media)
    }
  }

  return (
    <div
      className={cn(
        'group border-border bg-card relative aspect-square overflow-hidden rounded-xl border transition-all',
        'hover:border-border-emphasis',
        selectable && 'cursor-pointer',
        selected && 'ring-2 ring-error border-error',
        className
      )}
      onClick={handleClick}
    >
      {/* Selection Checkbox */}
      {selectable && (
        <div className="absolute top-2 left-2 z-10">
          <div
            className={cn(
              'flex h-5 w-5 items-center justify-center rounded border transition-all',
              selected
                ? 'bg-error border-error text-white'
                : 'bg-background/80 border-border-emphasis backdrop-blur-sm'
            )}
          >
            {selected && <Check className="h-3.5 w-3.5" />}
          </div>
        </div>
      )}

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
        <div className="bg-muted flex h-full w-full items-center justify-center">
          {isVideo ? (
            <Film className="text-muted-foreground h-8 w-8" />
          ) : (
            <ImageIcon className="text-muted-foreground h-8 w-8" />
          )}
        </div>
      )}

      {/* Video Play Icon Overlay - hidden on hover */}
      {isVideo && media.url && !selectable && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity group-hover:opacity-0">
          <div className="bg-background/80 flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-sm">
            <Play className="text-foreground h-5 w-5 fill-current" />
          </div>
        </div>
      )}

      {/* Bottom Info Bar - hidden on hover when not in select mode */}
      <div className={cn(
        'bg-background/90 absolute right-0 bottom-0 left-0 flex items-center justify-between px-2 py-1.5 backdrop-blur-sm transition-opacity',
        !selectable && 'group-hover:opacity-0'
      )}>
        <span className="text-foreground max-w-[60%] truncate text-xs font-medium">
          {media.fileName}
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground text-xs">{formatFileSize(media.fileSize)}</span>
          <span
            className={cn(
              'rounded px-1.5 py-0.5 text-xs font-medium uppercase',
              isVideo ? 'bg-info/10 text-info' : 'bg-success/10 text-success'
            )}
          >
            {isVideo ? 'video' : 'image'}
          </span>
        </div>
      </div>

      {/* Hover Overlay with Actions - only in normal mode */}
      {!selectable && (
        <div className="absolute inset-0 flex flex-col justify-between bg-black/50 p-2 opacity-0 transition-opacity group-hover:opacity-100">
          {/* Top Actions */}
          <div className="flex justify-end gap-1">
            {onView && (
              <Button
                variant="secondary"
                size="icon"
                className="bg-background/90 hover:bg-background h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation()
                  onView(media)
                }}
              >
                <Eye className="h-4 w-4" />
                <span className="sr-only">{t('dashboard.media.card.view')}</span>
              </Button>
            )}
            {onDelete && (
              <Button
                variant="secondary"
                size="icon"
                className="bg-background/90 text-destructive hover:bg-background hover:text-destructive h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(media)
                }}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">{t('dashboard.media.card.delete')}</span>
              </Button>
            )}
          </div>

          {/* Bottom Action - Use in Post */}
          {onUseInPost && (
            <Button
              variant="secondary"
              size="sm"
              className="bg-background/90 hover:bg-background w-full"
              onClick={(e) => {
                e.stopPropagation()
                onUseInPost(media)
              }}
            >
              <PenSquare className="mr-2 h-4 w-4" />
              {t('dashboard.media.card.useInPost')}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
