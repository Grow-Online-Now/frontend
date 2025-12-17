/**
 * CompactLibrarySection Component
 * Compact version of media and drafts for the right sidebar
 * Shows recent media as a 1x4 horizontal row and a single draft card
 */

import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Play, FolderOpen, Clock, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import type { MediaItem } from '@/types/media'
import type { PostResponse } from '@/types/posts'

interface CompactLibrarySectionProps {
  recentMedia: MediaItem[]
  recentDrafts: PostResponse[]
  isLoadingMedia?: boolean
  isLoadingDrafts?: boolean
  onAddMedia: (media: MediaItem) => void
  onSelectDraft: (draft: PostResponse) => void
  onOpenMediaLibrary: () => void
  className?: string
}

interface CompactMediaThumbnailProps {
  media: MediaItem
  onClick: () => void
}

function CompactMediaThumbnail({ media, onClick }: CompactMediaThumbnailProps) {
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
        'group relative h-12 w-12 shrink-0 overflow-hidden rounded-lg',
        'border-border bg-surface-muted border',
        'hover:border-border-emphasis transition-all',
        'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none',
        'cursor-grab active:cursor-grabbing'
      )}
    >
      {media.url ? (
        isVideo ? (
          <video src={media.url} className="h-full w-full object-cover" muted preload="metadata" />
        ) : (
          <img src={media.url} alt="" className="h-full w-full object-cover" loading="lazy" />
        )
      ) : (
        <div className="bg-surface-subtle flex h-full w-full items-center justify-center">
          <div className="bg-muted-foreground/20 h-2 w-2 rounded-full" />
        </div>
      )}

      {/* Video indicator */}
      {isVideo && media.url && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-black/60">
            <Play className="h-2 w-2 fill-current text-white" />
          </div>
        </div>
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
        <Plus className="h-3 w-3 text-white" />
      </div>
    </button>
  )
}

interface CompactDraftCardProps {
  draft: PostResponse
  onClick: () => void
}

function CompactDraftCard({ draft, onClick }: CompactDraftCardProps) {
  const previewText = draft.caption.split('\n')[0].slice(0, 40) || 'Empty draft'
  const isLong = draft.caption.length > 40
  const timeAgo = formatDistanceToNow(new Date(draft.updated_at), { addSuffix: true })

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'border-border bg-surface-subtle w-full rounded-lg border px-3 py-2 text-left',
        'hover:border-border-emphasis hover:bg-surface-hover transition-all',
        'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none'
      )}
    >
      <p className="text-foreground truncate text-xs">
        {previewText}
        {isLong && '...'}
      </p>
      <div className="text-muted-foreground mt-1 flex items-center gap-1 text-[10px]">
        <Clock className="h-2.5 w-2.5" />
        <span>{timeAgo}</span>
      </div>
    </button>
  )
}

export function CompactLibrarySection({
  recentMedia,
  recentDrafts,
  isLoadingMedia = false,
  isLoadingDrafts = false,
  onAddMedia,
  onSelectDraft,
  onOpenMediaLibrary,
  className,
}: CompactLibrarySectionProps) {
  const { t } = useTranslation()

  // Show max 4 media items in horizontal row
  const visibleMedia = recentMedia.slice(0, 4)
  // Show only 1 draft
  const visibleDraft = recentDrafts[0]

  return (
    <div className={cn('space-y-4', className)}>
      {/* Recent Media Section */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h4 className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">
            {t('dashboard.create.text.mediaPanel.title')}
          </h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenMediaLibrary}
            className="text-muted-foreground hover:text-foreground h-5 gap-1 px-1.5 text-[10px]"
          >
            <FolderOpen className="h-2.5 w-2.5" />
            {t('dashboard.create.text.mediaPanel.browse')}
          </Button>
        </div>

        {isLoadingMedia ? (
          <div className="flex gap-1.5">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-12 shrink-0 rounded-lg" />
            ))}
          </div>
        ) : visibleMedia.length === 0 ? (
          <div className="border-border bg-surface-subtle flex items-center justify-center rounded-lg border border-dashed px-3 py-3">
            <p className="text-muted-foreground text-[10px]">
              {t('dashboard.create.text.mediaPanel.empty')}
            </p>
          </div>
        ) : (
          <div className="flex gap-1.5">
            {visibleMedia.map((item) => (
              <CompactMediaThumbnail key={item.id} media={item} onClick={() => onAddMedia(item)} />
            ))}
          </div>
        )}
      </div>

      {/* Recent Drafts Section */}
      <div>
        <h4 className="text-muted-foreground mb-2 text-[10px] font-medium tracking-wider uppercase">
          {t('dashboard.create.text.draftsPanel.title')}
        </h4>

        {isLoadingDrafts ? (
          <Skeleton className="h-12 w-full rounded-lg" />
        ) : !visibleDraft ? (
          <div className="border-border bg-surface-subtle flex items-center justify-center gap-1.5 rounded-lg border border-dashed px-3 py-3">
            <FileText className="text-muted-foreground h-3 w-3" />
            <p className="text-muted-foreground text-[10px]">
              {t('dashboard.create.text.draftsPanel.empty')}
            </p>
          </div>
        ) : (
          <CompactDraftCard draft={visibleDraft} onClick={() => onSelectDraft(visibleDraft)} />
        )}
      </div>
    </div>
  )
}
