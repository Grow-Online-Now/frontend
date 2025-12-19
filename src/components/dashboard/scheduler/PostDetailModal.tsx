/**
 * PostDetailModal Component
 * Full post detail view in a modal with actions
 */

import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { X, Pencil, Copy, Trash2, Calendar, Clock } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
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
import { AccountAvatarStack } from '@/components/common/AccountAvatar'
import { PostStatusBadge } from '@/components/dashboard/posts/PostStatusBadge'
import { getPostDisplayDate } from '@/lib/date-utils'
import { useState } from 'react'
import type { PostResponse } from '@/types/posts'

interface PostDetailModalProps {
  post: PostResponse | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onDelete?: (post: PostResponse) => Promise<void>
}

export function PostDetailModal({ post, open, onOpenChange, onDelete }: PostDetailModalProps) {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  if (!post) return null

  // Format the scheduled/posted date
  const displayDate = getPostDisplayDate(post)
  const formattedDate = new Intl.DateTimeFormat(i18n.language, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(displayDate)

  // Format relative creation time
  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
      if (diffHours === 0) {
        const diffMins = Math.floor(diffMs / (1000 * 60))
        return t('dashboard.scheduler.detail.minutesAgo', { count: diffMins })
      }
      return t('dashboard.scheduler.detail.hoursAgo', { count: diffHours })
    }
    if (diffDays === 1) return t('dashboard.scheduler.detail.yesterday')
    if (diffDays < 7) return t('dashboard.scheduler.detail.daysAgo', { count: diffDays })

    return new Intl.DateTimeFormat(i18n.language, {
      month: 'short',
      day: 'numeric',
    }).format(date)
  }

  // Map social accounts to the format expected by AccountAvatarStack
  const accountsForStack = post.social_accounts.map((account) => ({
    id: account.id,
    platform: account.platform,
    avatarUrl: account.avatar_url,
    name: account.display_name,
    username: account.username,
  }))

  const handleEdit = () => {
    onOpenChange(false)
    navigate(`/${i18n.language}/dashboard/posts/${post.id}/edit`)
  }

  const handleDuplicate = () => {
    onOpenChange(false)
    // Navigate to create post with pre-filled data
    // For now, just navigate to create post page
    navigate(`/${i18n.language}/dashboard/posts/create`)
  }

  const handleDelete = async () => {
    if (!onDelete) return
    setIsDeleting(true)
    try {
      await onDelete(post)
      setShowDeleteConfirm(false)
      onOpenChange(false)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg p-0">
          {/* Header */}
          <DialogHeader className="border-border flex flex-row items-center justify-between border-b p-4">
            <div>
              <DialogTitle className="text-base font-medium">
                {t('dashboard.scheduler.detail.title')}
              </DialogTitle>
              <DialogDescription className="sr-only">
                {t('dashboard.scheduler.detail.description')}
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">{t('common.actions.close')}</span>
            </Button>
          </DialogHeader>

          <div className="space-y-4 p-4">
            {/* Accounts */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AccountAvatarStack accounts={accountsForStack} max={4} size="sm" />
                <span className="text-muted-foreground text-sm">
                  {t('dashboard.scheduler.detail.postingTo', {
                    count: post.social_accounts.length,
                  })}
                </span>
              </div>
              <PostStatusBadge status={post.status} isDraft={post.is_draft} />
            </div>

            {/* Schedule Info */}
            <div className="bg-muted/30 flex items-center gap-4 rounded-lg p-3">
              <div className="text-muted-foreground flex items-center gap-1.5">
                <Calendar className="size-4" />
                <span className="text-sm">{formattedDate}</span>
              </div>
              <div className="text-muted-foreground flex items-center gap-1.5">
                <Clock className="size-4" />
                <span className="text-sm">
                  {t('dashboard.scheduler.detail.createdAt', {
                    time: formatRelativeDate(post.created_at),
                  })}
                </span>
              </div>
            </div>

            {/* Caption */}
            <div className="space-y-2">
              <h4 className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                {t('dashboard.scheduler.detail.caption')}
              </h4>
              <p className="text-foreground max-h-48 overflow-y-auto whitespace-pre-wrap text-sm leading-relaxed">
                {post.caption || (
                  <span className="text-muted-foreground italic">
                    {t('dashboard.scheduler.detail.noCaption')}
                  </span>
                )}
              </p>
            </div>

            {/* Actions */}
            <div className="border-border flex gap-2 border-t pt-4">
              <Button variant="outline" className="flex-1" onClick={handleEdit}>
                <Pencil className="mr-2 h-4 w-4" />
                {t('dashboard.scheduler.detail.actions.edit')}
              </Button>
              <Button variant="outline" className="flex-1" onClick={handleDuplicate}>
                <Copy className="mr-2 h-4 w-4" />
                {t('dashboard.scheduler.detail.actions.duplicate')}
              </Button>
              {onDelete && (
                <Button
                  variant="outline"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">{t('dashboard.scheduler.detail.actions.delete')}</span>
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('dashboard.scheduler.detail.confirmDelete.title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('dashboard.scheduler.detail.confirmDelete.description')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              {t('common.actions.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting
                ? t('dashboard.scheduler.detail.confirmDelete.deleting')
                : t('dashboard.scheduler.detail.actions.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
