/**
 * PostingProgressModal
 * Shows real-time posting progress across platforms
 * Supports both "post now" and "scheduled" flows with unified UX
 */

import { useTranslation } from 'react-i18next'
import { Check, Clock, XCircle, ExternalLink, Loader2, Calendar, CheckCircle2 } from 'lucide-react'
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
import type { SocialPlatform } from '@/types/connections'

type ScheduleType = 'now' | 'scheduled'

// Minimal account interface for the modal (works with Connection, PlatformWithValidation, etc.)
interface ModalAccount {
  id: string
  platform: SocialPlatform
  displayName?: string | null
  platformUsername: string
}

interface PostingProgressModalProps {
  isOpen: boolean
  onClose: () => void
  postId: string | null
  selectedAccounts: ModalAccount[]
  platformPosts: PlatformPost[]
  overallStatus: PostStatus
  // New props for unified flow
  scheduleType: ScheduleType
  scheduledAt?: Date | null
  onViewCalendar?: () => void
  onViewPosts?: () => void
  onCreateAnother?: () => void
}

export function PostingProgressModal({
  isOpen,
  onClose,
  postId,
  selectedAccounts,
  platformPosts,
  overallStatus,
  scheduleType,
  scheduledAt,
  onViewCalendar,
  onViewPosts,
  onCreateAnother,
}: PostingProgressModalProps) {
  const { t } = useTranslation()

  // For scheduled posts, we show success immediately after API call
  const isScheduledFlow = scheduleType === 'scheduled'

  // Check if overall status indicates failure
  const hasFailed = overallStatus === 'failed'

  // Check if all platforms are done (or if overall status indicates completion/failure)
  const allPlatformsDone =
    platformPosts.length > 0 &&
    platformPosts.every((p) => p.status === 'posted' || p.status === 'failed')

  // For scheduled posts, "pending" status means success (post is waiting for scheduled time)
  // BUT we need a valid postId to confirm the post was actually created
  // For now posts, show success when all platforms are done or overall status is completed/failed
  const isComplete = isScheduledFlow
    ? postId !== null && (overallStatus === 'pending' || overallStatus === 'completed' || hasFailed)
    : allPlatformsDone || overallStatus === 'completed' || hasFailed

  // Allow closing only when complete
  const canClose = isComplete

  const completedCount = platformPosts.filter((p) => p.status === 'posted').length
  const failedCount = platformPosts.filter((p) => p.status === 'failed').length
  const totalCount = selectedAccounts.length || platformPosts.length
  const hasErrors = failedCount > 0

  // Format scheduled date for display
  const formattedScheduledDate = scheduledAt
    ? new Intl.DateTimeFormat(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(scheduledAt)
    : ''

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

  // Find platform post for a connection
  const getPlatformPost = (accountId: string) => {
    return platformPosts.find((p) => {
      const account = selectedAccounts.find((a) => a.id === accountId)
      return account && p.platform === account.platform
    })
  }

  // Render the scheduled success content
  const renderScheduledSuccess = () => (
    <div className="flex flex-col items-center py-6 text-center">
      <div className="bg-success/10 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
        <CheckCircle2 className="text-success h-8 w-8" />
      </div>
      <h3 className="text-foreground mb-1 text-lg font-semibold">
        {t('dashboard.createPost.progress.scheduledSuccess')}
      </h3>
      <div className="text-muted-foreground mb-4 flex items-center gap-2 text-sm">
        <Calendar className="h-4 w-4" />
        <span>{formattedScheduledDate}</span>
      </div>

      {/* Platform list */}
      <div className="w-full space-y-2">
        <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          {t('dashboard.createPost.progress.willPostTo')}
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {selectedAccounts.map((account) => (
            <div
              key={account.id}
              className="border-border-subtle flex items-center gap-2 rounded-lg border px-3 py-2"
            >
              <PlatformIcon platform={account.platform} size="xs" showBackground />
              <span className="text-foreground text-sm">
                {account.displayName || account.platformUsername}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // Render the failure content (for both scheduled and now posts)
  const renderFailure = () => {
    // Get error messages from platform posts (API uses "error" field)
    const errorMessages = platformPosts
      .filter((p) => p.status === 'failed' && (p.error || p.errorMessage))
      .map((p) => p.error || p.errorMessage)

    return (
      <div className="flex flex-col items-center py-6 text-center">
        <div className="bg-destructive/10 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <XCircle className="text-destructive h-8 w-8" />
        </div>
        <h3 className="text-foreground mb-1 text-lg font-semibold">
          {t('dashboard.createPost.progress.failed')}
        </h3>
        {errorMessages.length > 0 && (
          <div className="mt-3 max-w-sm space-y-1">
            {errorMessages.map((msg, idx) => (
              <p key={idx} className="text-destructive text-sm">
                {msg}
              </p>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Render the "post now" success content
  const renderPostNowSuccess = () => (
    <div className="flex flex-col items-center py-4 text-center">
      <div
        className={cn(
          'mb-4 flex h-16 w-16 items-center justify-center rounded-full',
          hasErrors ? 'bg-warning/10' : 'bg-success/10'
        )}
      >
        {hasErrors ? (
          <XCircle className="text-warning h-8 w-8" />
        ) : (
          <CheckCircle2 className="text-success h-8 w-8" />
        )}
      </div>
      <h3 className="text-foreground mb-1 text-lg font-semibold">
        {hasErrors
          ? t('dashboard.createPost.progress.partialSuccess')
          : t('dashboard.createPost.progress.success')}
      </h3>
      <p className="text-muted-foreground mb-4 text-sm">
        {t('dashboard.createPost.posting.progress', {
          completed: completedCount,
          total: totalCount,
        })}
      </p>
    </div>
  )

  // Render platform status rows (for "post now" flow)
  const renderPlatformStatuses = () => (
    <div className="space-y-3 py-4">
      {selectedAccounts.map((account) => {
        const platformPost = getPlatformPost(account.id)
        const status = platformPost?.status || 'queued'
        const statusInfo = getStatusInfo(status)
        const StatusIcon = statusInfo.icon
        const isPosting = status === 'queued' && overallStatus === 'processing'

        return (
          <div
            key={account.id}
            className={cn(
              'flex items-center gap-3 rounded-xl border p-3',
              status === 'posted' && 'border-success/20 bg-success/5',
              status === 'failed' && 'border-destructive/20 bg-destructive/5',
              status === 'queued' && 'border-border-subtle'
            )}
          >
            <PlatformIcon platform={account.platform} size="sm" showBackground />

            <div className="min-w-0 flex-1">
              <p className="text-foreground truncate text-sm font-medium">
                {account.displayName || account.platformUsername}
              </p>
              <p className="text-muted-foreground text-xs">
                {t(`dashboard.accounts.platforms.${account.platform}`)}
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
  )

  // Render scheduling in progress
  const renderSchedulingProgress = () => (
    <div className="flex flex-col items-center py-8 text-center">
      <Loader2 className="text-primary mb-4 h-10 w-10 animate-spin" />
      <p className="text-foreground font-medium">{t('dashboard.createPost.progress.scheduling')}</p>
    </div>
  )

  // Determine title and description based on flow
  const getHeaderContent = () => {
    if (isScheduledFlow) {
      return {
        title: isComplete
          ? t('dashboard.createPost.progress.scheduledSuccess')
          : t('dashboard.createPost.progress.scheduling'),
        description: isComplete ? '' : t('dashboard.createPost.progress.pleaseWait'),
      }
    }
    return {
      title: isComplete
        ? t('dashboard.createPost.progress.success')
        : t('dashboard.createPost.posting.title'),
      description: isComplete ? '' : t('dashboard.createPost.posting.subtitle'),
    }
  }

  const { title, description } = getHeaderContent()

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && canClose && onClose()}>
      <DialogContent
        className="sm:max-w-md"
        onPointerDownOutside={(e) => !canClose && e.preventDefault()}
        onEscapeKeyDown={(e) => !canClose && e.preventDefault()}
      >
        {/* Only show header when not complete (complete state has its own header) */}
        {!isComplete && (
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
        )}

        {/* Main content */}
        {hasFailed ? (
          // Failed state - show error for both flows
          renderFailure()
        ) : isScheduledFlow ? (
          // Scheduled flow
          isComplete ? (
            renderScheduledSuccess()
          ) : (
            renderSchedulingProgress()
          )
        ) : (
          // Post now flow
          <>
            {isComplete && renderPostNowSuccess()}
            {renderPlatformStatuses()}
          </>
        )}

        {/* CTA buttons - only show when complete */}
        {isComplete && (
          <div className="border-border-subtle flex items-center justify-end gap-3 border-t pt-4">
            {onCreateAnother && (
              <Button variant="outline" onClick={onCreateAnother} size="sm">
                {t('dashboard.createPost.progress.createAnother')}
              </Button>
            )}
            {isScheduledFlow
              ? onViewCalendar && (
                  <Button onClick={onViewCalendar} size="sm">
                    {t('dashboard.createPost.progress.viewCalendar')}
                  </Button>
                )
              : onViewPosts && (
                  <Button onClick={onViewPosts} size="sm">
                    {t('dashboard.createPost.progress.viewPosts')}
                  </Button>
                )}
          </div>
        )}

        {/* Progress indicator when not complete (for post now flow only) */}
        {!isComplete && !isScheduledFlow && (
          <div className="border-border-subtle flex items-center justify-between border-t pt-4">
            <p className="text-muted-foreground text-sm">
              {t('dashboard.createPost.posting.progress', {
                completed: completedCount,
                total: totalCount,
              })}
            </p>
            <Loader2 className="text-primary h-4 w-4 animate-spin" />
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
