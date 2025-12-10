/**
 * PostsList Component
 * Card-based list of posts with delete confirmation
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
import { PostCard } from './PostCard'
import { cn } from '@/lib/utils'
import type { PostResponse } from '@/types/posts'

interface PostsListProps {
  posts: PostResponse[]
  onView?: (post: PostResponse) => void
  onEdit?: (post: PostResponse) => void
  onDelete?: (post: PostResponse) => Promise<boolean>
  className?: string
}

export function PostsList({ posts, onView, onEdit, onDelete, className }: PostsListProps) {
  const { t } = useTranslation()
  const [deletePost, setDeletePost] = useState<PostResponse | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteClick = (post: PostResponse) => {
    setDeletePost(post)
  }

  const handleDeleteConfirm = async () => {
    if (!deletePost || !onDelete) return
    setIsDeleting(true)
    try {
      await onDelete(deletePost)
    } finally {
      setIsDeleting(false)
      setDeletePost(null)
    }
  }

  return (
    <>
      <div className={cn('space-y-3', className)}>
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete ? handleDeleteClick : undefined}
          />
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deletePost}
        onOpenChange={(open: boolean) => !open && setDeletePost(null)}
      >
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>{t('dashboard.posts.table.delete')}</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              {t('dashboard.posts.table.confirmDelete')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deletePost && (
            <div className="border-border-subtle bg-surface-muted rounded-xl border p-3">
              <p className="text-foreground line-clamp-2 text-sm">{deletePost.caption}</p>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting} className="rounded-full">
              {t('dashboard.common.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-full"
            >
              {isDeleting ? t('dashboard.common.loading') : t('dashboard.common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
