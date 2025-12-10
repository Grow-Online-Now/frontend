/**
 * ScheduleOptions Component
 * Compact schedule selector for Create Post left column
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Calendar as CalendarIcon, Clock, Send, CalendarClock, FileText } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { ScheduleType } from '@/types/posts'

interface ScheduleOptionsProps {
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
  icon: typeof Send
}[] = [
  {
    value: 'now',
    labelKey: 'dashboard.createPost.schedule.now.label',
    descriptionKey: 'dashboard.createPost.schedule.now.description',
    icon: Send,
  },
  {
    value: 'scheduled',
    labelKey: 'dashboard.createPost.schedule.scheduled.label',
    descriptionKey: 'dashboard.createPost.schedule.scheduled.description',
    icon: CalendarClock,
  },
  {
    value: 'draft',
    labelKey: 'dashboard.createPost.schedule.draft.label',
    descriptionKey: 'dashboard.createPost.schedule.draft.description',
    icon: FileText,
  },
]

export function ScheduleOptions({
  scheduleType,
  onScheduleTypeChange,
  scheduledDate,
  onDateChange,
  scheduledTime,
  onTimeChange,
  className,
}: ScheduleOptionsProps) {
  const { t } = useTranslation()
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  return (
    <div className={cn('space-y-3', className)}>
      <h3 className="text-muted-foreground text-[11px] font-medium tracking-wide uppercase">
        {t('dashboard.createPost.schedule.label')}
      </h3>

      <div className="space-y-2">
        {SCHEDULE_OPTIONS.map((option) => {
          const Icon = option.icon
          const isSelected = scheduleType === option.value

          return (
            <div key={option.value}>
              <div
                className={cn(
                  'flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-all duration-150',
                  isSelected
                    ? 'border-primary/40 bg-primary/5'
                    : 'border-border-subtle hover:border-border hover:bg-surface-elevated'
                )}
                onClick={() => onScheduleTypeChange(option.value)}
              >
                {/* Radio button */}
                <div
                  className={cn(
                    'mt-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 transition-colors duration-150',
                    isSelected ? 'border-primary' : 'border-border-muted'
                  )}
                >
                  {isSelected && <div className="bg-primary h-2 w-2 rounded-full" />}
                </div>

                <Icon
                  className={cn(
                    'mt-0.5 h-4 w-4 shrink-0 transition-colors',
                    isSelected ? 'text-primary' : 'text-muted-foreground'
                  )}
                />

                <div className="flex-1">
                  <p className="text-foreground text-sm font-medium">{t(option.labelKey)}</p>
                  <p className="text-muted-foreground text-xs">{t(option.descriptionKey)}</p>
                </div>
              </div>

              {/* Date/Time Picker inline for scheduled */}
              {option.value === 'scheduled' && isSelected && (
                <div className="mt-2 flex gap-2 pl-9">
                  <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          'flex-1 justify-start text-left font-normal',
                          !scheduledDate && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-3.5 w-3.5 opacity-70" />
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
                    <Clock className="text-muted-foreground/50 absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2" />
                    <Input
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => onTimeChange(e.target.value)}
                      className="h-8 w-24 pl-8 text-sm"
                    />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
