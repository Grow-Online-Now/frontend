/**
 * PostsTable Component
 * Displays posts in a table format with actions
 */

import { useTranslation } from 'react-i18next'
import { MoreHorizontal, Eye, Pencil, Trash2, Calendar } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import { PostStatusBadge } from './PostStatusBadge'
import { PlatformIcon } from './PlatformIcon'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import type { PostResponse } from '@/types/posts'

interface PostsTableProps {
  posts: PostResponse[]
  onView?: (post: PostResponse) => void
  onEdit?: (post: PostResponse) => void
  onDelete?: (post: PostResponse) => Promise<boolean>
  className?: string
}

export function PostsTable({ posts, onView, onEdit, onDelete, className }: PostsTableProps) {
  const { t, i18n } = useTranslation()
  const [deletePost, setDeletePost] = useState<PostResponse | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const formatDate = (dateString: string | null) => {
    if (!dateString) return t('dashboard.posts.table.notScheduled')
    return new Intl.DateTimeFormat(i18n.language, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(dateString))
  }

  const truncateCaption = (caption: string, maxLength: number = 60) => {
    if (caption.length <= maxLength) return caption
    return caption.substring(0, maxLength) + '...'
  }

  const handleDelete = async () => {
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
      <div className={cn('border-border-subtle overflow-hidden rounded-2xl border', className)}>
        <Table>
          <TableHeader>
            <TableRow className="bg-surface-muted hover:bg-surface-muted">
              <TableHead className="w-[40%]">{t('dashboard.posts.table.caption')}</TableHead>
              <TableHead>{t('dashboard.posts.table.platforms')}</TableHead>
              <TableHead>{t('dashboard.posts.table.status')}</TableHead>
              <TableHead>{t('dashboard.posts.table.scheduledFor')}</TableHead>
              <TableHead>{t('dashboard.posts.table.createdAt')}</TableHead>
              <TableHead className="w-[60px]">{t('dashboard.posts.table.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id} className="group">
                <TableCell className="font-medium">
                  <p className="text-foreground line-clamp-2 max-w-[300px]">
                    {truncateCaption(post.caption)}
                  </p>
                </TableCell>
                <TableCell>
                  <div className="flex -space-x-1">
                    {post.social_accounts.slice(0, 4).map((account, idx) => (
                      <div
                        key={account.id}
                        className="relative"
                        style={{ zIndex: post.social_accounts.length - idx }}
                        title={`@${account.username}`}
                      >
                        <PlatformIcon
                          platform={account.platform}
                          size="sm"
                          className="ring-card ring-2"
                        />
                      </div>
                    ))}
                    {post.social_accounts.length > 4 && (
                      <div className="bg-muted text-muted-foreground ring-card flex size-6 items-center justify-center rounded-lg text-xs font-medium ring-2">
                        +{post.social_accounts.length - 4}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <PostStatusBadge status={post.status} isDraft={post.is_draft} />
                </TableCell>
                <TableCell>
                  <div className="text-muted-foreground flex items-center gap-1.5">
                    {post.scheduled_at && <Calendar className="size-3.5" />}
                    <span className="text-sm">{formatDate(post.scheduled_at)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-muted-foreground text-sm">
                    {formatDate(post.created_at)}
                  </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <MoreHorizontal className="size-4" />
                        <span className="sr-only">{t('dashboard.posts.table.actions')}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {onView && (
                        <DropdownMenuItem onClick={() => onView(post)}>
                          <Eye className="mr-2 size-4" />
                          {t('dashboard.posts.table.view')}
                        </DropdownMenuItem>
                      )}
                      {onEdit && (
                        <DropdownMenuItem onClick={() => onEdit(post)}>
                          <Pencil className="mr-2 size-4" />
                          {t('dashboard.posts.table.edit')}
                        </DropdownMenuItem>
                      )}
                      {onDelete && (
                        <DropdownMenuItem
                          onClick={() => setDeletePost(post)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 size-4" />
                          {t('dashboard.posts.table.delete')}
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deletePost}
        onOpenChange={(open: boolean) => !open && setDeletePost(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('dashboard.posts.table.delete')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('dashboard.posts.table.confirmDelete')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              {t('dashboard.common.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t('dashboard.common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
