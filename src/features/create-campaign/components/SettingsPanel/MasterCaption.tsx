/**
 * MasterCaption Component
 * Source caption that syncs to all linked platform captions
 */

import { useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Link2, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import type { SocialPlatform } from '@/types/connections'
import { PLATFORM_CHARACTER_LIMITS } from '@/types/posts'

interface MasterCaptionProps {
  value: string
  onChange: (value: string) => void
  includedPlatforms: SocialPlatform[]
  syncedCount: number
  totalCount: number
  onAiAssist?: () => void
  disabled?: boolean
}

export function MasterCaption({
  value,
  onChange,
  includedPlatforms,
  syncedCount,
  totalCount,
  onAiAssist,
  disabled,
}: MasterCaptionProps) {
  const { t } = useTranslation()

  // Calculate the most restrictive character limit
  const characterLimit = useMemo(() => {
    if (includedPlatforms.length === 0) {
      return PLATFORM_CHARACTER_LIMITS.twitter // Default to most restrictive
    }
    return Math.min(...includedPlatforms.map((p) => PLATFORM_CHARACTER_LIMITS[p]))
  }, [includedPlatforms])

  const charCount = value.length
  const charPercentage = (charCount / characterLimit) * 100

  const charCountState = useMemo(() => {
    if (charPercentage > 100) return 'error'
    if (charPercentage > 90) return 'warning'
    return 'normal'
  }, [charPercentage])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value)
    },
    [onChange]
  )

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
          {t('dashboard.campaign.masterCaption.title')}
        </h3>
        <div className="text-primary flex items-center gap-1 text-xs">
          <Link2 className="h-3 w-3" />
          <span>
            {t('dashboard.campaign.masterCaption.syncStatus', {
              synced: syncedCount,
              total: totalCount,
            })}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-muted-foreground text-xs">
        {t('dashboard.campaign.masterCaption.description')}
      </p>

      {/* Textarea */}
      <div className="relative">
        <textarea
          value={value}
          onChange={handleChange}
          placeholder={t('dashboard.campaign.masterCaption.placeholder')}
          disabled={disabled}
          rows={5}
          className={cn(
            'w-full resize-none rounded-lg px-3 py-2.5 text-sm',
            'border-border bg-surface border',
            'focus:ring-primary focus:border-transparent focus:ring-2 focus:outline-none',
            'placeholder:text-muted-foreground/50',
            'campaign-transition-fast',
            disabled && 'cursor-not-allowed opacity-50'
          )}
          aria-label={t('dashboard.campaign.masterCaption.ariaLabel')}
        />

        {/* AI Assist button */}
        {onAiAssist && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onAiAssist}
            disabled={disabled}
            className="absolute right-2 bottom-2 h-7 gap-1 text-xs"
          >
            <Sparkles className="h-3 w-3" />
            {t('dashboard.campaign.masterCaption.aiAssist')}
          </Button>
        )}
      </div>

      {/* Character count and progress */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            {includedPlatforms.length > 0
              ? t('dashboard.campaign.masterCaption.limitInfo', {
                  platform: includedPlatforms.reduce((min, p) =>
                    PLATFORM_CHARACTER_LIMITS[p] < PLATFORM_CHARACTER_LIMITS[min] ? p : min
                  ),
                })
              : t('dashboard.campaign.masterCaption.noLimit')}
          </span>
          <span
            className={cn('campaign-char-count font-medium', {
              'campaign-char-count-normal': charCountState === 'normal',
              'campaign-char-count-warning': charCountState === 'warning',
              'campaign-char-count-error': charCountState === 'error',
            })}
          >
            {charCount.toLocaleString()} / {characterLimit.toLocaleString()}
          </span>
        </div>

        {/* Progress bar */}
        <div className="bg-muted h-1 overflow-hidden rounded-full">
          <div
            className={cn('h-full transition-all duration-200', {
              'bg-muted-foreground': charCountState === 'normal',
              'bg-warning': charCountState === 'warning',
              'bg-destructive': charCountState === 'error',
            })}
            style={{ width: `${Math.min(charPercentage, 100)}%` }}
          />
        </div>
      </div>
    </div>
  )
}
