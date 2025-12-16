/**
 * CreateFlowTopBar Component
 * Sticky header for the create post flow with back button, step indicator, and continue button
 */

import { useTranslation } from 'react-i18next'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { StepIndicator } from './StepIndicator'

interface CreateFlowTopBarProps {
  onBack: () => void
  titleKey: string
  currentStep?: number
  totalSteps?: number
  showContinue?: boolean
  canContinue?: boolean
  onContinue?: () => void
  continueKey?: string
  className?: string
}

export function CreateFlowTopBar({
  onBack,
  titleKey,
  currentStep = 1,
  totalSteps = 3,
  showContinue = false,
  canContinue = false,
  onContinue,
  continueKey = 'dashboard.create.text.topBar.continue',
  className,
}: CreateFlowTopBarProps) {
  const { t } = useTranslation()

  return (
    <header
      className={cn(
        'sticky top-0 z-10',
        'grid grid-cols-3 items-center',
        'h-14 px-6',
        'bg-background/80 backdrop-blur-lg',
        'border-border border',
        'rounded-2xl',
        className
      )}
    >
      {/* Left: Back button + Title */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onBack}
          aria-label={t('common.actions.back')}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-[18px] w-[18px]" />
        </Button>
        <span className="text-foreground text-sm font-medium">{t(titleKey)}</span>
      </div>

      {/* Center: Step Indicator */}
      <div className="flex justify-center">
        <StepIndicator currentStep={currentStep as 1 | 2 | 3} totalSteps={totalSteps} />
      </div>

      {/* Right: Continue button */}
      <div className="flex justify-end">
        {showContinue && onContinue && (
          <Button onClick={onContinue} disabled={!canContinue} size="sm" className="gap-1.5">
            {t(continueKey)}
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </header>
  )
}
