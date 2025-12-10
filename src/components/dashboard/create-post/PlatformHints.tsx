/**
 * PlatformHints Component
 * Dynamic hints based on selected platforms and content
 */

import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Info, AlertTriangle, XCircle, Lightbulb } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PLATFORM_CHARACTER_LIMITS } from '@/types/posts'
import type { SocialPlatform } from '@/types/connections'
import type { MediaFile } from './MediaUploader'

type HintType = 'info' | 'warning' | 'error' | 'tip'

interface Hint {
  type: HintType
  messageKey: string
  messageParams?: Record<string, string | number>
}

interface PlatformHintsProps {
  selectedPlatforms: SocialPlatform[]
  media: MediaFile[]
  caption: string
  className?: string
}

// Platforms that require media
const MEDIA_REQUIRED_PLATFORMS: SocialPlatform[] = ['instagram', 'tiktok', 'youtube', 'pinterest']

const HINT_ICONS: Record<HintType, typeof Info> = {
  info: Info,
  warning: AlertTriangle,
  error: XCircle,
  tip: Lightbulb,
}

const HINT_STYLES: Record<HintType, string> = {
  info: 'bg-info/10 text-info',
  warning: 'bg-warning/10 text-warning',
  error: 'bg-destructive/10 text-destructive',
  tip: 'bg-success/10 text-success',
}

export function PlatformHints({
  selectedPlatforms,
  media,
  caption,
  className,
}: PlatformHintsProps) {
  const { t } = useTranslation()

  const hints = useMemo(() => {
    const result: Hint[] = []

    if (selectedPlatforms.length === 0) {
      return result
    }

    // Check media requirements
    const mediaRequiredPlatforms = selectedPlatforms.filter((p) =>
      MEDIA_REQUIRED_PLATFORMS.includes(p)
    )

    if (mediaRequiredPlatforms.length > 0 && media.length === 0) {
      result.push({
        type: 'error',
        messageKey: 'dashboard.createPost.hints.mediaRequired',
        messageParams: {
          platforms: mediaRequiredPlatforms
            .map((p) => t(`dashboard.accounts.platforms.${p}`))
            .join(', '),
        },
      })
    }

    // Check caption length for each platform
    selectedPlatforms.forEach((platform) => {
      const limit = PLATFORM_CHARACTER_LIMITS[platform]
      if (caption.length > limit) {
        result.push({
          type: 'error',
          messageKey: 'dashboard.createPost.hints.captionExceeds',
          messageParams: {
            platform: t(`dashboard.accounts.platforms.${platform}`),
            excess: caption.length - limit,
          },
        })
      } else if (caption.length > limit * 0.9) {
        result.push({
          type: 'warning',
          messageKey: 'dashboard.createPost.hints.captionNearLimit',
          messageParams: {
            platform: t(`dashboard.accounts.platforms.${platform}`),
            percent: Math.round((caption.length / limit) * 100),
          },
        })
      }
    })

    // Platform-specific tips
    if (selectedPlatforms.includes('linkedin') && media.length === 0 && caption.length > 0) {
      result.push({
        type: 'tip',
        messageKey: 'dashboard.createPost.hints.linkedinMedia',
      })
    }

    if (selectedPlatforms.includes('twitter') && caption.length > 0 && caption.length < 100) {
      result.push({
        type: 'tip',
        messageKey: 'dashboard.createPost.hints.twitterLength',
      })
    }

    // Video-specific hints
    const hasVideo = media.some((m) => m.type === 'video')
    if (hasVideo && selectedPlatforms.includes('instagram')) {
      result.push({
        type: 'info',
        messageKey: 'dashboard.createPost.hints.instagramReels',
      })
    }

    return result
  }, [selectedPlatforms, media, caption, t])

  if (hints.length === 0) {
    return null
  }

  return (
    <div className={cn('space-y-2', className)}>
      {hints.map((hint, index) => {
        const Icon = HINT_ICONS[hint.type]
        return (
          <div
            key={index}
            className={cn(
              'flex items-start gap-2.5 rounded-xl px-3.5 py-3 text-[13px] leading-relaxed',
              HINT_STYLES[hint.type]
            )}
          >
            <Icon className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{t(hint.messageKey, hint.messageParams)}</span>
          </div>
        )
      })}
    </div>
  )
}
