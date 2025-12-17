/**
 * MediaLibraryPage
 * Browse and manage uploaded media with infinite scroll
 */

import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ImageIcon, RefreshCw } from 'lucide-react'
import { PageHeader } from '@/components/dashboard/shared/PageHeader'
import { EmptyState } from '@/components/dashboard/shared/EmptyState'
import { ErrorAlert } from '@/components/dashboard/shared/ErrorAlert'
import {
  MediaTypeTabs,
  MediaGrid,
  MediaGridSkeleton,
  MediaPreviewModal,
} from '@/components/dashboard/media-library'
import { Button } from '@/components/ui/button'
import { useMediaLibrary } from '@/hooks/useMediaLibrary'
import { useLocalizedHref } from '@/hooks/useLocalizedHref'
import type { MediaItem, MediaTypeTab } from '@/types/media'

export default function MediaLibraryPage() {
  const navigate = useNavigate()
  const localizedHref = useLocalizedHref()

  const [activeTab, setActiveTab] = useState<MediaTypeTab>('all')
  const [previewMedia, setPreviewMedia] = useState<MediaItem | null>(null)

  const { media, isLoading, isLoadingMore, error, hasMore, loadMore, deleteMediaById, refetch } =
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
      return await deleteMediaById(item.id)
    },
    [deleteMediaById]
  )

  const handleUseInPost = useCallback(
    (item: MediaItem) => {
      // Navigate to create post page with media pre-selected
      navigate(localizedHref('/dashboard/create/text'), {
        state: { preselectedMedia: item },
      })
    },
    [navigate, localizedHref]
  )

  const handleCreatePost = useCallback(() => {
    navigate(localizedHref('/dashboard/create/text'))
  }, [navigate, localizedHref])

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
        <div className="bg-muted/50 mt-6 inline-flex gap-1 rounded-xl p-1">
          <div className="bg-background h-9 w-16 animate-pulse rounded-lg" />
          <div className="h-9 w-20 animate-pulse rounded-lg" />
          <div className="h-9 w-20 animate-pulse rounded-lg" />
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
        <PageHeader titleKey="dashboard.media.title" descriptionKey="dashboard.media.description" />
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

      {/* Filter Tabs */}
      <MediaTypeTabs activeTab={activeTab} onTabChange={handleTabChange} className="mt-6" />

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
    </div>
  )
}
