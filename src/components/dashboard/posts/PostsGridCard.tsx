/**
 * PostsGridCard Component
 * Clean, minimal card design for displaying posts in a grid layout
 */

import { useTranslation } from 'react-i18next'
import { MoreHorizontal, Eye, Pencil, Trash2, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { AccountAvatar } from '@/components/common/AccountAvatar'
import { PostStatusBadge } from './PostStatusBadge'
import { cn } from '@/lib/utils'
import type { PostResponse } from '@/types/posts'

interface PostsGridCardProps {
  post: PostResponse
  onView?: (post: PostResponse) => void
  onEdit?: (post: PostResponse) => void
  onDelete?: (post: PostResponse) => void
  onPublishNow?: (post: PostResponse) => void
  className?: string
}

// Subtle gradient backgrounds for posts without media
const GRADIENT_BACKGROUNDS = [
  'from-violet-500/15 to-purple-500/10',
  'from-blue-500/15 to-cyan-500/10',
  'from-emerald-500/15 to-teal-500/10',
  'from-orange-500/15 to-amber-500/10',
  'from-pink-500/15 to-rose-500/10',
  'from-indigo-500/15 to-sky-500/10',
]

function getGradientForPost(postId: string): string {
  const hash = postId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return GRADIENT_BACKGROUNDS[hash % GRADIENT_BACKGROUNDS.length]
}

export function PostsGridCard({
  post,
  onView,
  onEdit,
  onDelete,
  onPublishNow,
  className,
}: PostsGridCardProps) {
  const { t, i18n } = useTranslation()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    // If scheduled in the future
    if (diffMs < 0) {
      return new Intl.DateTimeFormat(i18n.language, {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }).format(date)
    }

    if (diffDays === 0) {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
      if (diffHours === 0) {
        const diffMins = Math.floor(diffMs / (1000 * 60))
        if (diffMins < 1) return 'Just now'
        return `${diffMins}m ago`
      }
      return `${diffHours}h ago`
    }
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays}d ago`

    return new Intl.DateTimeFormat(i18n.language, {
      month: 'short',
      day: 'numeric',
    }).format(date)
  }

  // TODO: Add media_urls support when backend returns it
  const hasMedia = false
  const gradient = getGradientForPost(post.id)
  const mainAccount = post.social_accounts[0]
  const additionalAccounts = post.social_accounts.slice(1)
  const displayDate = post.scheduled_at || post.created_at
  const canPublishNow = post.is_draft || (post.scheduled_at && post.status === 'pending')

  return (
    <div
      className={cn(
        'group border-border bg-card flex flex-col overflow-hidden rounded-lg border',
        className
      )}
    >
      {/* Main Content Area */}
      <div className="flex flex-1 gap-3 p-4">
        {/* Left Side - Avatar + Text */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Account Avatar Row */}
          <div className="mb-3 flex items-center gap-2">
            {mainAccount && (
              <AccountAvatar
                platform={mainAccount.platform}
                name={mainAccount.username}
                size="sm"
              />
            )}
            {additionalAccounts.length > 0 && (
              <div className="flex -space-x-1.5">
                {additionalAccounts.slice(0, 2).map((account, idx) => (
                  <AccountAvatar
                    key={account.id}
                    platform={account.platform}
                    name={account.username}
                    size="xs"
                    style={{ zIndex: 2 - idx }}
                  />
                ))}
                {additionalAccounts.length > 2 && (
                  <span className="text-muted-foreground ml-1.5 text-xs">
                    +{additionalAccounts.length - 2}
                  </span>
                )}
              </div>
            )}
            <PostStatusBadge
              status={post.status}
              isDraft={post.is_draft}
              size="sm"
              className="ml-auto"
            />
          </div>

          {/* Caption */}
          <p className="text-foreground line-clamp-3 text-sm leading-relaxed">
            {post.caption || <span className="text-muted-foreground italic">No caption</span>}
          </p>
        </div>

        {/* Right Side - Media */}
        {(hasMedia || !post.caption) && (
          <div
            className={cn(
              'h-24 w-24 shrink-0 overflow-hidden rounded-md bg-gradient-to-br',
              gradient
            )}
          >
            {hasMedia ? (
              // TODO: Display media thumbnail when available
              <div className="bg-muted h-full w-full" />
            ) : null}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-border/50 flex items-center justify-between border-t px-4 py-2.5">
        {/* Date */}
        <span className="text-muted-foreground text-xs">{formatDate(displayDate)}</span>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {canPublishNow && onPublishNow && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPublishNow(post)}
              className="h-7 gap-1.5 px-2 text-xs"
            >
              <Send className="size-3" />
              {t('dashboard.createPost.actions.postNow')}
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-7">
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
