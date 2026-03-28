import { useTranslation } from 'react-i18next'
import { Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import type { WizardState } from '@/types/automation'

interface ReviewStepProps {
  state: WizardState
  onUpdate: (updates: Partial<WizardState>) => void
  onSubmit: (activateNow: boolean) => void
  isSubmitting: boolean
}

export function ReviewStep({ state, onUpdate, onSubmit, isSubmitting }: ReviewStepProps) {
  const { t } = useTranslation()

  const isYoutube = state.source.templateType === 'youtube_to_clips'
  const presetLabel =
    state.subtitles.preset === 'none'
      ? t('dashboard.automations.wizard.clipStyle.presets.none')
      : t(`dashboard.automations.wizard.clipStyle.presets.${state.subtitles.preset}`)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-text-primary text-lg font-semibold">
          {t('dashboard.automations.wizard.review.title')}
        </h2>
        <p className="text-text-secondary mt-1 text-sm">
          {t('dashboard.automations.wizard.review.description')}
        </p>
      </div>

      {/* Name */}
      <div className="space-y-2">
        <Label className="text-text-secondary text-sm">
          {t('dashboard.automations.wizard.review.name')}
        </Label>
        <Input
          value={state.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          placeholder={t('dashboard.automations.wizard.review.namePlaceholder')}
        />
      </div>

      {/* Summary */}
      <div className="space-y-3">
        <SummaryRow
          label={t('dashboard.automations.wizard.review.source')}
          value={`${isYoutube ? 'YouTube' : 'Twitch'} — ${state.source.channelUrl}`}
        />
        <SummaryRow
          label={t('dashboard.automations.wizard.review.clipSettings')}
          value={`${state.clips.n_clips} clips, ${state.clips.clip_duration_min}-${state.clips.clip_duration_max}s, ${state.clips.tone}`}
        />
        <SummaryRow
          label={t('dashboard.automations.wizard.review.subtitleStyle')}
          value={presetLabel}
        />
        <SummaryRow
          label={t('dashboard.automations.wizard.review.schedule')}
          value={`${state.posting.clipsPerDay} clips/day at ${state.posting.postingTimes.join(', ')} — ${state.posting.socialAccountIds.length} platform(s)`}
        />
      </div>

      {/* Actions */}
      <div className="border-border-default flex gap-3 border-t pt-6">
        <Button
          onClick={() => onSubmit(true)}
          disabled={isSubmitting || !state.name}
          className="flex-1 gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {t('dashboard.automations.wizard.review.creating')}
            </>
          ) : (
            t('dashboard.automations.wizard.review.activate')
          )}
        </Button>
        <Button
          variant="outline"
          onClick={() => onSubmit(false)}
          disabled={isSubmitting || !state.name}
        >
          {t('dashboard.automations.wizard.review.saveDraft')}
        </Button>
      </div>
    </div>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-bg-subtle rounded-lg px-4 py-3">
      <dt className="text-text-muted text-xs font-medium tracking-wider uppercase">{label}</dt>
      <dd className="text-text-primary mt-1 text-sm">{value}</dd>
    </div>
  )
}
