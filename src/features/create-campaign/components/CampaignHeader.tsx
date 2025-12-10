/**
 * CampaignHeader Component
 * Header with campaign name input and publish actions
 */

import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Send, CalendarClock, Save, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import type { ScheduleType } from '@/types/posts'

interface CampaignHeaderProps {
  campaignName: string
  onCampaignNameChange: (name: string) => void
  scheduleType: ScheduleType
  includedCount: number
  isSubmitting: boolean
  canSubmit: boolean
  onSubmit: () => void
  onBack: () => void
}

export function CampaignHeader({
  campaignName,
  onCampaignNameChange,
  scheduleType,
  includedCount,
  isSubmitting,
  canSubmit,
  onSubmit,
  onBack,
}: CampaignHeaderProps) {
  const { t } = useTranslation()

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onCampaignNameChange(e.target.value)
    },
    [onCampaignNameChange]
  )

  // Determine button text and icon based on schedule type
  const getActionButton = () => {
    const baseProps = {
      onClick: onSubmit,
      disabled: !canSubmit || isSubmitting,
      className: cn('gap-2 campaign-publish-btn', isSubmitting && 'relative overflow-hidden'),
    }

    if (isSubmitting) {
      return (
        <Button {...baseProps}>
          <Loader2 className="h-4 w-4 animate-spin" />
          {t('dashboard.campaign.header.publishing')}
          <div className="campaign-publish-btn-progress" />
        </Button>
      )
    }

    switch (scheduleType) {
      case 'now':
        return (
          <Button {...baseProps}>
            <Send className="h-4 w-4" />
            {includedCount > 0
              ? t('dashboard.campaign.header.postTo', { count: includedCount })
              : t('dashboard.campaign.header.postNow')}
          </Button>
        )
      case 'scheduled':
        return (
          <Button {...baseProps}>
            <CalendarClock className="h-4 w-4" />
            {includedCount > 0
              ? t('dashboard.campaign.header.scheduleTo', { count: includedCount })
              : t('dashboard.campaign.header.schedule')}
          </Button>
        )
      case 'draft':
        return (
          <Button {...baseProps} variant="secondary">
            <Save className="h-4 w-4" />
            {t('dashboard.campaign.header.saveDraft')}
          </Button>
        )
    }
  }

  return (
    <header className="border-border-subtle flex items-center justify-between gap-4 border-b pb-6">
      {/* Left side: Back button and campaign name */}
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="flex-shrink-0"
          aria-label={t('dashboard.campaign.header.back')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="min-w-0 flex-1">
          <input
            type="text"
            value={campaignName}
            onChange={handleNameChange}
            placeholder={t('dashboard.campaign.header.namePlaceholder')}
            className={cn(
              'w-full bg-transparent text-xl font-semibold',
              'border-none outline-none',
              'placeholder:text-muted-foreground/50',
              'focus:placeholder:text-muted-foreground/30'
            )}
            aria-label={t('dashboard.campaign.header.nameAriaLabel')}
          />
          <p className="text-muted-foreground mt-0.5 text-xs">
            {t('dashboard.campaign.header.subtitle')}
          </p>
        </div>
      </div>

      {/* Right side: Action buttons */}
      <div className="flex flex-shrink-0 items-center gap-2">
        {/* Platform count badge */}
        {includedCount > 0 && (
          <span className="text-muted-foreground bg-muted rounded-full px-2 py-1 text-xs">
            {t('dashboard.campaign.header.platformCount', {
              count: includedCount,
            })}
          </span>
        )}

        {/* Main action button */}
        {getActionButton()}
      </div>
    </header>
  )
}
