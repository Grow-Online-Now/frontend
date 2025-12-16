/**
 * TwitterPreview Component
 * High-fidelity 1:1 Twitter/X post preview that adapts to app theme
 */

import { useTranslation } from 'react-i18next'
import {
  MessageCircle,
  Repeat2,
  Heart,
  BarChart2,
  Bookmark,
  Share,
  MoreHorizontal,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Connection } from '@/types/connections'
import type { TwitterThreadTweet, TwitterFirstComment } from '@/types/posts'
import type { MediaFile } from './MediaUploader'
import { TwitterMediaGrid } from './TwitterMediaGrid'

export interface TwitterPreviewProps {
  account?: Connection
  media: MediaFile[]
  caption: string
  thread?: TwitterThreadTweet[]
  firstComment?: TwitterFirstComment | null
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
function TweetAvatar({
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

  // Fallback to initials with gradient background
  return (
    <div
      className={cn(
        'from-twitter-blue to-twitter-pink flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-semibold text-white',
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
  count,
  hoverColor,
  ariaLabel,
}: {
  icon: React.ComponentType<{ className?: string }>
  count?: number
  hoverColor: 'blue' | 'green' | 'pink'
  ariaLabel: string
}) {
  const hoverClasses = {
    blue: 'hover:bg-twitter-blue/10 hover:text-twitter-blue',
    green: 'hover:bg-twitter-green/10 hover:text-twitter-green',
    pink: 'hover:bg-twitter-pink/10 hover:text-twitter-pink',
  }

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={cn(
        'group text-twitter-text-secondary flex items-center gap-1 rounded-full p-2 transition-colors duration-150',
        hoverClasses[hoverColor]
      )}
    >
      <Icon className="h-[18px] w-[18px]" />
      {count !== undefined && count > 0 && <span className="text-xs">{formatCount(count)}</span>}
    </button>
  )
}

/**
 * Format large numbers (1000 -> 1K, 1000000 -> 1M)
 */
function formatCount(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1).replace(/\.0$/, '')}M`
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1).replace(/\.0$/, '')}K`
  }
  return num.toString()
}

export function TwitterPreview({
  account,
  media,
  caption,
  thread = [],
  firstComment,
}: TwitterPreviewProps) {
  const { t } = useTranslation()
  const hasThread = thread.length > 0
  const hasFirstComment = firstComment && firstComment.text.length > 0

  const displayName = account?.displayName || account?.platformUsername || 'Display Name'
  const username = account?.platformUsername || 'username'
  const avatarUrl = account?.avatarUrl

  return (
    <div className="border-twitter-border bg-twitter-bg overflow-hidden rounded-2xl border">
      {/* Thread/Comment indicator */}
      {(hasThread || hasFirstComment) && (
        <div className="border-twitter-border bg-twitter-bg-hover border-b px-4 py-2">
          <div className="text-twitter-text-secondary flex items-center gap-2 text-xs">
            <MessageCircle className="h-3.5 w-3.5" />
            {hasThread && (
              <span>
                {t('dashboard.createPost.twitter.thread.summary', { count: thread.length + 1 })}
              </span>
            )}
            {hasThread && hasFirstComment && <span className="text-twitter-text-secondary">·</span>}
            {hasFirstComment && <span>{t('dashboard.createPost.twitter.firstComment.title')}</span>}
          </div>
        </div>
      )}

      {/* Main tweet */}
      <div className="p-4">
        <div className="flex gap-3">
          {/* Avatar */}
          <TweetAvatar src={avatarUrl} name={displayName} />

          {/* Content */}
          <div className="min-w-0 flex-1">
            {/* Header row */}
            <div className="flex items-center justify-between">
              <div className="flex min-w-0 items-center gap-1">
                <span className="text-twitter-text-primary truncate text-[15px] font-bold">
                  {displayName}
                </span>
                <span className="text-twitter-text-secondary shrink-0 text-[15px]">
                  @{username}
                </span>
                <span className="text-twitter-text-secondary shrink-0">·</span>
                <span className="text-twitter-text-secondary shrink-0 text-[15px]">
                  {t('dashboard.createPost.preview.twitter.timestamp.now')}
                </span>
              </div>
              {/* More button */}
              <button
                type="button"
                className="text-twitter-text-secondary hover:bg-twitter-blue/10 hover:text-twitter-blue rounded-full p-1.5 transition-colors"
                aria-label="More options"
              >
                <MoreHorizontal className="h-[18px] w-[18px]" />
              </button>
            </div>

            {/* Tweet text */}
            {caption && (
              <p className="text-twitter-text-primary mt-1 text-[15px] leading-5 break-words whitespace-pre-wrap">
                {caption}
              </p>
            )}

            {/* Media grid */}
            {media.length > 0 && <TwitterMediaGrid media={media} />}

            {/* Thread number indicator */}
            {hasThread && (
              <div className="text-twitter-text-secondary mt-3 text-xs">
                {t('dashboard.createPost.twitter.thread.tweetNumber', {
                  current: 1,
                  total: thread.length + 1,
                })}
              </div>
            )}

            {/* Engagement bar */}
            <div className="mt-3 -ml-2 flex items-center justify-between">
              <EngagementButton
                icon={MessageCircle}
                hoverColor="blue"
                ariaLabel={t('dashboard.createPost.preview.twitter.engagement.reply')}
              />
              <EngagementButton
                icon={Repeat2}
                hoverColor="green"
                ariaLabel={t('dashboard.createPost.preview.twitter.engagement.repost')}
              />
              <EngagementButton
                icon={Heart}
                hoverColor="pink"
                ariaLabel={t('dashboard.createPost.preview.twitter.engagement.like')}
              />
              <EngagementButton
                icon={BarChart2}
                hoverColor="blue"
                ariaLabel={t('dashboard.createPost.preview.twitter.engagement.views')}
              />
              <div className="flex items-center">
                <EngagementButton
                  icon={Bookmark}
                  hoverColor="blue"
                  ariaLabel={t('dashboard.createPost.preview.twitter.engagement.bookmark')}
                />
                <EngagementButton
                  icon={Share}
                  hoverColor="blue"
                  ariaLabel={t('dashboard.createPost.preview.twitter.engagement.share')}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Thread preview snippets */}
      {hasThread && thread.length > 0 && (
        <div className="border-twitter-border border-t px-4 py-3">
          <div className="space-y-2">
            {thread.slice(0, 2).map((tweet) => (
              <div key={tweet.id} className="flex items-start gap-2">
                <div className="bg-twitter-text-secondary/50 mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" />
                <p className="text-twitter-text-secondary line-clamp-1 text-sm">
                  {tweet.text || t('dashboard.createPost.twitter.thread.placeholder')}
                </p>
              </div>
            ))}
            {thread.length > 2 && (
              <p className="text-twitter-text-secondary text-xs">+{thread.length - 2} more...</p>
            )}
          </div>
        </div>
      )}

      {/* First comment preview */}
      {hasFirstComment && (
        <div className="border-twitter-border border-t px-4 py-3">
          <div className="flex items-start gap-2">
            <MessageCircle className="text-twitter-text-secondary mt-0.5 h-3.5 w-3.5 shrink-0" />
            <div className="min-w-0">
              <p className="text-twitter-text-secondary text-xs">
                {t('dashboard.createPost.preview.twitter.thread.replyingTo', { username })}
              </p>
              <p className="text-twitter-text-secondary mt-0.5 line-clamp-2 text-sm">
                {firstComment.text}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
