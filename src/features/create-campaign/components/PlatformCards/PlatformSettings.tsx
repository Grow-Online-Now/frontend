/**
 * PlatformSettings Component
 * Expandable platform-specific settings within a card
 */

import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDown, Hash, MessageCircle, AtSign } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SocialPlatform } from '@/types/connections'
import type { PlatformConfigurations } from '@/types/posts'

interface PlatformSettingsProps {
  platform: SocialPlatform
  settings: PlatformConfigurations[keyof PlatformConfigurations]
  onSettingsChange: (settings: PlatformConfigurations[keyof PlatformConfigurations]) => void
  disabled?: boolean
}

export function PlatformSettings({
  platform,
  settings: _settings,
  onSettingsChange: _onSettingsChange,
  disabled,
}: PlatformSettingsProps) {
  // TODO: Wire up settings state management
  void _settings
  void _onSettingsChange
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev)
  }, [])

  // Determine which settings to show based on platform
  const hasSettings = ['instagram', 'tiktok', 'youtube', 'twitter', 'linkedin'].includes(platform)

  if (!hasSettings) {
    return null
  }

  return (
    <div className="border-border-subtle mt-3 border-t pt-3">
      <button
        onClick={toggleExpanded}
        disabled={disabled}
        className={cn(
          'text-muted-foreground flex w-full items-center justify-between text-xs',
          'hover:text-foreground campaign-transition-fast',
          'focus-visible:ring-primary rounded focus:outline-none focus-visible:ring-2',
          disabled && 'cursor-not-allowed opacity-50'
        )}
        aria-expanded={isExpanded}
        aria-controls={`platform-settings-${platform}`}
      >
        <span className="font-medium">{t('dashboard.campaign.platformCard.settings.title')}</span>
        <ChevronDown
          className={cn('campaign-transition-base h-4 w-4', isExpanded && 'rotate-180')}
        />
      </button>

      <div
        id={`platform-settings-${platform}`}
        className={cn('campaign-expand mt-2', isExpanded && 'campaign-expand-open')}
      >
        <div className="campaign-expand-content space-y-3">
          {/* Hashtags input (for platforms that support it) */}
          {['instagram', 'tiktok', 'twitter', 'linkedin'].includes(platform) && (
            <div className="space-y-1.5">
              <label className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
                <Hash className="h-3 w-3" />
                {t('dashboard.campaign.platformCard.settings.hashtags')}
              </label>
              <input
                type="text"
                placeholder={t('dashboard.campaign.platformCard.settings.hashtagsPlaceholder')}
                className={cn(
                  'w-full rounded-md px-2.5 py-1.5 text-xs',
                  'border-border-subtle bg-surface border',
                  'focus:ring-primary focus:border-transparent focus:ring-2 focus:outline-none',
                  'placeholder:text-muted-foreground/50'
                )}
                disabled={disabled}
              />
            </div>
          )}

          {/* First comment (Instagram) */}
          {platform === 'instagram' && (
            <div className="space-y-1.5">
              <label className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
                <MessageCircle className="h-3 w-3" />
                {t('dashboard.campaign.platformCard.settings.firstComment')}
              </label>
              <input
                type="text"
                placeholder={t('dashboard.campaign.platformCard.settings.firstCommentPlaceholder')}
                className={cn(
                  'w-full rounded-md px-2.5 py-1.5 text-xs',
                  'border-border-subtle bg-surface border',
                  'focus:ring-primary focus:border-transparent focus:ring-2 focus:outline-none',
                  'placeholder:text-muted-foreground/50'
                )}
                disabled={disabled}
              />
            </div>
          )}

          {/* Alt text (for accessibility) */}
          {['instagram', 'twitter', 'linkedin'].includes(platform) && (
            <div className="space-y-1.5">
              <label className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
                <AtSign className="h-3 w-3" />
                {t('dashboard.campaign.platformCard.settings.altText')}
              </label>
              <input
                type="text"
                placeholder={t('dashboard.campaign.platformCard.settings.altTextPlaceholder')}
                className={cn(
                  'w-full rounded-md px-2.5 py-1.5 text-xs',
                  'border-border-subtle bg-surface border',
                  'focus:ring-primary focus:border-transparent focus:ring-2 focus:outline-none',
                  'placeholder:text-muted-foreground/50'
                )}
                disabled={disabled}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
