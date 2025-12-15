/**
 * PostCard Component
 * Beautiful card-based display for a single post
 */

import { useTranslation } from 'react-i18next'
import { MoreHorizontal, Eye, Pencil, Trash2, Calendar, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { PostStatusBadge } from './PostStatusBadge'
import { PlatformIcon } from './PlatformIcon'
import { cn } from '@/lib/utils'
import type { PostResponse } from '@/types/posts'

interface PostCardProps {
  post: PostResponse
  onView?: (post: PostResponse) => void
  onEdit?: (post: PostResponse) => void
  onDelete?: (post: PostResponse) => void
  className?: string
}

export function PostCard({ post, onView, onEdit, onDelete, className }: PostCardProps) {
  const { t, i18n } = useTranslation()

  const formatDate = (dateString: string | null, includeTime = true) => {
    if (!dateString) return null
    const date = new Date(dateString)

    if (includeTime) {
      return new Intl.DateTimeFormat(i18n.language, {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }).format(date)
    }

    return new Intl.DateTimeFormat(i18n.language, {
      month: 'short',
      day: 'numeric',
    }).format(date)
  }

  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
      if (diffHours === 0) {
        const diffMins = Math.floor(diffMs / (1000 * 60))
        return `${diffMins}m ago`
      }
      return `${diffHours}h ago`
    }
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays}d ago`

    return formatDate(dateString, false)
  }

  return (
    <div
      className={cn(
        'group border-border-subtle bg-card relative rounded-2xl border p-4 transition-all duration-200',
        'hover:border-border hover:shadow-sm',
        className
      )}
    >
      <div className="flex gap-4">
        {/* Platform Icons Stack */}
        <div className="flex shrink-0 flex-col items-center gap-1">
          <div className="flex -space-x-1.5">
            {post.social_accounts.slice(0, 3).map((account, idx) => (
              <div
                key={account.id}
                className="relative"
                style={{ zIndex: post.social_accounts.length - idx }}
                title={`@${account.username}`}
              >
                <PlatformIcon platform={account.platform} size="md" className="ring-card ring-2" />
              </div>
            ))}
          </div>
          {post.social_accounts.length > 3 && (
            <span className="text-muted-foreground text-xs font-medium">
              +{post.social_accounts.length - 3}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          {/* Caption */}
          <p className="text-foreground line-clamp-2 text-sm leading-relaxed font-medium">
            {post.caption}
          </p>

          {/* Meta Row */}
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <PostStatusBadge status={post.status} isDraft={post.is_draft} />

            {post.scheduled_at && (
              <div className="text-muted-foreground flex items-center gap-1.5">
                <Calendar className="size-3.5" />
                <span className="text-xs">{formatDate(post.scheduled_at)}</span>
              </div>
            )}

            <div className="text-muted-foreground flex items-center gap-1.5">
              <Clock className="size-3.5" />
              <span className="text-xs">{formatRelativeDate(post.created_at)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-start">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground size-8 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100"
              >
                <MoreHorizontal className="size-4" />
                <span className="sr-only">{t('dashboard.posts.table.actions')}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
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
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onDelete(post)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 size-4" />
                    {t('dashboard.posts.table.delete')}
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
