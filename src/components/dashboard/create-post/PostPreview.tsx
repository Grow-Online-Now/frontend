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

interface PostPreviewProps {
  selectedPlatform: SocialPlatform
  onPlatformChange: (platform: SocialPlatform) => void
  availablePlatforms: SocialPlatform[]
  accounts: Connection[]
  media: MediaFile[]
  caption: string
  className?: string
}

export function PostPreview({
  selectedPlatform,
  onPlatformChange,
  availablePlatforms,
  accounts,
  media,
  caption,
  className,
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
        <h3 className="text-muted-foreground text-[11px] font-medium tracking-wide uppercase">
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
          <div className="rounded-2xl border border-[#dbdbdb] bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
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
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#FA7E1E] to-[#D62976] p-[2px]">
          <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-[10px] font-semibold text-black">
            {account?.platformUsername?.[0]?.toUpperCase() || 'U'}
          </div>
        </div>
        <span className="text-[13px] font-semibold text-black">
          {account?.platformUsername || 'username'}
        </span>
        <MoreHorizontal className="ml-auto h-4 w-4 text-black" />
      </div>

      {/* Media */}
      <div className="aspect-square bg-neutral-100">
        {media ? (
          media.type === 'video' ? (
            <video src={media.url} className="h-full w-full object-cover" />
          ) : (
            <img src={media.url} alt="" className="h-full w-full object-cover" />
          )
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-neutral-400">
            No media
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 p-3 text-black">
        <Heart className="h-6 w-6" />
        <MessageCircle className="h-6 w-6" />
        <Send className="h-6 w-6" />
        <Bookmark className="ml-auto h-6 w-6" />
      </div>

      {/* Caption */}
      {caption && (
        <div className="px-3 pb-3">
          <p className="text-[13px] leading-[1.4] text-black">
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
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0A66C2] text-sm font-semibold text-white">
          {account?.displayName?.[0]?.toUpperCase() ||
            account?.platformUsername?.[0]?.toUpperCase() ||
            'U'}
        </div>
        <div className="flex flex-col">
          <span className="text-[13px] font-semibold text-black">
            {account?.displayName || account?.platformUsername || 'User Name'}
          </span>
          <span className="text-[11px] text-neutral-500">Just now</span>
        </div>
      </div>

      {/* Caption */}
      {caption && (
        <div className="px-3 pb-2">
          <p className="text-[13px] leading-[1.4] text-black">{caption}</p>
        </div>
      )}

      {/* Media */}
      {media && (
        <div className="bg-neutral-100">
          {media.type === 'video' ? (
            <video src={media.url} className="w-full" />
          ) : (
            <img src={media.url} alt="" className="w-full" />
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-around border-t border-neutral-200 px-3 py-2 text-neutral-600">
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
}: {
  account?: Connection
  media?: MediaFile
  caption: string
}) {
  return (
    <div className="overflow-hidden rounded-2xl p-3">
      <div className="flex gap-2.5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black text-sm font-semibold text-white">
          {account?.platformUsername?.[0]?.toUpperCase() || 'U'}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[14px] font-bold text-black">
              {account?.displayName || account?.platformUsername || 'Display Name'}
            </span>
            <span className="text-[13px] text-neutral-500">
              @{account?.platformUsername || 'username'}
            </span>
          </div>

          {caption && <p className="mt-1 text-[14px] leading-[1.4] text-black">{caption}</p>}

          {media && (
            <div className="mt-2 overflow-hidden rounded-xl bg-neutral-100">
              {media.type === 'video' ? (
                <video src={media.url} className="w-full" />
              ) : (
                <img src={media.url} alt="" className="w-full" />
              )}
            </div>
          )}
        </div>
      </div>
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
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1877F2] text-sm font-semibold text-white">
          {account?.displayName?.[0]?.toUpperCase() ||
            account?.platformUsername?.[0]?.toUpperCase() ||
            'U'}
        </div>
        <div className="flex flex-col">
          <span className="text-[14px] font-semibold text-black">
            {account?.displayName || account?.platformUsername || 'Page Name'}
          </span>
          <span className="text-[12px] text-neutral-500">Just now</span>
        </div>
      </div>

      {/* Caption */}
      {caption && (
        <div className="px-3 pb-2">
          <p className="text-[14px] leading-[1.4] text-black">{caption}</p>
        </div>
      )}

      {/* Media */}
      {media && (
        <div className="bg-neutral-100">
          {media.type === 'video' ? (
            <video src={media.url} className="w-full" />
          ) : (
            <img src={media.url} alt="" className="w-full" />
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-around border-t border-neutral-200 px-3 py-2.5 text-neutral-600">
        <div className="flex items-center gap-1.5 text-[13px]">
          <ThumbsUp className="h-4 w-4" /> Like
        </div>
        <div className="flex items-center gap-1.5 text-[13px]">
          <MessageCircle className="h-4 w-4" /> Comment
        </div>
        <div className="flex items-center gap-1.5 text-[13px]">
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
        <span className="text-sm font-medium text-black">
          {account?.displayName || account?.platformUsername || 'Account'}
        </span>
      </div>

      {media && (
        <div className="mb-3 overflow-hidden rounded-lg bg-neutral-100">
          {media.type === 'video' ? (
            <video src={media.url} className="w-full" />
          ) : (
            <img src={media.url} alt="" className="w-full" />
          )}
        </div>
      )}

      {caption && <p className="text-[13px] leading-[1.4] text-black">{caption}</p>}
    </div>
  )
}
