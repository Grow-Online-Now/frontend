/**
 * PostsPage
 * View and manage all posts with filtering and pagination
 */

import { useNavigate, useParams } from 'react-router-dom'
import { FileText, Plus } from 'lucide-react'
import { PageHeader } from '@/components/dashboard/shared/PageHeader'
import { EmptyState } from '@/components/dashboard/shared/EmptyState'
import { PostsFilters, PostsList, PostsPagination } from '@/components/dashboard/posts'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { usePosts } from '@/hooks/usePosts'
import type { PostResponse } from '@/types/posts'

export default function PostsPage() {
  const navigate = useNavigate()
  const { lang = 'en' } = useParams<{ lang: string }>()
  const { posts, pagination, isLoading, error, filters, updateFilters, setPage, deletePostById } =
    usePosts()

  const handleCreatePost = () => {
    navigate(`/${lang}/dashboard/posts/create`)
  }

  const handleViewPost = (post: PostResponse) => {
    // For now, navigate to edit - can be changed to a view modal later
    console.log('View post:', post.id)
  }

  const handleEditPost = (post: PostResponse) => {
    // Navigate to edit page or open edit modal
    console.log('Edit post:', post.id)
  }

  const handleDeletePost = async (post: PostResponse): Promise<boolean> => {
    return deletePostById(post.id)
  }

  // Check if any filters are active
  const hasActiveFilters =
    filters.status !== undefined ||
    filters.platform !== undefined ||
    filters.is_draft !== undefined ||
    filters.scheduled !== undefined

  if (isLoading && posts.length === 0) {
    return (
      <div>
        <PageHeader
          titleKey="dashboard.posts.title"
          descriptionKey="dashboard.posts.description"
          actions={
            <Button onClick={handleCreatePost} className="gap-2 rounded-full">
              <Plus className="h-4 w-4" />
            </Button>
          }
        />
        <div className="mt-6 space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <PageHeader titleKey="dashboard.posts.title" descriptionKey="dashboard.posts.description" />
        <div className="border-destructive/50 bg-destructive/10 text-destructive dark:border-destructive/30 dark:bg-destructive/20 mt-6 rounded-2xl border p-4 text-sm">
          {error}
        </div>
      </div>
    )
  }

  // Show empty state only when there are no posts and no active filters
  if (posts.length === 0 && !hasActiveFilters && !isLoading) {
    return (
      <div>
        <PageHeader titleKey="dashboard.posts.title" descriptionKey="dashboard.posts.description" />
        <EmptyState
          icon={<FileText className="h-6 w-6" />}
          titleKey="dashboard.posts.empty.title"
          descriptionKey="dashboard.posts.empty.description"
          ctaKey="dashboard.posts.empty.cta"
          onCtaClick={handleCreatePost}
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
          <Button onClick={handleCreatePost} className="gap-2 rounded-full">
            <Plus className="h-4 w-4" />
          </Button>
        }
      />

      {/* Filters */}
      <PostsFilters filters={filters} onFilterChange={updateFilters} className="mt-6 mb-6" />

      {/* Posts List or No Results */}
      {posts.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-6 w-6" />}
          titleKey="dashboard.posts.empty.noResults"
          descriptionKey="dashboard.posts.empty.noResultsDescription"
          ctaKey="dashboard.posts.empty.cta"
          onCtaClick={handleCreatePost}
        />
      ) : (
        <>
          <PostsList
            posts={posts}
            onView={handleViewPost}
            onEdit={handleEditPost}
            onDelete={handleDeletePost}
          />

          {/* Pagination */}
          {pagination && (
            <PostsPagination pagination={pagination} onPageChange={setPage} className="mt-6" />
          )}
        </>
      )}
    </div>
  )
}
