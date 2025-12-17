/**
 * PostsGrid Component
 * Grid layout container for posts with delete confirmation
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
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
import { PostsGridCard } from './PostsGridCard'
import { cn } from '@/lib/utils'
import type { PostResponse } from '@/types/posts'

interface PostsGridProps {
  posts: PostResponse[]
  onEdit?: (post: PostResponse) => void
  onDelete?: (post: PostResponse) => Promise<boolean>
  onPublishNow?: (post: PostResponse) => void
  className?: string
}

export function PostsGrid({ posts, onEdit, onDelete, onPublishNow, className }: PostsGridProps) {
  const { t } = useTranslation()
  const [postToDelete, setPostToDelete] = useState<PostResponse | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteClick = (post: PostResponse) => {
    setPostToDelete(post)
  }

  const handleDeleteConfirm = async () => {
    if (!postToDelete || !onDelete) return

    setIsDeleting(true)
    try {
      await onDelete(postToDelete)
    } finally {
      setIsDeleting(false)
      setPostToDelete(null)
    }
  }

  const handleDeleteCancel = () => {
    setPostToDelete(null)
  }

  return (
    <>
      <div
        className={cn(
          'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
          className
        )}
      >
        {posts.map((post) => (
          <PostsGridCard
            key={post.id}
            post={post}
            onEdit={onEdit}
            onDelete={onDelete ? handleDeleteClick : undefined}
            onPublishNow={onPublishNow}
          />
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!postToDelete} onOpenChange={(open) => !open && handleDeleteCancel()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('dashboard.posts.table.confirmDelete')}</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2">
                <p className="text-muted-foreground">
                  {t('dashboard.common.delete')} "{postToDelete?.caption.slice(0, 50)}
                  {(postToDelete?.caption.length ?? 0) > 50 ? '...' : ''}"?
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              {t('dashboard.common.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? t('dashboard.common.loading') : t('dashboard.common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
