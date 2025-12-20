/**
 * SchedulerPostPreview Component
 * Platform-specific 1:1 preview cards for scheduler hover previews
 * Adapted from PostPreview components for PostResponse data
 */

import { useTranslation } from 'react-i18next'
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  ThumbsUp,
  Share2,
  Repeat2,
  BarChart2,
  MoreHorizontal,
  Globe,
  Play,
  Images,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { PlatformIcon } from '@/components/dashboard/posts/PlatformIcon'
import { PostStatusBadge } from '@/components/dashboard/posts/PostStatusBadge'
import type { PostResponse, PostSocialAccount, PostMediaItem } from '@/types/posts'
import type { SocialPlatform } from '@/types/connections'

interface SchedulerPostPreviewProps {
  post: PostResponse
  platform?: SocialPlatform
  className?: string
}

/**
 * Main preview component that routes to platform-specific previews
 */
export function SchedulerPostPreview({ post, platform, className }: SchedulerPostPreviewProps) {
  // Use provided platform or first account's platform
  const targetPlatform = platform || post.social_accounts[0]?.platform
  const account =
    post.social_accounts.find((a) => a.platform === targetPlatform) || post.social_accounts[0]

  if (!account) return null

  const truncatedCaption =
    post.caption.length > 150 ? post.caption.slice(0, 150) + '...' : post.caption

  // Get media from post
  const media = post.media || []

  return (
    <div className={cn('w-[300px]', className)}>
      {targetPlatform === 'twitter' && (
        <TwitterSchedulerPreview account={account} caption={truncatedCaption} media={media} />
      )}
      {targetPlatform === 'instagram' && (
        <InstagramSchedulerPreview account={account} caption={truncatedCaption} media={media} />
      )}
      {targetPlatform === 'linkedin' && (
        <LinkedInSchedulerPreview account={account} caption={truncatedCaption} media={media} />
      )}
      {targetPlatform === 'facebook' && (
        <FacebookSchedulerPreview account={account} caption={truncatedCaption} media={media} />
      )}
      {targetPlatform === 'tiktok' && (
        <TikTokSchedulerPreview account={account} caption={truncatedCaption} media={media} />
      )}
      {targetPlatform === 'youtube' && (
        <YouTubeSchedulerPreview account={account} caption={truncatedCaption} media={media} />
      )}
      {targetPlatform === 'pinterest' && (
        <PinterestSchedulerPreview account={account} caption={truncatedCaption} media={media} />
      )}
      {(targetPlatform === 'threads' || targetPlatform === 'bluesky') && (
        <GenericSchedulerPreview
          platform={targetPlatform}
          account={account}
          caption={truncatedCaption}
          media={media}
        />
      )}

      {/* Status badge at bottom */}
      <div className="mt-2 flex items-center justify-between">
        <PostStatusBadge status={post.status} isDraft={post.is_draft} />
        {post.social_accounts.length > 1 && (
          <span className="text-muted-foreground text-xs">+{post.social_accounts.length - 1}</span>
        )}
      </div>
    </div>
  )
}

