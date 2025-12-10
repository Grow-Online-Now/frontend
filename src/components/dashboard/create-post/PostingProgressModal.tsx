/**
 * PostingProgressModal
 * Shows real-time posting progress across platforms
 */

import { useTranslation } from 'react-i18next'
import { Check, Clock, XCircle, ExternalLink, Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { PlatformIcon } from '@/components/dashboard/posts/PlatformIcon'
import { cn } from '@/lib/utils'
import type { PlatformPost, PostStatus } from '@/types/posts'
import type { Connection } from '@/types/connections'

interface PostingProgressModalProps {
  isOpen: boolean
  onClose: () => void
  postId: string | null
  selectedAccounts: Connection[]
  platformPosts: PlatformPost[]
  overallStatus: PostStatus
}

export function PostingProgressModal({
  isOpen,
  onClose,
  selectedAccounts,
  platformPosts,
  overallStatus,
}: PostingProgressModalProps) {
  const { t } = useTranslation()

  // Check if all platforms are done
  // Use platformPosts directly since it contains the actual posting status from the backend
  // Also allow closing if the overall status is completed/failed (handles timeout or backend failure)
  const allPlatformsDone =
    platformPosts.length > 0 &&
    platformPosts.length >= selectedAccounts.length &&
    platformPosts.every((p) => p.status === 'posted' || p.status === 'failed')

  const overallDone = overallStatus === 'completed' || overallStatus === 'failed'

  const allComplete = allPlatformsDone || overallDone

  const completedCount = platformPosts.filter((p) => p.status === 'posted').length
  const totalCount = selectedAccounts.length || platformPosts.length

  // Get status info for display
  const getStatusInfo = (status: PlatformPost['status']) => {
    switch (status) {
      case 'posted':
        return {
          icon: Check,
          labelKey: 'dashboard.createPost.posting.status.posted',
          className: 'text-success',
          bgClassName: 'bg-success/10',
        }
      case 'failed':
        return {
          icon: XCircle,
          labelKey: 'dashboard.createPost.posting.status.failed',
          className: 'text-destructive',
          bgClassName: 'bg-destructive/10',
        }
      case 'queued':
      default:
        return {
          icon: Clock,
          labelKey: 'dashboard.createPost.posting.status.queued',
          className: 'text-muted-foreground',
          bgClassName: 'bg-muted',
        }
    }
  }

  // Find account info for a platform post by matching platform
  // Falls back to finding by index if multiple accounts have same platform
  const getAccountForPlatformPost = (platformPost: PlatformPost, index: number) => {
    // First try to find by platform (works when there's only one account per platform)
    const accountsByPlatform = selectedAccounts.filter((a) => a.platform === platformPost.platform)
    if (accountsByPlatform.length === 1) {
      return accountsByPlatform[0]
    }
    // If multiple accounts on same platform, use index-based matching
    // (assumes backend returns platform posts in same order as selected accounts)
    return selectedAccounts[index] || accountsByPlatform[0]
  }

  // Determine what to render - prefer platformPosts if available, fallback to selectedAccounts
  const itemsToRender = platformPosts.length > 0 ? platformPosts : selectedAccounts

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && allComplete && onClose()}>
      <DialogContent
        className="sm:max-w-md"
        onPointerDownOutside={(e) => !allComplete && e.preventDefault()}
        onEscapeKeyDown={(e) => !allComplete && e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{t('dashboard.createPost.posting.title')}</DialogTitle>
          <DialogDescription>{t('dashboard.createPost.posting.subtitle')}</DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {itemsToRender.map((item, index) => {
            // Determine if item is a PlatformPost or Connection
            const isPlatformPost = 'status' in item && typeof item.status === 'string'
            const platformPost = isPlatformPost ? (item as PlatformPost) : null
            const account = isPlatformPost
              ? getAccountForPlatformPost(item as PlatformPost, index)
              : (item as Connection)

            const status = platformPost?.status || 'queued'
            const statusInfo = getStatusInfo(status)
            const StatusIcon = statusInfo.icon
            const isPosting = status === 'queued' && overallStatus === 'processing'
            const platform = platformPost?.platform || account?.platform

            return (
              <div
                key={platformPost?.id || account?.id || index}
                className={cn(
                  'flex items-center gap-3 rounded-xl border p-3',
                  status === 'posted' && 'border-success/20 bg-success/5',
                  status === 'failed' && 'border-destructive/20 bg-destructive/5',
                  status === 'queued' && 'border-border-subtle'
                )}
              >
                <PlatformIcon platform={platform} size="sm" showBackground />

                <div className="min-w-0 flex-1">
                  <p className="text-foreground truncate text-sm font-medium">
                    {account?.displayName || account?.platformUsername || platform}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {t(`dashboard.accounts.platforms.${platform}`)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {isPosting ? (
                    <div className="flex items-center gap-1.5">
                      <Loader2 className="text-primary h-4 w-4 animate-spin" />
                      <span className="text-primary text-xs font-medium">
                        {t('dashboard.createPost.posting.status.posting')}
                      </span>
                    </div>
                  ) : (
                    <div
                      className={cn(
                        'flex items-center gap-1.5 rounded-full px-2 py-1',
                        statusInfo.bgClassName
                      )}
                    >
                      <StatusIcon className={cn('h-3.5 w-3.5', statusInfo.className)} />
                      <span className={cn('text-xs font-medium', statusInfo.className)}>
                        {t(statusInfo.labelKey)}
                      </span>
                    </div>
                  )}

                  {platformPost?.url && status === 'posted' && (
                    <a
                      href={platformPost.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            )
          })}

          {/* Show error messages */}
          {platformPosts.some((p) => p.status === 'failed' && p.errorMessage) && (
            <div className="mt-2 space-y-1">
              {platformPosts
                .filter((p) => p.status === 'failed' && p.errorMessage)
                .map((p) => (
                  <p key={p.id} className="text-destructive text-xs">
                    {t('dashboard.createPost.posting.error', { message: p.errorMessage })}
                  </p>
                ))}
            </div>
          )}
        </div>

        {/* Progress summary */}
        <div className="border-border-subtle flex items-center justify-between border-t pt-4">
          <p className="text-muted-foreground text-sm">
            {t('dashboard.createPost.posting.progress', {
              completed: completedCount,
              total: totalCount,
            })}
          </p>

          <Button onClick={onClose} disabled={!allComplete} size="sm">
            {allComplete
              ? t('dashboard.createPost.posting.done')
              : t('dashboard.createPost.posting.close')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
