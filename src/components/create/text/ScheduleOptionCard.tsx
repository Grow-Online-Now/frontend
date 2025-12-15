/**
 * ScheduleOptionCard Component
 * Selectable card for schedule option (Now, Best Time, Schedule)
 */

import { useTranslation } from 'react-i18next'
import { Zap, Sparkles, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { TextFlowScheduleType } from '@/types/create'

interface ScheduleOptionCardProps {
  type: TextFlowScheduleType
  labelKey: string
  descriptionKey: string
  iconName: 'Zap' | 'Sparkles' | 'Calendar'
  isSelected: boolean
  onSelect: () => void
  className?: string
}

const icons = {
  Zap,
  Sparkles,
  Calendar,
}

export function ScheduleOptionCard({
  labelKey,
  descriptionKey,
  iconName,
  isSelected,
  onSelect,
  className,
}: ScheduleOptionCardProps) {
  const { t } = useTranslation()
  const Icon = icons[iconName]

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'flex flex-col items-center gap-2 rounded-xl p-4 text-center',
        'border transition-all duration-150',
        // Selected state
        isSelected && 'border-foreground bg-surface-elevated',
        // Not selected state
        !isSelected && 'border-border-subtle hover:border-border hover:bg-surface-elevated',
        className
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-lg',
          isSelected ? 'bg-foreground text-background' : 'bg-surface-elevated'
        )}
      >
        <Icon className="h-5 w-5" />
      </div>

      {/* Text */}
      <div>
        <div className="text-foreground text-sm font-medium">{t(labelKey)}</div>
        <div className="text-muted-foreground mt-0.5 text-xs">{t(descriptionKey)}</div>
      </div>
    </button>
  )
}
