/**
 * FacebookPreview Component
 * High-fidelity 1:1 Facebook post preview that adapts to app theme
 */

import { useTranslation } from 'react-i18next'
import { ThumbsUp, MessageCircle, Share2, Globe, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Connection } from '@/types/connections'
import type { MediaFile } from './MediaUploader'
import { FacebookMediaGrid } from './FacebookMediaGrid'

export interface FacebookPreviewProps {
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
        className={cn('h-10 w-10 shrink-0 rounded-full object-cover', className)}
      />
    )
  }

  // Fallback to initials with Facebook blue gradient
  return (
    <div
      className={cn(
        'flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#1877f2] to-[#0a5dc2] text-sm font-semibold text-white',
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
        'text-facebook-text-secondary hover:bg-facebook-bg-hover flex flex-1 items-center justify-center gap-2 rounded-md py-2 transition-colors duration-150'
      )}
    >
      <Icon className="h-5 w-5" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  )
}

export function FacebookPreview({ account, media, caption }: FacebookPreviewProps) {
  const { t } = useTranslation()

  const displayName = account?.displayName || account?.platformUsername || 'Display Name'
  const avatarUrl = account?.avatarUrl

  return (
    <div className="border-facebook-border bg-facebook-bg overflow-hidden rounded-lg border">
      {/* Post header */}
      <div className="p-3">
        <div className="flex items-start gap-2">
          {/* Avatar */}
          <PostAvatar src={avatarUrl} name={displayName} />

          {/* Author info */}
          <div className="min-w-0 flex-1">
            <span className="text-facebook-text-primary text-[15px] font-semibold">
              {displayName}
            </span>
            <div className="text-facebook-text-secondary flex items-center gap-1 text-xs">
              <span>{t('dashboard.createPost.preview.facebook.timestamp.now')}</span>
              <span>·</span>
              <Globe className="h-3 w-3" />
            </div>
          </div>

          {/* More button */}
          <button
            type="button"
            className="text-facebook-text-secondary hover:bg-facebook-bg-hover rounded-full p-1.5 transition-colors"
            aria-label="More options"
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>

        {/* Post text */}
        {caption && (
          <p className="text-facebook-text-primary mt-3 text-[15px] leading-relaxed break-words whitespace-pre-wrap">
            {caption}
          </p>
        )}
      </div>

      {/* Media grid */}
      {media.length > 0 && (
        <div className="px-3 pb-2">
          <FacebookMediaGrid media={media} />
        </div>
      )}

      {/* Engagement counts (placeholder) */}
      <div className="border-facebook-border mx-3 border-b pb-2">
        <div className="text-facebook-text-secondary flex items-center justify-between text-[13px]">
          <div className="flex items-center gap-1">
            <div className="flex -space-x-1">
              <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#1877f2] text-[10px] text-white">
                👍
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Engagement bar */}
      <div className="px-3 py-1">
        <div className="flex items-center">
          <EngagementButton
            icon={ThumbsUp}
            label={t('dashboard.createPost.preview.facebook.engagement.like')}
            ariaLabel={t('dashboard.createPost.preview.facebook.engagement.like')}
          />
          <EngagementButton
            icon={MessageCircle}
            label={t('dashboard.createPost.preview.facebook.engagement.comment')}
            ariaLabel={t('dashboard.createPost.preview.facebook.engagement.comment')}
          />
          <EngagementButton
            icon={Share2}
            label={t('dashboard.createPost.preview.facebook.engagement.share')}
            ariaLabel={t('dashboard.createPost.preview.facebook.engagement.share')}
          />
        </div>
      </div>
    </div>
  )
}
