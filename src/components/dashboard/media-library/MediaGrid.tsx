/**
 * MediaGrid Component
 * Grid layout with infinite scroll and delete confirmation
 */

import { useState, useRef, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { MediaGridCard } from './MediaGridCard'
import { cn } from '@/lib/utils'
import type { MediaItem } from '@/types/media'

interface MediaGridProps {
  media: MediaItem[]
  onView?: (media: MediaItem) => void
  onDelete?: (media: MediaItem) => Promise<boolean>
  onUseInPost?: (media: MediaItem) => void
  hasMore: boolean
  loadMore: () => void
  isLoadingMore: boolean
  className?: string
}

export function MediaGrid({
  media,
  onView,
  onDelete,
  onUseInPost,
  hasMore,
  loadMore,
  isLoadingMore,
  className,
}: MediaGridProps) {
  const { t } = useTranslation()
  const [mediaToDelete, setMediaToDelete] = useState<MediaItem | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  // Infinite scroll with Intersection Observer
  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries
      if (entry.isIntersecting && hasMore && !isLoadingMore) {
        loadMore()
      }
    },
    [hasMore, isLoadingMore, loadMore]
  )

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
      rootMargin: '100px',
    })

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [handleIntersection])

  const handleDeleteClick = (media: MediaItem) => {
    setMediaToDelete(media)
  }

  const handleDeleteConfirm = async () => {
    if (!mediaToDelete || !onDelete) return

    setIsDeleting(true)
    try {
      await onDelete(mediaToDelete)
    } finally {
      setIsDeleting(false)
      setMediaToDelete(null)
    }
  }

  const handleDeleteCancel = () => {
    setMediaToDelete(null)
  }

  return (
    <>
      <div
        className={cn(
          'grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6',
          className
        )}
      >
        {media.map((item) => (
          <MediaGridCard
            key={item.id}
            media={item}
            onView={onView}
            onDelete={onDelete ? handleDeleteClick : undefined}
            onUseInPost={onUseInPost}
          />
        ))}
      </div>

      {/* Infinite Scroll Sentinel */}
      {hasMore && (
        <div ref={sentinelRef} className="flex items-center justify-center py-8">
          {isLoadingMore && (
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              {t('dashboard.media.loading.more')}
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!mediaToDelete} onOpenChange={(open) => !open && handleDeleteCancel()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('dashboard.media.delete.title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('dashboard.media.delete.description')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              {t('dashboard.media.delete.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? t('dashboard.common.loading') : t('dashboard.media.delete.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
