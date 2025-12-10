/**
 * MobileSettingsSheet Component
 * Bottom sheet for settings on mobile/tablet views
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Settings2, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ScheduleSelector } from './SettingsPanel/ScheduleSelector'
import { MasterCaption } from './SettingsPanel/MasterCaption'
import type { ScheduleType } from '@/types/posts'
import type { SocialPlatform } from '@/types/connections'

interface MobileSettingsSheetProps {
  scheduleType: ScheduleType
  scheduledTime?: Date
  onScheduleChange: (type: ScheduleType) => void
  onScheduledTimeChange: (time: Date | undefined) => void
  masterCaption: string
  onMasterCaptionChange: (caption: string) => void
  includedPlatforms: SocialPlatform[]
  syncedCount: number
  totalCount: number
  className?: string
}

export function MobileSettingsSheet({
  scheduleType,
  scheduledTime,
  onScheduleChange,
  onScheduledTimeChange,
  masterCaption,
  onMasterCaptionChange,
  includedPlatforms,
  syncedCount,
  totalCount,
  className,
}: MobileSettingsSheetProps) {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={cn('xl:hidden', className)}>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="fixed right-4 bottom-4 z-40 gap-2 shadow-lg"
          >
            <Settings2 className="h-4 w-4" />
            {t('dashboard.campaign.settings.title')}
            <ChevronUp className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[80vh] overflow-y-auto">
          <SheetHeader className="border-border-subtle border-b pb-4 text-left">
            <SheetTitle>{t('dashboard.campaign.settings.title')}</SheetTitle>
          </SheetHeader>

          <div className="space-y-6 py-6">
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
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
