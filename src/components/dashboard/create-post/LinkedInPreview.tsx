/**
 * LinkedInPreview Component
 * High-fidelity 1:1 LinkedIn post preview that adapts to app theme
 */

import { useTranslation } from 'react-i18next'
import { ThumbsUp, MessageCircle, Repeat2, Send, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Connection } from '@/types/connections'
import type { MediaFile } from './MediaUploader'
import { LinkedInMediaGrid } from './LinkedInMediaGrid'

export interface LinkedInPreviewProps {
  account?: Connection
  media: MediaFile[]
  caption: string
}

/**
 * Get initials from name for avatar fallback
 */
function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/**
 * Avatar component with image or initials fallback
 */
function PostAvatar({
  src,
  name,
  className,
}: {
  src?: string | null
  name: string
  className?: string
}) {
  const initials = getInitials(name || 'U')

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn('h-12 w-12 shrink-0 rounded-full object-cover', className)}
      />
    )
  }

  // Fallback to initials with LinkedIn blue gradient
  return (
    <div
      className={cn(
        'flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0a66c2] to-[#004182] text-sm font-semibold text-white',
        className
      )}
    >
      {initials}
    </div>
  )
}

/**
 * Engagement button with hover effect
 */
function EngagementButton({
  icon: Icon,
  label,
  ariaLabel,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  ariaLabel: string
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={cn(
        'text-linkedin-text-secondary hover:bg-linkedin-bg-hover hover:text-linkedin-blue flex items-center gap-1.5 rounded px-3 py-2 transition-colors duration-150'
      )}
    >
      <Icon className="h-5 w-5" />
      <span className="text-xs font-medium">{label}</span>
    </button>
  )
}

export function LinkedInPreview({ account, media, caption }: LinkedInPreviewProps) {
  const { t } = useTranslation()

  const displayName = account?.displayName || account?.platformUsername || 'Display Name'
  const username = account?.platformUsername || 'username'
  const avatarUrl = account?.avatarUrl

  return (
    <div className="border-linkedin-border bg-linkedin-bg overflow-hidden rounded-xl border">
      {/* Post content */}
      <div className="p-4">
        <div className="flex gap-3">
          {/* Avatar */}
          <PostAvatar src={avatarUrl} name={displayName} />

          {/* Content */}
          <div className="min-w-0 flex-1">
            {/* Header row */}
            <div className="flex flex-col">
              <span className="text-linkedin-text-primary truncate text-sm font-semibold">
                {displayName}
              </span>
              <span className="text-linkedin-text-secondary truncate text-xs">{username}</span>
              <div className="text-linkedin-text-secondary flex items-center gap-1 text-xs">
                <span>{t('dashboard.createPost.preview.linkedin.timestamp.now')}</span>
                <span>·</span>
                <Globe className="h-3 w-3" />
              </div>
            </div>
          </div>
        </div>

        {/* Post text */}
        {caption && (
          <p className="text-linkedin-text-primary mt-3 text-sm leading-relaxed break-words whitespace-pre-wrap">
            {caption}
          </p>
        )}

        {/* Media grid */}
        {media.length > 0 && <LinkedInMediaGrid media={media} />}
      </div>

      {/* Engagement bar */}
      <div className="border-linkedin-border border-t px-2 py-1">
        <div className="flex items-center justify-between">
          <EngagementButton
            icon={ThumbsUp}
            label={t('dashboard.createPost.preview.linkedin.engagement.like')}
            ariaLabel={t('dashboard.createPost.preview.linkedin.engagement.like')}
          />
          <EngagementButton
            icon={MessageCircle}
            label={t('dashboard.createPost.preview.linkedin.engagement.comment')}
            ariaLabel={t('dashboard.createPost.preview.linkedin.engagement.comment')}
          />
          <EngagementButton
            icon={Repeat2}
            label={t('dashboard.createPost.preview.linkedin.engagement.repost')}
            ariaLabel={t('dashboard.createPost.preview.linkedin.engagement.repost')}
          />
          <EngagementButton
            icon={Send}
            label={t('dashboard.createPost.preview.linkedin.engagement.send')}
            ariaLabel={t('dashboard.createPost.preview.linkedin.engagement.send')}
          />
        </div>
      </div>
    </div>
  )
}
