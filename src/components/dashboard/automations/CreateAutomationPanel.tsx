import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { SourceStep } from './wizard/SourceStep'
import { ClipStyleStep } from './wizard/ClipStyleStep'
import { PostingStep } from './wizard/PostingStep'
import { ReviewStep } from './wizard/ReviewStep'
import { createAutomation } from '@/services/automations.service'
import { DEFAULT_WIZARD_STATE } from '@/types/automation'
import type { WizardState, CreateAutomationRequest } from '@/types/automation'
import { toast } from 'sonner'

interface CreateAutomationPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: () => void
}

const STEPS = ['source', 'clipStyle', 'posting', 'review'] as const

export function CreateAutomationPanel({
  open,
  onOpenChange,
  onCreated,
}: CreateAutomationPanelProps) {
  const { t } = useTranslation()
  const [currentStep, setCurrentStep] = useState(0)
  const [state, setState] = useState<WizardState>({ ...DEFAULT_WIZARD_STATE })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const progress = ((currentStep + 1) / STEPS.length) * 100

  const canGoNext = (): boolean => {
    switch (currentStep) {
      case 0:
        return !!state.source.templateType && !!state.source.channelUrl
      case 1:
        return true
      case 2:
        return (
          state.posting.socialAccountIds.length > 0 &&
          state.posting.postingTimes.length > 0
        )
      case 3:
        return !!state.name
      default:
        return false
    }
  }

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (activateNow: boolean) => {
    if (!state.source.templateType) return

    setIsSubmitting(true)
    try {
      const request: CreateAutomationRequest = {
        name: state.name || 'My Automation',
        templateType: state.source.templateType,
        sourceConfig: {
          channelUrl: state.source.channelUrl,
          ...(state.source.templateType === 'twitch_to_clips'
            ? { contentType: state.source.contentType }
            : {}),
        },
        clipConfig: state.clips,
        subtitleConfig: state.subtitles.preset
          ? { preset: state.subtitles.preset, ...state.subtitles.config }
          : state.subtitles.config,
        postingConfig: {
          socialAccountIds: state.posting.socialAccountIds,
          clipsPerDay: state.posting.clipsPerDay,
          postingTimes: state.posting.postingTimes,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        status: activateNow ? 'active' : 'draft',
      }

      await createAutomation(request)
      toast.success(
        activateNow
          ? t('dashboard.automations.board.createdActive')
          : t('dashboard.automations.board.createdDraft')
      )
      // Reset state
      setState({ ...DEFAULT_WIZARD_STATE })
      setCurrentStep(0)
      onCreated()
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : t('dashboard.automations.board.createFailed')
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateState = (updates: Partial<WizardState>) => {
    setState((prev) => ({ ...prev, ...updates }))
  }

  const handleOpenChange = (value: boolean) => {
    if (!value) {
      // Reset wizard when closing
      setState({ ...DEFAULT_WIZARD_STATE })
      setCurrentStep(0)
    }
    onOpenChange(value)
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col sm:max-w-md md:max-w-lg"
      >
        <SheetHeader className="px-6 pt-6 pb-0">
          <SheetTitle className="text-text-primary text-xl font-semibold tracking-tight">
            {t('dashboard.automations.wizard.title')}
          </SheetTitle>
          <SheetDescription className="sr-only">
            {t('dashboard.automations.description')}
          </SheetDescription>
        </SheetHeader>

        {/* Progress bar */}
        <div className="px-6">
          <Progress value={progress} className="mt-3 h-1" />
          <p className="text-primary mt-3 text-xs font-medium uppercase tracking-wider">
            {t('dashboard.automations.board.stepOf', {
              current: currentStep + 1,
              total: STEPS.length,
            })}
          </p>
          <h2 className="text-text-primary mt-1 text-base font-semibold">
            {t(`dashboard.automations.board.stepTitles.${STEPS[currentStep]}`)}
          </h2>
          <p className="text-text-secondary mt-0.5 text-sm">
            {t(`dashboard.automations.board.stepDescriptions.${STEPS[currentStep]}`)}
          </p>
        </div>

        {/* Step content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {currentStep === 0 && (
            <SourceStep state={state} onUpdate={updateState} />
          )}
          {currentStep === 1 && (
            <ClipStyleStep state={state} onUpdate={updateState} />
          )}
          {currentStep === 2 && (
            <PostingStep state={state} onUpdate={updateState} />
          )}
          {currentStep === 3 && (
            <ReviewStep
              state={state}
              onUpdate={updateState}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          )}
        </div>

        {/* Footer navigation */}
        {currentStep < 3 && (
          <div className="border-border-default flex items-center justify-between border-t px-6 py-4">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('dashboard.automations.wizard.back')}
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canGoNext()}
              className="gap-2"
            >
              {t('dashboard.automations.wizard.next')}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
