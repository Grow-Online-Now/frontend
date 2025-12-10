/**
 * CaptionEditor Component
 * Caption textarea within a platform card with sync indicator
 */

import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link2, Pencil } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SocialPlatform } from '@/types/connections'
import { PLATFORM_CHARACTER_LIMITS } from '@/types/posts'

interface CaptionEditorProps {
  platform: SocialPlatform
  caption: string
  isSynced: boolean
  masterCaption: string
  onCaptionChange: (caption: string) => void
  onToggleSync: () => void
  disabled?: boolean
}

export function CaptionEditor({
  platform,
  caption,
  isSynced,
  masterCaption,
  onCaptionChange,
  onToggleSync,
  disabled,
}: CaptionEditorProps) {
  const { t } = useTranslation()
  const characterLimit = PLATFORM_CHARACTER_LIMITS[platform]
  const displayCaption = isSynced ? masterCaption : caption
  const charCount = displayCaption.length
  const charPercentage = (charCount / characterLimit) * 100

  const charCountState = useMemo(() => {
    if (charPercentage > 100) return 'error'
    if (charPercentage > 90) return 'warning'
    return 'normal'
  }, [charPercentage])

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      // If synced, clicking to edit should unsync first
      if (isSynced) {
        onToggleSync()
      }
      onCaptionChange(e.target.value)
    },
    [isSynced, onToggleSync, onCaptionChange]
  )

  const handleSyncToggle = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      onToggleSync()
    },
    [onToggleSync]
  )

  return (
    <div className="space-y-2">
      {/* Header with sync indicator */}
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-xs font-medium">
          {t('dashboard.campaign.platformCard.caption.label')}
        </span>
        <button
          onClick={handleSyncToggle}
          className={cn(
            'flex items-center gap-1 rounded-full px-2 py-0.5 text-xs',
            'campaign-transition-fast',
            'focus-visible:ring-primary focus:outline-none focus-visible:ring-2',
            isSynced
              ? 'bg-primary/10 text-primary hover:bg-primary/20'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          )}
          aria-label={
            isSynced
              ? t('dashboard.campaign.platformCard.caption.unlink')
              : t('dashboard.campaign.platformCard.caption.link')
          }
          disabled={disabled}
        >
          {isSynced ? (
            <>
              <Link2 className="h-3 w-3" />
              <span>{t('dashboard.campaign.platformCard.caption.synced')}</span>
            </>
          ) : (
            <>
              <Pencil className="h-3 w-3" />
              <span>{t('dashboard.campaign.platformCard.caption.custom')}</span>
            </>
          )}
        </button>
      </div>

      {/* Caption textarea */}
      <div className="relative">
        <textarea
          value={displayCaption}
          onChange={handleTextChange}
          placeholder={t('dashboard.campaign.platformCard.caption.placeholder')}
          disabled={disabled || isSynced}
          rows={3}
          className={cn(
            'w-full resize-none rounded-lg px-3 py-2 text-sm',
            'border-border-subtle border',
            'focus:ring-primary focus:border-transparent focus:ring-2 focus:outline-none',
            'placeholder:text-muted-foreground/50',
            'campaign-transition-fast',
            isSynced ? 'campaign-caption-synced cursor-not-allowed' : 'campaign-caption-editable',
            disabled && 'opacity-50'
          )}
          aria-label={t('dashboard.campaign.platformCard.caption.ariaLabel', {
            platform,
          })}
        />

        {/* Synced overlay hint */}
        {isSynced && (
          <div
            className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-lg"
            onClick={handleSyncToggle}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onToggleSync()
              }
            }}
            aria-label={t('dashboard.campaign.platformCard.caption.clickToEdit')}
          >
            {!displayCaption && (
              <span className="text-muted-foreground text-xs">
                {t('dashboard.campaign.platformCard.caption.syncedEmpty')}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Character count */}
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-xs">
          {isSynced && t('dashboard.campaign.platformCard.caption.usingMaster')}
        </span>
        <span
          className={cn('campaign-char-count', {
            'campaign-char-count-normal': charCountState === 'normal',
            'campaign-char-count-warning': charCountState === 'warning',
            'campaign-char-count-error': charCountState === 'error',
          })}
        >
          {charCount.toLocaleString()} / {characterLimit.toLocaleString()}
        </span>
      </div>

      {/* Character limit progress bar */}
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
  )
}
