/**
 * PostPreview Component
 * Live preview of post appearance on different platforms
 */

import { useTranslation } from 'react-i18next'
import {
  MoreHorizontal,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  ThumbsUp,
  Share2,
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PlatformIcon } from '@/components/dashboard/posts/PlatformIcon'
import { cn } from '@/lib/utils'
import type { SocialPlatform, Connection } from '@/types/connections'
import type { MediaFile } from './MediaUploader'
import type { TwitterThreadTweet, TwitterFirstComment } from '@/types/posts'

interface PostPreviewProps {
  selectedPlatform: SocialPlatform
  onPlatformChange: (platform: SocialPlatform) => void
  availablePlatforms: SocialPlatform[]
  accounts: Connection[]
  media: MediaFile[]
  caption: string
  className?: string
  // Twitter thread props
  twitterThread?: TwitterThreadTweet[]
  twitterFirstComment?: TwitterFirstComment | null
}

export function PostPreview({
  selectedPlatform,
  onPlatformChange,
  availablePlatforms,
  accounts,
  media,
  caption,
  className,
  twitterThread = [],
  twitterFirstComment,
}: PostPreviewProps) {
  const { t } = useTranslation()

  const account = accounts.find((a) => a.platform === selectedPlatform)
  const firstMedia = media[0]

  const truncateCaption = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + '...'
  }

  return (
    <div className={cn('bg-card border-border-subtle rounded-xl border', className)}>
      {/* Header */}
      <div className="border-border-subtle flex items-center justify-between border-b px-4 py-3">
        <h3 className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          {t('dashboard.createPost.preview.title')}
        </h3>
        {availablePlatforms.length > 1 && (
          <Select
            value={selectedPlatform}
            onValueChange={(v) => onPlatformChange(v as SocialPlatform)}
          >
            <SelectTrigger className="h-8 w-auto gap-2 border-0 bg-transparent px-2 text-sm shadow-none">
              <PlatformIcon platform={selectedPlatform} size="xs" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availablePlatforms.map((platform) => (
                <SelectItem key={platform} value={platform}>
                  <div className="flex items-center gap-2">
                    <PlatformIcon platform={platform} size="xs" />
                    {t(`dashboard.accounts.platforms.${platform}`)}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Preview Area */}
      <div className="flex items-center justify-center p-5">
        <div className="w-full max-w-[280px]">
          <div className="border-border bg-card rounded-2xl border shadow-sm">
            {selectedPlatform === 'instagram' && (
              <InstagramPreview
                account={account}
                media={firstMedia}
                caption={truncateCaption(caption, 150)}
              />
            )}
            {selectedPlatform === 'linkedin' && (
              <LinkedInPreview
                account={account}
                media={firstMedia}
                caption={truncateCaption(caption, 200)}
              />
            )}
            {selectedPlatform === 'twitter' && (
              <TwitterPreview
                account={account}
                media={firstMedia}
                caption={truncateCaption(caption, 280)}
                thread={twitterThread}
                firstComment={twitterFirstComment}
              />
            )}
            {selectedPlatform === 'facebook' && (
              <FacebookPreview
                account={account}
                media={firstMedia}
                caption={truncateCaption(caption, 200)}
              />
            )}
            {(selectedPlatform === 'tiktok' ||
              selectedPlatform === 'youtube' ||
              selectedPlatform === 'pinterest') && (
              <GenericPreview
                platform={selectedPlatform}
                account={account}
                media={firstMedia}
                caption={truncateCaption(caption, 150)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Stats placeholder */}
      <div className="border-border-subtle space-y-2 border-t px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-xs">
            {t('dashboard.createPost.preview.bestTime')}
          </span>
          <span className="text-foreground text-xs font-medium">
            {t('dashboard.createPost.preview.bestTimeValue')}
          </span>
        </div>
      </div>
    </div>
  )
}

// Instagram Preview
function InstagramPreview({
  account,
  media,
  caption,
}: {
  account?: Connection
  media?: MediaFile
  caption: string
}) {
  return (
    <div className="overflow-hidden rounded-2xl">
      {/* Header */}
      <div className="flex items-center gap-2.5 p-3">
        <div className="h-8 w-8 rounded-full bg-[var(--platform-instagram)] p-[1px]">
          <div className="bg-background text-foreground flex h-full w-full items-center justify-center rounded-full text-xs font-semibold">
            {account?.platformUsername?.[0]?.toUpperCase() || 'U'}
          </div>
        </div>
        <span className="text-foreground text-sm font-semibold">
          {account?.platformUsername || 'username'}
        </span>
        <MoreHorizontal className="text-foreground ml-auto h-4 w-4" />
      </div>

      {/* Media */}
      <div className="bg-muted aspect-square">
        {media ? (
          media.type === 'video' ? (
            <video src={media.url} className="h-full w-full object-cover" />
          ) : (
            <img src={media.url} alt="" className="h-full w-full object-cover" />
          )
        ) : (
          <div className="text-muted-foreground flex h-full items-center justify-center text-xs">
            No media
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="text-foreground flex items-center gap-4 p-3">
        <Heart className="h-6 w-6" />
        <MessageCircle className="h-6 w-6" />
        <Send className="h-6 w-6" />
        <Bookmark className="ml-auto h-6 w-6" />
      </div>

      {/* Caption */}
      {caption && (
        <div className="px-3 pb-3">
          <p className="text-foreground text-sm leading-[1.4]">
            <span className="font-semibold">{account?.platformUsername || 'username'}</span>{' '}
            {caption}
          </p>
        </div>
      )}
    </div>
  )
}

// LinkedIn Preview
function LinkedInPreview({
  account,
  media,
  caption,
}: {
  account?: Connection
  media?: MediaFile
  caption: string
}) {
  return (
    <div className="overflow-hidden rounded-2xl">
      {/* Header */}
      <div className="flex items-center gap-2.5 p-3">
        <div className="text-primary-foreground flex h-10 w-10 items-center justify-center rounded-full bg-[var(--platform-linkedin)] text-sm font-semibold">
          {account?.displayName?.[0]?.toUpperCase() ||
            account?.platformUsername?.[0]?.toUpperCase() ||
            'U'}
        </div>
        <div className="flex flex-col">
          <span className="text-foreground text-sm font-semibold">
            {account?.displayName || account?.platformUsername || 'User Name'}
          </span>
          <span className="text-muted-foreground text-xs">Just now</span>
        </div>
      </div>

      {/* Caption */}
      {caption && (
        <div className="px-3 pb-2">
          <p className="text-foreground text-sm leading-[1.4]">{caption}</p>
        </div>
      )}

      {/* Media */}
      {media && (
        <div className="bg-muted">
          {media.type === 'video' ? (
            <video src={media.url} className="w-full" />
          ) : (
            <img src={media.url} alt="" className="w-full" />
          )}
        </div>
      )}

      {/* Actions */}
      <div className="text-muted-foreground border-border flex items-center justify-around border-t px-3 py-2">
        <div className="flex items-center gap-1 text-xs">
          <ThumbsUp className="h-4 w-4" /> Like
        </div>
        <div className="flex items-center gap-1 text-xs">
          <MessageCircle className="h-4 w-4" /> Comment
        </div>
        <div className="flex items-center gap-1 text-xs">
          <Share2 className="h-4 w-4" /> Share
        </div>
      </div>
    </div>
  )
}

// Twitter Preview
function TwitterPreview({
  account,
  media,
  caption,
  thread = [],
  firstComment,
}: {
  account?: Connection
  media?: MediaFile
  caption: string
  thread?: TwitterThreadTweet[]
  firstComment?: TwitterFirstComment | null
}) {
  const { t } = useTranslation()
  const hasThread = thread.length > 0
  const hasFirstComment = firstComment && firstComment.text.length > 0

  return (
    <div className="overflow-hidden rounded-2xl">
      {/* Thread indicator */}
      {(hasThread || hasFirstComment) && (
        <div className="bg-muted border-border border-b px-3 py-2">
          <div className="text-muted-foreground flex items-center gap-2 text-xs">
            <MessageCircle className="h-3 w-3" />
            {hasThread && (
              <span>
                {t('dashboard.createPost.twitter.thread.summary', { count: thread.length + 1 })}
              </span>
            )}
            {hasThread && hasFirstComment && <span>•</span>}
            {hasFirstComment && <span>{t('dashboard.createPost.twitter.firstComment.title')}</span>}
          </div>
        </div>
      )}

      {/* Main tweet */}
      <div className="p-3">
        <div className="flex gap-2.5">
          <div className="bg-foreground text-background flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
            {account?.platformUsername?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-foreground text-sm font-bold">
                {account?.displayName || account?.platformUsername || 'Display Name'}
              </span>
              <span className="text-muted-foreground text-sm">
                @{account?.platformUsername || 'username'}
              </span>
            </div>

            {caption && <p className="text-foreground mt-1 text-sm leading-[1.4]">{caption}</p>}

            {media && (
              <div className="bg-muted mt-2 overflow-hidden rounded-xl">
                {media.type === 'video' ? (
                  <video src={media.url} className="w-full" />
                ) : (
                  <img src={media.url} alt="" className="w-full" />
                )}
              </div>
            )}

            {/* Thread number indicator */}
            {hasThread && (
              <div className="text-muted-foreground mt-2 text-xs">
                {t('dashboard.createPost.twitter.thread.tweetNumber', {
                  current: 1,
                  total: thread.length + 1,
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Thread preview snippets */}
      {hasThread && thread.length > 0 && (
        <div className="border-border border-t px-3 py-2">
          <div className="space-y-1.5">
            {thread.slice(0, 2).map((tweet) => (
              <div key={tweet.id} className="flex items-start gap-2">
                <div className="bg-muted-foreground/50 mt-0.5 h-1.5 w-1.5 rounded-full" />
                <p className="text-muted-foreground line-clamp-1 text-xs">
                  {tweet.text || t('dashboard.createPost.twitter.thread.placeholder')}
                </p>
              </div>
            ))}
            {thread.length > 2 && (
              <div className="text-muted-foreground text-xs">+{thread.length - 2} more...</div>
            )}
          </div>
        </div>
      )}

      {/* First comment preview */}
      {hasFirstComment && (
        <div className="border-border border-t px-3 py-2">
          <div className="flex items-start gap-2">
            <MessageCircle className="text-muted-foreground mt-0.5 h-3 w-3" />
            <p className="text-muted-foreground line-clamp-2 text-xs">{firstComment.text}</p>
          </div>
        </div>
      )}
    </div>
  )
}

// Facebook Preview
function FacebookPreview({
  account,
  media,
  caption,
}: {
  account?: Connection
  media?: MediaFile
  caption: string
}) {
  return (
    <div className="overflow-hidden rounded-2xl">
      {/* Header */}
      <div className="flex items-center gap-2.5 p-3">
        <div className="text-primary-foreground flex h-10 w-10 items-center justify-center rounded-full bg-[var(--platform-facebook)] text-sm font-semibold">
          {account?.displayName?.[0]?.toUpperCase() ||
            account?.platformUsername?.[0]?.toUpperCase() ||
            'U'}
        </div>
        <div className="flex flex-col">
          <span className="text-foreground text-sm font-semibold">
            {account?.displayName || account?.platformUsername || 'Page Name'}
          </span>
          <span className="text-muted-foreground text-xs">Just now</span>
        </div>
      </div>

      {/* Caption */}
      {caption && (
        <div className="px-3 pb-2">
          <p className="text-foreground text-sm leading-[1.4]">{caption}</p>
        </div>
      )}

      {/* Media */}
      {media && (
        <div className="bg-muted">
          {media.type === 'video' ? (
            <video src={media.url} className="w-full" />
          ) : (
            <img src={media.url} alt="" className="w-full" />
          )}
        </div>
      )}

      {/* Actions */}
      <div className="text-muted-foreground border-border flex items-center justify-around border-t px-3 py-2.5">
        <div className="flex items-center gap-1.5 text-sm">
          <ThumbsUp className="h-4 w-4" /> Like
        </div>
        <div className="flex items-center gap-1.5 text-sm">
          <MessageCircle className="h-4 w-4" /> Comment
        </div>
        <div className="flex items-center gap-1.5 text-sm">
          <Share2 className="h-4 w-4" /> Share
        </div>
      </div>
    </div>
  )
}

// Generic Preview for other platforms
function GenericPreview({
  platform,
  account,
  media,
  caption,
}: {
  platform: SocialPlatform
  account?: Connection
  media?: MediaFile
  caption: string
}) {
  return (
    <div className="overflow-hidden rounded-2xl p-4">
      <div className="mb-3 flex items-center gap-2">
        <PlatformIcon platform={platform} size="sm" showBackground />
        <span className="text-foreground text-sm font-medium">
          {account?.displayName || account?.platformUsername || 'Account'}
        </span>
      </div>

      {media && (
        <div className="bg-muted mb-3 overflow-hidden rounded-lg">
          {media.type === 'video' ? (
            <video src={media.url} className="w-full" />
          ) : (
            <img src={media.url} alt="" className="w-full" />
          )}
        </div>
      )}

      {caption && <p className="text-foreground text-sm leading-[1.4]">{caption}</p>}
    </div>
  )
}
