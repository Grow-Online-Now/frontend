/**
 * ScheduleSelector Component
 * Radio group for post timing with optional date/time picker
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Calendar as CalendarIcon, Clock } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import type { ScheduleType } from '@/types/posts'

interface ScheduleSelectorProps {
  scheduleType: ScheduleType
  onScheduleTypeChange: (type: ScheduleType) => void
  scheduledDate?: Date
  onDateChange: (date: Date | undefined) => void
  scheduledTime: string
  onTimeChange: (time: string) => void
  className?: string
}

const SCHEDULE_OPTIONS: {
  value: ScheduleType
  labelKey: string
  descriptionKey: string
}[] = [
  {
    value: 'now',
    labelKey: 'dashboard.createPost.schedule.now.label',
    descriptionKey: 'dashboard.createPost.schedule.now.description',
  },
  {
    value: 'scheduled',
    labelKey: 'dashboard.createPost.schedule.scheduled.label',
    descriptionKey: 'dashboard.createPost.schedule.scheduled.description',
  },
  {
    value: 'draft',
    labelKey: 'dashboard.createPost.schedule.draft.label',
    descriptionKey: 'dashboard.createPost.schedule.draft.description',
  },
]

export function ScheduleSelector({
  scheduleType,
  onScheduleTypeChange,
  scheduledDate,
  onDateChange,
  scheduledTime,
  onTimeChange,
  className,
}: ScheduleSelectorProps) {
  const { t } = useTranslation()
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  return (
    <div className={cn('space-y-4', className)}>
      <Label className="text-sm font-medium">{t('dashboard.createPost.schedule.label')}</Label>

      <div className="space-y-2">
        {SCHEDULE_OPTIONS.map((option) => (
          <div
            key={option.value}
            className={cn(
              'flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all duration-150',
              scheduleType === option.value
                ? 'border-primary/40 bg-primary/5 ring-primary/10 ring-[3px]'
                : 'border-border-subtle hover:border-border hover:bg-surface-elevated'
            )}
            onClick={() => onScheduleTypeChange(option.value)}
          >
            <div
              className={cn(
                'mt-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 transition-colors duration-150',
                scheduleType === option.value ? 'border-primary' : 'border-border-muted'
              )}
            >
              {scheduleType === option.value && <div className="bg-primary h-2 w-2 rounded-full" />}
            </div>
            <div className="flex-1">
              <p className="text-foreground text-sm font-medium">{t(option.labelKey)}</p>
              <p className="text-muted-foreground text-xs">{t(option.descriptionKey)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Date/Time Picker for scheduled posts */}
      {scheduleType === 'scheduled' && (
        <div className="flex gap-3 pl-7">
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'flex-1 justify-start text-left font-normal transition-all duration-150',
                  !scheduledDate && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                {scheduledDate
                  ? scheduledDate.toLocaleDateString()
                  : t('dashboard.createPost.schedule.selectDate')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={scheduledDate}
                onSelect={(date) => {
                  onDateChange(date)
                  setIsCalendarOpen(false)
                }}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <div className="relative">
            <Clock className="text-muted-foreground/50 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              type="time"
              value={scheduledTime}
              onChange={(e) => onTimeChange(e.target.value)}
              className="w-32 pl-10"
            />
          </div>
        </div>
      )}
    </div>
  )
}
