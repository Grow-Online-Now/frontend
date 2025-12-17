/**
 * PublishActions Component
 * Post Now and Schedule buttons with calendar popover for scheduling
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'
import { CalendarIcon, Loader2, Send, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import type { TextFlowScheduleType } from '@/types/create'

interface PublishActionsProps {
  scheduleType: TextFlowScheduleType
  onScheduleTypeChange: (type: TextFlowScheduleType) => void
  scheduledDate: Date | null
  onScheduledDateChange: (date: Date | null) => void
  onSubmit: () => void
  isSubmitting: boolean
  disabled?: boolean
  className?: string
}

export function PublishActions({
  scheduleType,
  onScheduleTypeChange,
  scheduledDate,
  onScheduledDateChange,
  onSubmit,
  isSubmitting,
  disabled = false,
  className,
}: PublishActionsProps) {
  const { t } = useTranslation()
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [selectedTime, setSelectedTime] = useState('12:00')

  const handlePostNow = () => {
    onScheduleTypeChange('now')
    onScheduledDateChange(null)
    onSubmit()
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      // Apply the selected time to the date
      const [hours, minutes] = selectedTime.split(':').map(Number)
      date.setHours(hours, minutes, 0, 0)
      onScheduleTypeChange('scheduled')
      onScheduledDateChange(date)
      setIsCalendarOpen(false)
    }
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value
    setSelectedTime(newTime)

    // If we have a date, update it with the new time
    if (scheduledDate) {
      const [hours, minutes] = newTime.split(':').map(Number)
      const updatedDate = new Date(scheduledDate)
      updatedDate.setHours(hours, minutes, 0, 0)
      onScheduledDateChange(updatedDate)
    }
  }

  const handleScheduleSubmit = () => {
    if (scheduledDate) {
      onSubmit()
      setIsCalendarOpen(false)
    }
  }

  const isScheduleDisabled = disabled || isSubmitting
  const isPostNowDisabled = disabled || isSubmitting

  // Common button styles for consistent sizing
  const buttonStyles = 'h-9 min-w-[120px] justify-center gap-2 transition-all duration-150'

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {/* Schedule button with popover */}
      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={isScheduleDisabled}
            className={cn(
              buttonStyles,
              scheduleType === 'scheduled' &&
                scheduledDate &&
                'border-primary/30 bg-primary/5 text-primary'
            )}
          >
            {scheduleType === 'scheduled' && scheduledDate ? (
              <>
                <CalendarIcon className="h-4 w-4" />
                <span className="hidden sm:inline">{format(scheduledDate, 'MMM d, HH:mm')}</span>
                <span className="sm:hidden">{format(scheduledDate, 'd/M HH:mm')}</span>
              </>
            ) : (
              <>
                <Clock className="h-4 w-4" />
                <span>{t('dashboard.create.text.publish.schedule')}</span>
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <div className="p-3">
            <Calendar
              mode="single"
              selected={scheduledDate || undefined}
              onSelect={handleDateSelect}
              disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
              initialFocus
            />
            <div className="border-border mt-3 border-t pt-3">
              <label className="text-muted-foreground mb-1.5 block text-xs font-medium">
                {t('dashboard.create.text.publish.time')}
              </label>
              <input
                type="time"
                value={selectedTime}
                onChange={handleTimeChange}
                className={cn(
                  'border-border bg-surface-elevated text-foreground w-full rounded-md border px-3 py-2 text-sm',
                  'focus:ring-ring focus:border-ring focus:ring-2 focus:ring-offset-2 focus:outline-none'
                )}
              />
            </div>
            {scheduledDate && (
              <Button className="mt-3 w-full" size="sm" onClick={handleScheduleSubmit}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('dashboard.create.text.publish.scheduling')}
                  </>
                ) : (
                  <>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {t('dashboard.create.text.publish.scheduleFor', {
                      date: format(scheduledDate, 'MMM d'),
                      time: format(scheduledDate, 'HH:mm'),
                    })}
                  </>
                )}
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* Post Now button */}
      <Button
        variant="outline"
        onClick={handlePostNow}
        disabled={isPostNowDisabled}
        className={cn(buttonStyles, 'bg-primary text-primary-foreground hover:bg-primary/90')}
      >
        {isSubmitting && scheduleType === 'now' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {t('dashboard.create.text.publish.publishing')}
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            <span>{t('dashboard.create.text.publish.postNow')}</span>
          </>
        )}
      </Button>
    </div>
  )
}