// Twitter/X Preview
function TwitterSchedulerPreview({
  account,
  caption,
  media,
}: {
  account: PostSocialAccount
  caption: string
  media: PostMediaItem[]
}) {
  const hasMedia = media.length > 0
  const firstMedia = media[0]

  return (
    <div className="overflow-hidden rounded-2xl border border-[#2f3336] bg-black">
      {/* Header */}
      <div className="flex items-start gap-3 p-3">
        <TwitterAvatar account={account} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <span className="truncate text-sm font-bold text-white">
              {account.display_name || account.username}
            </span>
            <span className="text-sm text-[#71767b]">@{account.username}</span>
          </div>
          {/* Caption */}
          <p className="mt-1 text-sm leading-[1.3] whitespace-pre-wrap text-white">
            {caption || <span className="text-[#71767b] italic">No caption</span>}
          </p>
        </div>
      </div>

      {/* Media */}
      {hasMedia && (
        <div className="relative mx-3 mb-3 overflow-hidden rounded-xl">
          <MediaPreview media={firstMedia} aspectRatio="aspect-video" />
          {media.length > 1 && <MultipleMediaBadge count={media.length} />}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between px-3 pb-3">
        <EngagementButton
          icon={<MessageCircle className="h-4 w-4" />}
          hoverColor="text-[#1d9bf0]"
        />
        <EngagementButton icon={<Repeat2 className="h-4 w-4" />} hoverColor="text-[#00ba7c]" />
        <EngagementButton icon={<Heart className="h-4 w-4" />} hoverColor="text-[#f91880]" />
        <EngagementButton icon={<BarChart2 className="h-4 w-4" />} hoverColor="text-[#1d9bf0]" />
        <EngagementButton icon={<Bookmark className="h-4 w-4" />} hoverColor="text-[#1d9bf0]" />
      </div>
    </div>
  )
}

function TwitterAvatar({ account }: { account: PostSocialAccount }) {
  if (account.avatar_url) {
    return <img src={account.avatar_url} alt="" className="h-10 w-10 rounded-full object-cover" />
  }

  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#1d9bf0] to-[#0a66c2] text-sm font-bold text-white">
      {(account.display_name || account.username)?.[0]?.toUpperCase() || 'U'}
    </div>
  )
}

function EngagementButton({ icon, hoverColor }: { icon: React.ReactNode; hoverColor: string }) {
  return (
    <button type="button" className={cn('text-[#71767b] transition-colors', `hover:${hoverColor}`)}>
      {icon}
    </button>
  )
}

// Shared media preview component
function MediaPreview({
  media,
  aspectRatio = 'aspect-square',
  className,
}: {
  media: PostMediaItem
  aspectRatio?: string
  className?: string
}) {
  const isVideo = media.mediaType === 'video'

  return (
    <div className={cn('relative overflow-hidden', aspectRatio, className)}>
      {isVideo ? (
        <>
          <video src={media.url} className="h-full w-full object-cover" muted preload="metadata" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90">
              <Play className="h-5 w-5 fill-current text-black" />
            </div>
          </div>
        </>
      ) : (
        <img src={media.url} alt="" className="h-full w-full object-cover" loading="lazy" />
      )}
    </div>
  )
}

// Multiple media badge
function MultipleMediaBadge({ count }: { count: number }) {
  return (
    <div className="absolute right-2 bottom-2 flex items-center gap-0.5 rounded bg-black/60 px-1.5 py-0.5">
      <Images className="h-3 w-3 text-white" />
      <span className="text-xs font-medium text-white">{count}</span>
    </div>
  )
}

// Instagram Preview
function InstagramSchedulerPreview({
  account,
  caption,
  media,
}: {
  account: PostSocialAccount
  caption: string
  media: PostMediaItem[]
}) {
  const hasMedia = media.length > 0
  const firstMedia = media[0]

  return (
    <div className="bg-card border-border overflow-hidden rounded-2xl border">
      {/* Header */}
      <div className="flex items-center gap-2.5 p-3">
        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] p-[2px]">
          {account.avatar_url ? (
            <img
              src={account.avatar_url}
              alt=""
              className="bg-background h-full w-full rounded-full object-cover"
            />
          ) : (
            <div className="bg-background text-foreground flex h-full w-full items-center justify-center rounded-full text-xs font-semibold">
              {account.username?.[0]?.toUpperCase() || 'U'}
            </div>
          )}
        </div>
        <span className="text-foreground text-sm font-semibold">{account.username}</span>
        <MoreHorizontal className="text-foreground ml-auto h-4 w-4" />
      </div>

      {/* Media */}
      <div className="relative">
        {hasMedia && firstMedia ? (
          <>
            <MediaPreview media={firstMedia} aspectRatio="aspect-square" />
            {media.length > 1 && <MultipleMediaBadge count={media.length} />}
          </>
        ) : (
          <div className="bg-muted flex aspect-square items-center justify-center">
            <PlatformIcon platform="instagram" size="lg" showBackground />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="text-foreground flex items-center gap-4 p-3">
        <Heart className="h-5 w-5" />
        <MessageCircle className="h-5 w-5" />
        <Send className="h-5 w-5" />
        <Bookmark className="ml-auto h-5 w-5" />
      </div>

      {/* Caption */}
      {caption && (
        <div className="px-3 pb-3">
          <p className="text-foreground text-sm leading-[1.4]">
            <span className="font-semibold">{account.username}</span> {caption}
          </p>
        </div>
      )}
    </div>
  )
}

// LinkedIn Preview
function LinkedInSchedulerPreview({
  account,
  caption,
  media,
}: {
  account: PostSocialAccount
  caption: string
  media: PostMediaItem[]
}) {
  const { t } = useTranslation()
  const hasMedia = media.length > 0
  const firstMedia = media[0]

  return (
    <div className="bg-card border-border overflow-hidden rounded-2xl border">
      {/* Header */}
      <div className="flex items-center gap-2.5 p-3">
        {account.avatar_url ? (
          <img src={account.avatar_url} alt="" className="h-10 w-10 rounded-full object-cover" />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#0a66c2] to-[#004182] text-sm font-semibold text-white">
            {(account.display_name || account.username)?.[0]?.toUpperCase() || 'U'}
          </div>
        )}
        <div className="flex flex-col">
          <span className="text-foreground text-sm font-semibold">
            {account.display_name || account.username}
          </span>
          <div className="text-muted-foreground flex items-center gap-1 text-xs">
            <span>{t('dashboard.scheduler.preview.justNow')}</span>
            <span>·</span>
            <Globe className="h-3 w-3" />
          </div>
        </div>
      </div>

      {/* Caption */}
      {caption && (
        <div className="px-3 pb-3">
          <p className="text-foreground text-sm leading-[1.4]">{caption}</p>
        </div>
      )}

      {/* Media */}
      {hasMedia && firstMedia && (
        <div className="relative">
          <MediaPreview media={firstMedia} aspectRatio="aspect-video" />
          {media.length > 1 && <MultipleMediaBadge count={media.length} />}
        </div>
      )}

      {/* Actions */}
      <div className="text-muted-foreground border-border flex items-center justify-around border-t px-3 py-2">
        <div className="flex items-center gap-1 text-xs">
          <ThumbsUp className="h-4 w-4" />
          <span>{t('dashboard.scheduler.preview.actions.like')}</span>
        </div>
        <div className="flex items-center gap-1 text-xs">
          <MessageCircle className="h-4 w-4" />
          <span>{t('dashboard.scheduler.preview.actions.comment')}</span>
        </div>
        <div className="flex items-center gap-1 text-xs">
          <Share2 className="h-4 w-4" />
          <span>{t('dashboard.scheduler.preview.actions.share')}</span>
        </div>
      </div>
    </div>
  )
}

// Facebook Preview
function FacebookSchedulerPreview({
  account,
  caption,
  media,
}: {
  account: PostSocialAccount
  caption: string
  media: PostMediaItem[]
}) {
  const { t } = useTranslation()
  const hasMedia = media.length > 0
  const firstMedia = media[0]

  return (
    <div className="bg-card border-border overflow-hidden rounded-2xl border">
      {/* Header */}
      <div className="flex items-center gap-2.5 p-3">
        {account.avatar_url ? (
          <img src={account.avatar_url} alt="" className="h-10 w-10 rounded-full object-cover" />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#1877f2] to-[#0a5dc2] text-sm font-semibold text-white">
            {(account.display_name || account.username)?.[0]?.toUpperCase() || 'U'}
          </div>
        )}
        <div className="flex flex-col">
          <span className="text-foreground text-sm font-semibold">
            {account.display_name || account.username}
          </span>
          <div className="text-muted-foreground flex items-center gap-1 text-xs">
            <span>{t('dashboard.scheduler.preview.justNow')}</span>
            <span>·</span>
            <Globe className="h-3 w-3" />
          </div>
        </div>
        <MoreHorizontal className="text-muted-foreground ml-auto h-5 w-5" />
      </div>

      {/* Caption */}
      {caption && (
        <div className="px-3 pb-3">
          <p className="text-foreground text-sm leading-[1.4]">{caption}</p>
        </div>
      )}

      {/* Media */}
      {hasMedia && firstMedia && (
        <div className="relative">
          <MediaPreview media={firstMedia} aspectRatio="aspect-video" />
          {media.length > 1 && <MultipleMediaBadge count={media.length} />}
        </div>
      )}

      {/* Actions */}
      <div className="text-muted-foreground border-border flex items-center justify-around border-t px-3 py-2.5">
        <div className="flex items-center gap-1.5 text-sm">
          <ThumbsUp className="h-4 w-4" />
          <span>{t('dashboard.scheduler.preview.actions.like')}</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm">
          <MessageCircle className="h-4 w-4" />
          <span>{t('dashboard.scheduler.preview.actions.comment')}</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm">
          <Share2 className="h-4 w-4" />
          <span>{t('dashboard.scheduler.preview.actions.share')}</span>
        </div>
      </div>
    </div>
  )
}

// TikTok Preview
function TikTokSchedulerPreview({
  account,
  caption,
  media,
}: {
  account: PostSocialAccount
  caption: string
  media: PostMediaItem[]
}) {
  const hasMedia = media.length > 0
  const firstMedia = media[0]
  const isVideo = firstMedia?.mediaType === 'video'

  return (
    <div className="relative overflow-hidden rounded-2xl bg-black">
      {/* Video/Image with gradient */}
      <div className="relative aspect-[9/16] max-h-[300px]">
        {hasMedia && firstMedia ? (
          <>
            {isVideo ? (
              <video
                src={firstMedia.url}
                className="h-full w-full object-cover"
                muted
                preload="metadata"
              />
            ) : (
              <img src={firstMedia.url} alt="" className="h-full w-full object-cover" />
            )}
          </>
        ) : (
          <div className="flex h-full items-center justify-center">
            <PlatformIcon platform="tiktok" size="lg" showBackground />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />

        {/* Right sidebar actions */}
        <div className="absolute right-2 bottom-16 flex flex-col items-center gap-4">
          <div className="flex flex-col items-center">
            <Heart className="h-6 w-6 text-white" />
            <span className="text-xs text-white">0</span>
          </div>
          <div className="flex flex-col items-center">
            <MessageCircle className="h-6 w-6 text-white" />
            <span className="text-xs text-white">0</span>
          </div>
          <div className="flex flex-col items-center">
            <Bookmark className="h-6 w-6 text-white" />
            <span className="text-xs text-white">0</span>
          </div>
          <div className="flex flex-col items-center">
            <Share2 className="h-6 w-6 text-white" />
            <span className="text-xs text-white">0</span>
          </div>
        </div>

        {/* Bottom info */}
        <div className="absolute right-0 bottom-4 left-0 px-3">
          <div className="flex items-center gap-2">
            {account.avatar_url ? (
              <img
                src={account.avatar_url}
                alt=""
                className="h-8 w-8 rounded-full border-2 border-white object-cover"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-[#ff0050] to-[#00f2ea] text-xs font-bold text-white">
                {account.username?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
            <span className="text-sm font-semibold text-white">@{account.username}</span>
          </div>
          {caption && <p className="mt-2 line-clamp-2 text-sm text-white">{caption}</p>}
        </div>
      </div>
    </div>
  )
}

// YouTube Preview
function YouTubeSchedulerPreview({
  account,
  caption,
  media,
}: {
  account: PostSocialAccount
  caption: string
  media: PostMediaItem[]
}) {
  const hasMedia = media.length > 0
  const firstMedia = media[0]
  const isVideo = firstMedia?.mediaType === 'video'

  return (
    <div className="bg-card border-border overflow-hidden rounded-2xl border">
      {/* Thumbnail */}
      <div className="relative aspect-video">
        {hasMedia && firstMedia ? (
          <>
            {isVideo ? (
              <video
                src={firstMedia.url}
                className="h-full w-full object-cover"
                muted
                preload="metadata"
              />
            ) : (
              <img src={firstMedia.url} alt="" className="h-full w-full object-cover" />
            )}
            {isVideo && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/60">
                  <Play className="h-6 w-6 fill-current text-white" />
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-muted flex h-full items-center justify-center">
            <PlatformIcon platform="youtube" size="lg" showBackground />
          </div>
        )}
        {/* Duration badge */}
        <div className="absolute right-2 bottom-2 rounded bg-black/80 px-1 py-0.5 text-xs font-medium text-white">
          0:00
        </div>
      </div>

      {/* Info */}
      <div className="flex gap-3 p-3">
        {account.avatar_url ? (
          <img src={account.avatar_url} alt="" className="h-9 w-9 rounded-full object-cover" />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ff0000] text-sm font-semibold text-white">
            {(account.display_name || account.username)?.[0]?.toUpperCase() || 'U'}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h4 className="text-foreground line-clamp-2 text-sm leading-tight font-medium">
            {caption || 'Untitled video'}
          </h4>
          <p className="text-muted-foreground mt-1 text-xs">
            {account.display_name || account.username}
          </p>
        </div>
      </div>
    </div>
  )
}

// Pinterest Preview
function PinterestSchedulerPreview({
  account,
  caption,
  media,
}: {
  account: PostSocialAccount
  caption: string
  media: PostMediaItem[]
}) {
  const hasMedia = media.length > 0
  const firstMedia = media[0]

  return (
    <div className="bg-card border-border overflow-hidden rounded-2xl border">
      {/* Pin image */}
      <div className="relative aspect-[2/3] max-h-[250px]">
        {hasMedia && firstMedia ? (
          <img src={firstMedia.url} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="bg-muted flex h-full items-center justify-center">
            <PlatformIcon platform="pinterest" size="lg" showBackground />
          </div>
        )}
        {/* Save button */}
        <button
          type="button"
          className="absolute top-2 right-2 rounded-full bg-[#e60023] px-4 py-2 text-sm font-semibold text-white"
        >
          Save
        </button>
        {media.length > 1 && <MultipleMediaBadge count={media.length} />}
      </div>

      {/* Info */}
      <div className="p-3">
        {caption && <p className="text-foreground line-clamp-2 text-sm font-medium">{caption}</p>}
        <div className="mt-2 flex items-center gap-2">
          {account.avatar_url ? (
            <img src={account.avatar_url} alt="" className="h-6 w-6 rounded-full object-cover" />
          ) : (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#e60023] text-xs font-semibold text-white">
              {account.username?.[0]?.toUpperCase() || 'U'}
            </div>
          )}
          <span className="text-muted-foreground text-xs">{account.username}</span>
        </div>
      </div>
    </div>
  )
}

// Generic Preview for Threads, Bluesky, etc.
function GenericSchedulerPreview({
  platform,
  account,
  caption,
  media,
}: {
  platform: SocialPlatform
  account: PostSocialAccount
  caption: string
  media: PostMediaItem[]
}) {
  const hasMedia = media.length > 0
  const firstMedia = media[0]

  return (
    <div className="bg-card border-border overflow-hidden rounded-2xl border">
      <div className="p-4">
        <div className="mb-3 flex items-center gap-3">
          <PlatformIcon platform={platform} size="md" showBackground />
          <div>
            <span className="text-foreground text-sm font-medium">
              {account.display_name || account.username}
            </span>
            <p className="text-muted-foreground text-xs">@{account.username}</p>
          </div>
        </div>

        {caption && <p className="text-foreground text-sm leading-[1.4]">{caption}</p>}
      </div>

      {/* Media */}
      {hasMedia && firstMedia && (
        <div className="relative">
          <MediaPreview media={firstMedia} aspectRatio="aspect-video" />
          {media.length > 1 && <MultipleMediaBadge count={media.length} />}
        </div>
      )}
    </div>
  )
}
