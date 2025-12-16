/**
 * Step3Schedule Component
 * Third step of the text flow: Choose when to publish
 * Includes content preview, schedule options, and publish summary
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { CalendarIcon, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScheduleOptionCard } from './ScheduleOptionCard'
import { ContentPreview } from '@/components/create/shared'
import { MediaPreviewGrid } from '@/components/create/shared/MediaPreviewGrid'
import { PlatformIcon } from '@/components/dashboard/posts/PlatformIcon'
import { SCHEDULE_OPTIONS } from '@/config/text-flow'
import type { TextFlowScheduleType, PlatformWithValidation } from '@/types/create'
import type { FileUploadState } from '@/hooks/useMediaUpload'

interface Step3ScheduleProps {
  content: string
  media?: FileUploadState[]
  selectedPlatforms: PlatformWithValidation[]
  scheduleType: TextFlowScheduleType
  onScheduleTypeChange: (type: TextFlowScheduleType) => void
  scheduledDate: Date | null
  onScheduledDateChange: (date: Date | null) => void
  isSubmitting: boolean
  onSubmit: () => void
  className?: string
}

const stepAnimation = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] as const },
}

export function Step3Schedule({
  content,
  media = [],
  selectedPlatforms,
  scheduleType,
  onScheduleTypeChange,
  scheduledDate,
  onScheduledDateChange,
  isSubmitting,
  onSubmit,
  className,
}: Step3ScheduleProps) {
  const { t } = useTranslation()
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const handleOptionSelect = (type: TextFlowScheduleType) => {
    onScheduleTypeChange(type)
    if (type === 'scheduled') {
      setIsCalendarOpen(true)
    }
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      onScheduledDateChange(date)
      setIsCalendarOpen(false)
    }
  }

  const selectedPlatformCount = selectedPlatforms.length

  // Determine if publish button should be disabled
  const isPublishDisabled =
    isSubmitting || selectedPlatformCount === 0 || (scheduleType === 'scheduled' && !scheduledDate)

  return (
    <motion.div {...stepAnimation} className={cn('mx-auto max-w-[600px]', className)}>
      {/* Header */}
      <div className="mb-6 text-center">
        <h2 className="text-foreground text-xl font-semibold">
          {t('dashboard.create.text.step3.title')}
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          {t('dashboard.create.text.step3.description')}
        </p>
      </div>

      {/* Content preview */}
      <ContentPreview content={content} className="mb-6" />

      {/* Media preview */}
      {media.length > 0 && (
        <div className="bg-surface-elevated border-border mb-6 rounded-xl border p-4">
          <div className="text-muted-foreground mb-3 text-xs font-medium tracking-wider uppercase">
            {t('dashboard.create.text.step3.media')}
          </div>
          <MediaPreviewGrid media={media} variant="compact" onRemove={() => {}} />
        </div>
      )}

      {/* Publish summary - platform chips */}
      <div className="bg-surface-subtle border-border mb-6 rounded-xl border p-4">
        <div className="text-muted-foreground mb-3 text-xs font-medium tracking-wider uppercase">
          {t('dashboard.create.text.step3.publishingTo')}
        </div>
        <div className="flex flex-wrap gap-2">
          {selectedPlatforms.map((platform) => (
            <div
              key={platform.id}
              className="bg-surface-elevated border-border flex items-center gap-2 rounded-lg border px-3 py-1.5"
            >
              <PlatformIcon platform={platform.platform} size="xs" />
              <span className="text-foreground text-sm">
                {platform.displayName || platform.platformUsername}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Schedule options */}
      <div className="grid grid-cols-3 gap-3">
        {SCHEDULE_OPTIONS.map((option) => (
          <ScheduleOptionCard
            key={option.type}
            type={option.type}
            labelKey={option.labelKey}
            descriptionKey={option.descriptionKey}
            iconName={option.iconName}
            isSelected={scheduleType === option.type}
            onSelect={() => handleOptionSelect(option.type)}
          />
        ))}
      </div>

      {/* Date picker for scheduled option */}
      {scheduleType === 'scheduled' && (
        <div className="mt-4">
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !scheduledDate && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {scheduledDate ? (
                  format(scheduledDate, 'PPP p')
                ) : (
                  <span>{t('dashboard.create.text.schedule.pickDate')}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
              <Calendar
                mode="single"
                selected={scheduledDate || undefined}
                onSelect={handleDateSelect}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      )}

      {/* Publish button */}
      <Button className="mt-6 w-full" size="lg" onClick={onSubmit} disabled={isPublishDisabled}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t('dashboard.create.text.publish.publishing')}
          </>
        ) : (
          t('dashboard.create.text.publish.button', { count: selectedPlatformCount })
        )}
      </Button>
    </motion.div>
  )
}
