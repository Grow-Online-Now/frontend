import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { SourceStep } from '@/components/dashboard/automations/wizard/SourceStep'
import { ClipStyleStep } from '@/components/dashboard/automations/wizard/ClipStyleStep'
import { PostingStep } from '@/components/dashboard/automations/wizard/PostingStep'
import { ReviewStep } from '@/components/dashboard/automations/wizard/ReviewStep'
import { createAutomation } from '@/services/automations.service'
import { DEFAULT_WIZARD_STATE } from '@/types/automation'
import type { WizardState, CreateAutomationRequest } from '@/types/automation'
import { toast } from 'sonner'

const STEPS = ['source', 'clipStyle', 'posting', 'review'] as const

export default function AutomationWizardPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { lang = 'en' } = useParams<{ lang: string }>()

  const [currentStep, setCurrentStep] = useState(0)
  const [state, setState] = useState<WizardState>({ ...DEFAULT_WIZARD_STATE })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const progress = ((currentStep + 1) / STEPS.length) * 100

  const canGoNext = (): boolean => {
    switch (currentStep) {
      case 0: // Source
        return !!state.source.templateType && !!state.source.channelUrl
      case 1: // Clip Style
        return true // always valid
      case 2: // Posting
        return state.posting.socialAccountIds.length > 0 && state.posting.postingTimes.length > 0
      case 3: // Review
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
          ? 'Automation created and activated!'
          : 'Automation saved as draft',
      )
      navigate(`/${lang}/dashboard/automations`)
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to create automation',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateState = (updates: Partial<WizardState>) => {
    setState((prev) => ({ ...prev, ...updates }))
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate(`/${lang}/dashboard/automations`)}
          className="text-text-tertiary hover:text-text-primary mb-4 flex items-center gap-1 text-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('dashboard.automations.title')}
        </button>
        <h1 className="text-text-primary text-2xl font-semibold tracking-tight">
          {t('dashboard.automations.wizard.title')}
        </h1>

        {/* Step indicators */}
        <div className="mt-4 flex items-center gap-2">
          {STEPS.map((step, i) => (
            <button
              key={step}
              onClick={() => i < currentStep && setCurrentStep(i)}
              disabled={i > currentStep}
              className={`text-xs font-medium transition-colors ${
                i === currentStep
                  ? 'text-text-primary'
                  : i < currentStep
                    ? 'text-text-tertiary hover:text-text-secondary cursor-pointer'
                    : 'text-text-muted cursor-not-allowed'
              }`}
            >
              {t(`dashboard.automations.wizard.steps.${step}`)}
            </button>
          ))}
        </div>
        <Progress value={progress} className="mt-3 h-1" />
      </div>

      {/* Step content */}
      <div className="bg-bg-elevated border-border-default rounded-xl border p-6">
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

      {/* Navigation */}
      {currentStep < 3 && (
        <div className="mt-6 flex justify-between">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('dashboard.automations.wizard.back')}
          </Button>
          <Button onClick={handleNext} disabled={!canGoNext()} className="gap-2">
            {t('dashboard.automations.wizard.next')}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
