/**
 * MediaLibraryPage
 * Browse and manage uploaded media with infinite scroll and bulk delete
 */

import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ImageIcon, RefreshCw, Trash2, CheckSquare, X } from 'lucide-react'
import { PageHeader } from '@/components/dashboard/shared/PageHeader'
import { EmptyState } from '@/components/dashboard/shared/EmptyState'
import { ErrorAlert } from '@/components/dashboard/shared/ErrorAlert'
import {
  MediaTypeTabs,
  MediaGrid,
  MediaGridSkeleton,
  MediaPreviewModal,
  StorageBanner,
} from '@/components/dashboard/media-library'
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
import { Button } from '@/components/ui/button'
import { useMediaLibrary } from '@/hooks/useMediaLibrary'
import { useLocalizedHref } from '@/hooks/useLocalizedHref'
import type { MediaItem, MediaTypeTab } from '@/types/media'

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const k = 1024
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  const value = bytes / Math.pow(k, i)
  return `${value < 10 ? value.toFixed(1) : Math.round(value)} ${units[i]}`
}

export default function MediaLibraryPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const localizedHref = useLocalizedHref()

  const [activeTab, setActiveTab] = useState<MediaTypeTab>('all')
  const [previewMedia, setPreviewMedia] = useState<MediaItem | null>(null)
  const [storageRefreshKey, setStorageRefreshKey] = useState(0)

  // Selection mode
  const [selectMode, setSelectMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [showBatchDeleteDialog, setShowBatchDeleteDialog] = useState(false)
  const [isBatchDeleting, setIsBatchDeleting] = useState(false)

  const { media, isLoading, isLoadingMore, error, hasMore, loadMore, deleteMediaById, deleteMediaByIds, refetch } =
    useMediaLibrary({
      type: activeTab === 'all' ? undefined : activeTab,
    })

  const handleTabChange = useCallback((tab: MediaTypeTab) => {
    setActiveTab(tab)
  }, [])

  const handleRefresh = useCallback(async () => {
    await refetch()
  }, [refetch])

  const handleView = useCallback((item: MediaItem) => {
    setPreviewMedia(item)
  }, [])

  const handleDelete = useCallback(
    async (item: MediaItem): Promise<boolean> => {
      const deleted = await deleteMediaById(item.id)
      if (deleted) setStorageRefreshKey((k) => k + 1)
      return deleted
    },
    [deleteMediaById]
  )

  const handleUseInPost = useCallback(
    (item: MediaItem) => {
      navigate(localizedHref('/dashboard/create/text'), {
        state: { preselectedMedia: item },
      })
    },
    [navigate, localizedHref]
  )

  const handleCreatePost = useCallback(() => {
    navigate(localizedHref('/dashboard/create/text'))
  }, [navigate, localizedHref])

  // Selection handlers
  const handleToggleSelectMode = useCallback(() => {
    setSelectMode((prev) => {
      if (prev) setSelectedIds(new Set())
      return !prev
    })
  }, [])

  const handleToggleSelect = useCallback((item: MediaItem) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(item.id)) {
        next.delete(item.id)
      } else {
        next.add(item.id)
      }
      return next
    })
  }, [])

  const handleSelectAll = useCallback(() => {
    if (selectedIds.size === media.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(media.map((m) => m.id)))
    }
  }, [media, selectedIds.size])

  const handleBatchDelete = useCallback(async () => {
    if (selectedIds.size === 0) return
    setIsBatchDeleting(true)
    try {
      const deleted = await deleteMediaByIds(Array.from(selectedIds))
      if (deleted > 0) {
        setStorageRefreshKey((k) => k + 1)
        setSelectedIds(new Set())
        setSelectMode(false)
      }
    } finally {
      setIsBatchDeleting(false)
      setShowBatchDeleteDialog(false)
    }
  }, [selectedIds, deleteMediaByIds])

  const selectedSize = media
    .filter((m) => selectedIds.has(m.id))
    .reduce((sum, m) => sum + m.fileSize, 0)

  // Initial loading state
  if (isLoading && media.length === 0) {
    return (
      <div>
        <PageHeader
          titleKey="dashboard.media.title"
          descriptionKey="dashboard.media.description"
          actions={
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" disabled className="size-9">
                <RefreshCw className="size-4" />
              </Button>
            </div>
          }
        />
        {/* Tab skeleton - matches MediaTypeTabs structure exactly */}
        <div className="bg-muted/50 mt-6 inline-flex gap-1 rounded-xl p-1">
          <div className="bg-background h-9 w-[52px] animate-pulse rounded-lg" />
          <div className="h-9 w-[72px] animate-pulse rounded-lg" />
          <div className="h-9 w-[72px] animate-pulse rounded-lg" />
        </div>
        <MediaGridSkeleton className="mt-6" />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div>
        <PageHeader titleKey="dashboard.media.title" descriptionKey="dashboard.media.description" />
        <ErrorAlert message={error} className="mt-6" />
      </div>
    )
  }

  // Empty state - no media at all
  if (media.length === 0 && activeTab === 'all' && !isLoading) {
    return (
      <div>
        <PageHeader
          titleKey="dashboard.media.title"
          descriptionKey="dashboard.media.description"
          actions={
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleRefresh}
                disabled={isLoading}
                className="size-9"
              >
                <RefreshCw className="size-4" />
              </Button>
            </div>
          }
        />
        {/* Storage Usage */}
        <StorageBanner className="mt-6" refreshKey={storageRefreshKey} />
        {/* Keep tabs visible for consistent layout */}
        <MediaTypeTabs activeTab={activeTab} onTabChange={handleTabChange} className="mt-4" />
        <EmptyState
          icon={<ImageIcon className="h-6 w-6" />}
          titleKey="dashboard.media.empty.title"
          descriptionKey="dashboard.media.empty.description"
          ctaKey="dashboard.media.empty.cta"
          onCtaClick={handleCreatePost}
          className="mt-6"
        />
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        titleKey="dashboard.media.title"
        descriptionKey="dashboard.media.description"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant={selectMode ? 'default' : 'outline'}
              size="sm"
              onClick={handleToggleSelectMode}
              className="gap-1.5"
            >
              {selectMode ? (
                <>
                  <X className="h-4 w-4" />
                  {t('dashboard.media.select.cancel')}
                </>
              ) : (
                <>
                  <CheckSquare className="h-4 w-4" />
                  {t('dashboard.media.select.toggle')}
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              disabled={isLoading}
              className="size-9"
            >
              <RefreshCw className={`size-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        }
      />

      {/* Storage Usage */}
      <StorageBanner className="mt-6" refreshKey={storageRefreshKey} />

      {/* Selection Action Bar */}
      {selectMode && (
        <div className="bg-bg-elevated border-border-default mt-4 flex items-center justify-between rounded-xl border px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSelectAll}
              className="text-text-secondary"
            >
              {selectedIds.size === media.length
                ? t('dashboard.media.select.deselectAll')
                : t('dashboard.media.select.selectAll')}
            </Button>
            {selectedIds.size > 0 && (
              <span className="text-text-secondary text-sm">
                {t('dashboard.media.select.selected', { count: selectedIds.size })} &middot; {formatFileSize(selectedSize)}
              </span>
            )}
          </div>
          <Button
            variant="destructive"
            size="sm"
            disabled={selectedIds.size === 0}
            onClick={() => setShowBatchDeleteDialog(true)}
            className="gap-1.5"
          >
            <Trash2 className="h-4 w-4" />
            {t('dashboard.media.select.deleteSelected')}
          </Button>
        </div>
      )}

      {/* Filter Tabs */}
      <MediaTypeTabs activeTab={activeTab} onTabChange={handleTabChange} className="mt-4" />

      {/* Media Grid or No Results */}
      {media.length === 0 ? (
        <EmptyState
          icon={<ImageIcon className="h-6 w-6" />}
          titleKey="dashboard.media.noResults.title"
          descriptionKey="dashboard.media.noResults.description"
          className="mt-6"
        />
      ) : (
        <MediaGrid
          media={media}
          onView={handleView}
          onDelete={handleDelete}
          onUseInPost={handleUseInPost}
          hasMore={hasMore}
          loadMore={loadMore}
          isLoadingMore={isLoadingMore}
          selectable={selectMode}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          className="mt-6"
        />
      )}

      {/* Preview Modal */}
      <MediaPreviewModal
        media={previewMedia}
        open={!!previewMedia}
        onOpenChange={(open) => !open && setPreviewMedia(null)}
        onDelete={handleDelete}
        onUseInPost={handleUseInPost}
      />

      {/* Batch Delete Confirmation */}
      <AlertDialog open={showBatchDeleteDialog} onOpenChange={setShowBatchDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t('dashboard.media.batchDelete.title')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t('dashboard.media.batchDelete.description', {
                count: selectedIds.size,
                size: formatFileSize(selectedSize),
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isBatchDeleting}>
              {t('dashboard.media.delete.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBatchDelete}
              disabled={isBatchDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isBatchDeleting
                ? t('dashboard.common.loading')
                : t('dashboard.media.batchDelete.confirm', { count: selectedIds.size })}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
