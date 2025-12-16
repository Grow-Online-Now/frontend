/**
 * MediaLibraryModal Component
 * Modal for browsing and multi-selecting media from library
 */

import { useState, useCallback, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Check, Play, Image as ImageIcon, Film, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { useMediaLibrary } from '@/hooks/useMediaLibrary'
import type { MediaItem, MediaTypeTab, MediaType } from '@/types/media'

interface MediaLibraryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (media: MediaItem[]) => void
  excludeIds?: string[]
}

interface SelectableMediaCardProps {
  media: MediaItem
  isSelected: boolean
  onToggle: () => void
}

const TABS: { value: MediaTypeTab; labelKey: string }[] = [
  { value: 'all', labelKey: 'dashboard.media.filters.all' },
  { value: 'image', labelKey: 'dashboard.media.filters.images' },
  { value: 'video', labelKey: 'dashboard.media.filters.videos' },
]

function SelectableMediaCard({ media, isSelected, onToggle }: SelectableMediaCardProps) {
  const isVideo = media.mediaType === 'video'

  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        'group relative aspect-square overflow-hidden rounded-xl border transition-all',
        isSelected
          ? 'border-primary ring-primary/20 ring-2'
          : 'border-border hover:border-border-emphasis'
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
            <Film className="text-text-muted h-8 w-8" />
          ) : (
            <ImageIcon className="text-text-muted h-8 w-8" />
          )}
        </div>
      )}

      {/* Video Play Icon */}
      {isVideo && media.url && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="bg-bg-elevated/80 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-sm">
            <Play className="text-text-primary h-4 w-4 fill-current" />
          </div>
        </div>
      )}

      {/* Selection Indicator */}
      <div
        className={cn(
          'absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all',
          isSelected
            ? 'border-primary bg-primary'
            : 'border-border bg-bg-elevated/80 opacity-0 group-hover:opacity-100'
        )}
      >
        {isSelected && <Check className="h-4 w-4 text-white" />}
      </div>

      {/* Hover overlay */}
      {!isSelected && (
        <div className="absolute inset-0 bg-black/0 transition-all group-hover:bg-black/20" />
      )}
    </button>
  )
}

function MediaCardSkeleton() {
  return <Skeleton className="aspect-square rounded-xl" />
}

export function MediaLibraryModal({
  open,
  onOpenChange,
  onSelect,
  excludeIds = [],
}: MediaLibraryModalProps) {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<MediaTypeTab>('all')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const sentinelRef = useRef<HTMLDivElement>(null)

  // Get media type filter from tab
  const typeFilter: MediaType | undefined = activeTab === 'all' ? undefined : activeTab

  const { media, isLoading, isLoadingMore, hasMore, loadMore } = useMediaLibrary({
    type: typeFilter,
    limit: 24,
  })

  // Filter out already added media
  const availableMedia = media.filter((m) => !excludeIds.includes(m.id))

  // Reset selection when modal opens
  useEffect(() => {
    if (open) {
      setSelectedIds(new Set())
    }
  }, [open])

  // Infinite scroll with intersection observer
  useEffect(() => {
    if (!sentinelRef.current || !hasMore || isLoadingMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore()
        }
      },
      { rootMargin: '100px', threshold: 0.1 }
    )

    observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [hasMore, isLoadingMore, loadMore])

  const handleToggle = useCallback((mediaId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(mediaId)) {
        next.delete(mediaId)
      } else {
        next.add(mediaId)
      }
      return next
    })
  }, [])

  const handleConfirm = useCallback(() => {
    const selectedMedia = availableMedia.filter((m) => selectedIds.has(m.id))
    onSelect(selectedMedia)
    onOpenChange(false)
  }, [availableMedia, selectedIds, onSelect, onOpenChange])

  const handleTabChange = useCallback((tab: MediaTypeTab) => {
    setActiveTab(tab)
    setSelectedIds(new Set())
  }, [])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] max-w-3xl flex-col gap-0 p-0">
        {/* Header */}
        <DialogHeader className="border-border flex-shrink-0 border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <DialogTitle>{t('dashboard.create.text.mediaLibrary.title')}</DialogTitle>
            {selectedIds.size > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedIds(new Set())}
                className="text-text-muted hover:text-text-primary h-8 gap-1.5 text-xs"
              >
                <X className="h-3.5 w-3.5" />
                {t('dashboard.create.text.mediaLibrary.clearSelection')}
              </Button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="mt-4">
            <div className="bg-bg-subtle inline-flex gap-1 rounded-xl p-1">
              {TABS.map((tab) => {
                const isActive = activeTab === tab.value

                return (
                  <button
                    key={tab.value}
                    onClick={() => handleTabChange(tab.value)}
                    className={cn(
                      'rounded-lg px-4 py-2 text-sm font-medium transition-all',
                      'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                      isActive
                        ? 'bg-bg-elevated text-text-primary shadow-sm'
                        : 'text-text-muted hover:text-text-secondary hover:bg-bg-hover'
                    )}
                  >
                    {t(tab.labelKey)}
                  </button>
                )
              })}
            </div>
          </div>
        </DialogHeader>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {isLoading ? (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <MediaCardSkeleton key={i} />
              ))}
            </div>
          ) : availableMedia.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <ImageIcon className="text-text-muted mb-3 h-10 w-10" />
              <p className="text-text-secondary text-sm">
                {t('dashboard.create.text.mediaLibrary.empty')}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {availableMedia.map((item) => (
                  <SelectableMediaCard
                    key={item.id}
                    media={item}
                    isSelected={selectedIds.has(item.id)}
                    onToggle={() => handleToggle(item.id)}
                  />
                ))}
              </div>

              {/* Infinite scroll sentinel */}
              {hasMore && (
                <div ref={sentinelRef} className="mt-4 flex justify-center py-4">
                  {isLoadingMore && (
                    <div className="grid w-full grid-cols-3 gap-3 sm:grid-cols-4">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <MediaCardSkeleton key={i} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="border-border flex-shrink-0 border-t px-6 py-4">
          <div className="flex w-full items-center justify-between">
            <span className="text-text-muted text-sm">
              {selectedIds.size > 0
                ? t('dashboard.create.text.mediaLibrary.selectedCount', {
                    count: selectedIds.size,
                  })
                : t('dashboard.create.text.mediaLibrary.selectHint')}
            </span>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                {t('common.actions.cancel')}
              </Button>
              <Button onClick={handleConfirm} disabled={selectedIds.size === 0}>
                {t('dashboard.create.text.mediaLibrary.addSelected', { count: selectedIds.size })}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
