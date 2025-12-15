/**
 * PostsPage
 * View and manage all posts with tab-based filtering and grid layout
 */

import { useState, useCallback } from 'react'
import { FileText, RefreshCw } from 'lucide-react'
import { PageHeader } from '@/components/dashboard/shared/PageHeader'
import { EmptyState } from '@/components/dashboard/shared/EmptyState'
import { ErrorAlert } from '@/components/dashboard/shared/ErrorAlert'
import {
  PostsStatusTabs,
  PostsGrid,
  PostsPagination,
  PlatformFilterDropdown,
} from '@/components/dashboard/posts'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { usePosts, getFiltersForTab } from '@/hooks/usePosts'
import { usePostsCounts } from '@/hooks/usePostsCounts'
import type { PostResponse, PostStatusTab } from '@/types/posts'
import type { SocialPlatform } from '@/types/connections'

export default function PostsPage() {
  const [activeTab, setActiveTab] = useState<PostStatusTab>('all')
  const [platformFilter, setPlatformFilter] = useState<SocialPlatform | undefined>(undefined)

  const {
    posts,
    pagination,
    isLoading,
    error,
    updateFilters,
    setPage,
    deletePostById,
    refetch: refetchPosts,
  } = usePosts()

  const { counts, isLoading: isLoadingCounts, refetch: refetchCounts } = usePostsCounts()

  const handleTabChange = useCallback(
    (tab: PostStatusTab) => {
      setActiveTab(tab)
      const tabFilters = getFiltersForTab(tab)
      updateFilters({
        ...tabFilters,
        platform: platformFilter,
      })
    },
    [updateFilters, platformFilter]
  )

  const handlePlatformChange = useCallback(
    (platform: SocialPlatform | undefined) => {
      setPlatformFilter(platform)
      const tabFilters = getFiltersForTab(activeTab)
      updateFilters({
        ...tabFilters,
        platform,
      })
    },
    [updateFilters, activeTab]
  )

  const handleRefresh = useCallback(async () => {
    await Promise.all([refetchPosts(), refetchCounts()])
  }, [refetchPosts, refetchCounts])

  const handleViewPost = (post: PostResponse) => {
    console.log('View post:', post.id)
  }

  const handleEditPost = (post: PostResponse) => {
    console.log('Edit post:', post.id)
  }

  const handleDeletePost = async (post: PostResponse): Promise<boolean> => {
    const success = await deletePostById(post.id)
    if (success) {
      // Refetch counts after successful deletion
      refetchCounts()
    }
    return success
  }

  const handlePublishNow = (post: PostResponse) => {
    // TODO: Implement publish now functionality
    console.log('Publish now:', post.id)
  }

  // Loading skeleton
  if (isLoading && posts.length === 0) {
    return (
      <div>
        <PageHeader
          titleKey="dashboard.posts.title"
          descriptionKey="dashboard.posts.description"
          actions={
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <Skeleton className="h-9 w-24 rounded-lg" />
            </div>
          }
        />
        <Skeleton className="mt-6 h-12 w-full rounded-xl" />
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Skeleton key={i} className="h-56 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div>
        <PageHeader titleKey="dashboard.posts.title" descriptionKey="dashboard.posts.description" />
        <ErrorAlert message={error} className="mt-6" />
      </div>
    )
  }

  // Check if any filters are active (tab or platform)
  const hasActiveFilters = activeTab !== 'all' || platformFilter !== undefined

  // Show empty state only when there are no posts at all
  if (posts.length === 0 && !hasActiveFilters && !isLoading) {
    return (
      <div>
        <PageHeader titleKey="dashboard.posts.title" descriptionKey="dashboard.posts.description" />
        <EmptyState
          icon={<FileText className="h-6 w-6" />}
          titleKey="dashboard.posts.empty.title"
          descriptionKey="dashboard.posts.empty.description"
          className="mt-6"
        />
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        titleKey="dashboard.posts.title"
        descriptionKey="dashboard.posts.description"
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
            <PlatformFilterDropdown
              selectedPlatform={platformFilter}
              onPlatformChange={handlePlatformChange}
            />
          </div>
        }
      />

      {/* Status Tabs */}
      <PostsStatusTabs
        activeTab={activeTab}
        counts={counts}
        onTabChange={handleTabChange}
        isLoading={isLoadingCounts}
        className="mt-6"
      />

      {/* Posts Grid or No Results */}
      {posts.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-6 w-6" />}
          titleKey="dashboard.posts.empty.noResults"
          descriptionKey="dashboard.posts.empty.noResultsDescription"
          className="mt-6"
        />
      ) : (
        <>
          <PostsGrid
            posts={posts}
            onView={handleViewPost}
            onEdit={handleEditPost}
            onDelete={handleDeletePost}
            onPublishNow={handlePublishNow}
            className="mt-6"
          />

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <PostsPagination pagination={pagination} onPageChange={setPage} className="mt-6" />
          )}
        </>
      )}
    </div>
  )
}
