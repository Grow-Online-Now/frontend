/**
 * CaptionInput Component
 * Compact textarea for caption input with inline character count
 * Used in media-first flow where caption is secondary to media
 */

import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { PlatformIcon } from '@/components/dashboard/posts/PlatformIcon'
import { PLATFORM_CONFIG, MEDIA_FIRST_PLATFORMS } from '@/config/text-flow'
import type { SocialPlatform } from '@/types/connections'

interface CaptionInputProps {
  value: string
  onChange: (value: string) => void
  selectedPlatformIds: string[]
  platformsMap: Map<string, SocialPlatform>
  placeholderKey?: string
  disabled?: boolean
  className?: string
}

// Format limit display (e.g., 3000 -> 3k)
const formatLimit = (num: number) => {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(num % 1000 === 0 ? 0 : 1)}k`
  }
  return num.toString()
}

export function CaptionInput({
  value,
  onChange,
  selectedPlatformIds,
  platformsMap,
  placeholderKey = 'dashboard.create.media.caption.placeholder',
  disabled,
  className,
}: CaptionInputProps) {
  const { t } = useTranslation()
  const charCount = value.length

  // Get the most restrictive platform(s) to display character count
  const displayPlatforms = useMemo(() => {
    if (selectedPlatformIds.length === 0 || !platformsMap) {
      return []
    }

    // Get unique media-first platforms from selected IDs
    const selectedPlatforms = new Set<SocialPlatform>()
    selectedPlatformIds.forEach((id) => {
      const platform = platformsMap.get(id)
      if (platform && MEDIA_FIRST_PLATFORMS.includes(platform)) {
        selectedPlatforms.add(platform)
      }
    })

    // Sort by character limit (most restrictive first) and take top 2
    return Array.from(selectedPlatforms)
      .sort((a, b) => PLATFORM_CONFIG[a].characterLimit - PLATFORM_CONFIG[b].characterLimit)
      .slice(0, 2)
  }, [selectedPlatformIds, platformsMap])

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex items-center justify-between">
        <label className="text-text-secondary text-sm font-medium">
          {t('dashboard.create.media.caption.label')}
        </label>

        {/* Character counts for selected platforms */}
        {displayPlatforms.length > 0 && (
          <div className="flex items-center gap-3">
            {displayPlatforms.map((platform) => {
              const config = PLATFORM_CONFIG[platform]
              const limit = config.characterLimit
              const percentage = (charCount / limit) * 100

              // Determine color: muted default, warning at 90%, error when over
              let colorClass = 'text-text-muted'
              if (percentage >= 100) {
                colorClass = 'text-error'
              } else if (percentage >= 90) {
                colorClass = 'text-warning'
              }

              return (
                <div
                  key={platform}
                  className={cn(
                    'flex items-center gap-1.5 transition-colors duration-150',
                    colorClass
                  )}
                >
                  <PlatformIcon platform={platform} size="xs" />
                  <span className="font-mono text-xs tabular-nums">
                    {charCount}/{formatLimit(limit)}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t(placeholderKey)}
        disabled={disabled}
        className={cn(
          'min-h-[80px] w-full resize-none rounded-lg border p-3',
          'bg-bg-base border-border',
          'text-text-primary text-sm leading-relaxed',
          'focus:border-border-emphasis focus:ring-0 focus:outline-none',
          'placeholder:text-text-muted',
          'disabled:cursor-not-allowed disabled:opacity-50'
        )}
      />
    </div>
  )
}
