/**
 * SettingsPanel Component
 * Right panel with campaign-level settings
 */

import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { ScheduleSelector } from './ScheduleSelector'
import { MasterCaption } from './MasterCaption'
import { AiAssist } from './AiAssist'
import { PreviewToggle } from './PreviewToggle'
import type { ScheduleType } from '@/types/posts'
import type { SocialPlatform } from '@/types/connections'
import { PANEL_WIDTHS } from '../../constants'

interface SettingsPanelProps {
  // Schedule
  scheduleType: ScheduleType
  scheduledTime?: Date
  onScheduleChange: (type: ScheduleType) => void
  onScheduledTimeChange: (time: Date | undefined) => void
  // Master caption
  masterCaption: string
  onMasterCaptionChange: (caption: string) => void
  includedPlatforms: SocialPlatform[]
  syncedCount: number
  totalCount: number
  // Preview
  isPreviewMode: boolean
  onPreviewModeChange: (isPreview: boolean) => void
  // AI
  onAiAssist?: () => void
  onGenerateCaptions?: () => Promise<void>
  onSuggestHashtags?: () => Promise<void>
  onOptimize?: () => Promise<void>
  // General
  className?: string
}

export function SettingsPanel({
  scheduleType,
  scheduledTime,
  onScheduleChange,
  onScheduledTimeChange,
  masterCaption,
  onMasterCaptionChange,
  includedPlatforms,
  syncedCount,
  totalCount,
  isPreviewMode,
  onPreviewModeChange,
  onAiAssist,
  onGenerateCaptions,
  onSuggestHashtags,
  onOptimize,
  className,
}: SettingsPanelProps) {
  const { t } = useTranslation()

  return (
    <aside
      className={cn(
        'flex h-full flex-col',
        'campaign-panel-enter campaign-panel-enter-delay-2',
        className
      )}
      style={{ width: PANEL_WIDTHS.right }}
      aria-label={t('dashboard.campaign.settings.ariaLabel')}
    >
      {/* Panel header */}
      <div className="flex-shrink-0 pb-4">
        <h2 className="text-foreground text-sm font-semibold">
          {t('dashboard.campaign.settings.title')}
        </h2>
        <p className="text-muted-foreground mt-0.5 text-xs">
          {t('dashboard.campaign.settings.description')}
        </p>
      </div>

      {/* Scrollable content */}
      <div className="-mx-1 flex-1 space-y-6 overflow-y-auto px-1">
        {/* Schedule selector */}
        <ScheduleSelector
          value={scheduleType}
          scheduledTime={scheduledTime}
          onChange={onScheduleChange}
          onScheduledTimeChange={onScheduledTimeChange}
        />

        {/* Divider */}
        <div className="border-border-subtle border-t" />

        {/* Master caption */}
        <MasterCaption
          value={masterCaption}
          onChange={onMasterCaptionChange}
          includedPlatforms={includedPlatforms}
          syncedCount={syncedCount}
          totalCount={totalCount}
          onAiAssist={onAiAssist}
        />

        {/* Divider */}
        <div className="border-border-subtle border-t" />

        {/* AI Assist */}
        <AiAssist
          onGenerateCaptions={onGenerateCaptions}
          onSuggestHashtags={onSuggestHashtags}
          onOptimize={onOptimize}
        />

        {/* Divider */}
        <div className="border-border-subtle border-t" />

        {/* Preview toggle */}
        <PreviewToggle isPreviewMode={isPreviewMode} onChange={onPreviewModeChange} />
      </div>

      {/* Bottom summary (optional) */}
      <div className="border-border-subtle mt-4 flex-shrink-0 border-t pt-4">
        <div className="text-muted-foreground space-y-1 text-xs">
          <div className="flex items-center justify-between">
            <span>{t('dashboard.campaign.settings.summary.platforms')}</span>
            <span className="text-foreground font-medium">{includedPlatforms.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>{t('dashboard.campaign.settings.summary.schedule')}</span>
            <span className="text-foreground font-medium">
              {scheduleType === 'now'
                ? t('dashboard.campaign.schedule.now.label')
                : scheduleType === 'scheduled'
                  ? t('dashboard.campaign.schedule.scheduled.label')
                  : t('dashboard.campaign.schedule.draft.label')}
            </span>
          </div>
        </div>
      </div>
    </aside>
  )
}
