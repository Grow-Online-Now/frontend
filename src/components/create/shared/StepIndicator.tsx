/**
 * StepIndicator Component
 * Shows progress through the 3-step flow with dots
 * Active = wider pill, completed = green dot
 */

import { cn } from '@/lib/utils'

interface StepIndicatorProps {
  currentStep: 1 | 2 | 3
  totalSteps?: number
  className?: string
}

export function StepIndicator({ currentStep, totalSteps = 3, className }: StepIndicatorProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {Array.from({ length: totalSteps }, (_, i) => {
        const step = i + 1
        const isActive = step === currentStep
        const isCompleted = step < currentStep

        return (
          <div
            key={step}
            className={cn(
              'h-2 rounded-full transition-all duration-200',
              isActive && 'bg-foreground w-6',
              isCompleted && 'bg-success w-2',
              !isActive && !isCompleted && 'bg-border w-2'
            )}
          />
        )
      })}
    </div>
  )
}
