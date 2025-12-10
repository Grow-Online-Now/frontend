/**
 * ScheduleSelector Component
 * Elegant radio card selection for schedule type
 */

import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'
import { Send, CalendarClock, FileText, CalendarIcon, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import type { ScheduleType } from '@/types/posts'

interface ScheduleSelectorProps {
  value: ScheduleType
  scheduledTime?: Date
  onChange: (type: ScheduleType) => void
  onScheduledTimeChange: (time: Date | undefined) => void
  disabled?: boolean
}

const scheduleOptions: Array<{
  value: ScheduleType
  icon: typeof Send
  labelKey: string
  descriptionKey: string
}> = [
  {
    value: 'now',
    icon: Send,
    labelKey: 'dashboard.campaign.schedule.now.label',
    descriptionKey: 'dashboard.campaign.schedule.now.description',
  },
  {
    value: 'scheduled',
    icon: CalendarClock,
    labelKey: 'dashboard.campaign.schedule.scheduled.label',
    descriptionKey: 'dashboard.campaign.schedule.scheduled.description',
  },
  {
    value: 'draft',
    icon: FileText,
    labelKey: 'dashboard.campaign.schedule.draft.label',
    descriptionKey: 'dashboard.campaign.schedule.draft.description',
  },
]

export function ScheduleSelector({
  value,
  scheduledTime,
  onChange,
  onScheduledTimeChange,
  disabled,
}: ScheduleSelectorProps) {
  const { t } = useTranslation()

  const handleOptionClick = useCallback(
    (optionValue: ScheduleType) => {
      if (!disabled) {
        onChange(optionValue)
      }
    },
    [onChange, disabled]
  )

  const handleDateSelect = useCallback(
    (date: Date | undefined) => {
      if (date && scheduledTime) {
        // Preserve the time from the current scheduledTime
        date.setHours(scheduledTime.getHours())
        date.setMinutes(scheduledTime.getMinutes())
      } else if (date) {
        // Default to 9:00 AM if no time set
        date.setHours(9, 0, 0, 0)
      }
      onScheduledTimeChange(date)
    },
    [scheduledTime, onScheduledTimeChange]
  )

  const handleTimeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const [hours, minutes] = e.target.value.split(':').map(Number)
      const newDate = scheduledTime ? new Date(scheduledTime) : new Date()
      newDate.setHours(hours, minutes, 0, 0)
      onScheduledTimeChange(newDate)
    },
    [scheduledTime, onScheduledTimeChange]
  )

  return (
    <div className="space-y-3">
      <h3 className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
        {t('dashboard.campaign.schedule.title')}
      </h3>

      <div className="space-y-2">
        {scheduleOptions.map((option) => {
          const Icon = option.icon
          const isSelected = value === option.value

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleOptionClick(option.value)}
              disabled={disabled}
              className={cn(
                'campaign-schedule-card w-full text-left',
                'flex items-start gap-3',
                isSelected && 'campaign-schedule-card-selected',
                disabled && 'cursor-not-allowed opacity-50'
              )}
              aria-pressed={isSelected}
            >
              <div
                className={cn(
                  'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg',
                  isSelected ? 'bg-primary/20' : 'bg-muted'
                )}
              >
                <Icon
                  className={cn('h-4 w-4', isSelected ? 'text-primary' : 'text-muted-foreground')}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    'text-sm font-medium',
                    isSelected ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {t(option.labelKey)}
                </p>
                <p className="text-muted-foreground mt-0.5 text-xs">{t(option.descriptionKey)}</p>
              </div>

              {/* Radio indicator */}
              <div
                className={cn(
                  'mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-2',
                  isSelected ? 'border-primary bg-primary' : 'border-border-muted'
                )}
              >
                {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
              </div>
            </button>
          )
        })}
      </div>

      {/* Date/Time picker for scheduled option */}
      {value === 'scheduled' && (
        <div
          className={cn('campaign-expand mt-3', value === 'scheduled' && 'campaign-expand-open')}
        >
          <div className="campaign-expand-content border-border-subtle space-y-3 border-t pt-3">
            {/* Date picker */}
            <div className="space-y-1.5">
              <label className="text-muted-foreground text-xs font-medium">
                {t('dashboard.campaign.schedule.date')}
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !scheduledTime && 'text-muted-foreground'
                    )}
                    disabled={disabled}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {scheduledTime ? (
                      format(scheduledTime, 'PPP')
                    ) : (
                      <span>{t('dashboard.campaign.schedule.pickDate')}</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={scheduledTime}
                    onSelect={handleDateSelect}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time picker */}
            <div className="space-y-1.5">
              <label className="text-muted-foreground text-xs font-medium">
                {t('dashboard.campaign.schedule.time')}
              </label>
              <div className="relative">
                <Clock className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <input
                  type="time"
                  value={
                    scheduledTime
                      ? `${String(scheduledTime.getHours()).padStart(2, '0')}:${String(scheduledTime.getMinutes()).padStart(2, '0')}`
                      : ''
                  }
                  onChange={handleTimeChange}
                  disabled={disabled}
                  className={cn(
                    'w-full rounded-lg py-2 pr-3 pl-10 text-sm',
                    'border-border bg-surface border',
                    'focus:ring-primary focus:border-transparent focus:ring-2 focus:outline-none'
                  )}
                />
              </div>
            </div>

            {/* Best time suggestion */}
            <p className="text-muted-foreground flex items-center gap-1 text-xs">
              <span className="text-primary">💡</span>
              {t('dashboard.campaign.schedule.bestTime')}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
