import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import type { WizardState, AutomationTemplateType } from '@/types/automation'

interface SourceStepProps {
  state: WizardState
  onUpdate: (updates: Partial<WizardState>) => void
}

export function SourceStep({ state, onUpdate }: SourceStepProps) {
  const { t } = useTranslation()

  const selectTemplate = (type: AutomationTemplateType) => {
    onUpdate({
      source: { ...state.source, templateType: type },
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-text-primary text-lg font-semibold">
          {t('dashboard.automations.wizard.source.title')}
        </h2>
        <p className="text-text-secondary mt-1 text-sm">
          {t('dashboard.automations.wizard.source.description')}
        </p>
      </div>

      {/* Platform selection */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => selectTemplate('youtube_to_clips')}
          className={cn(
            'border-border-default rounded-xl border p-5 text-left transition-all duration-150',
            state.source.templateType === 'youtube_to_clips'
              ? 'border-border-focus bg-bg-hover ring-1 ring-[var(--border-focus)]'
              : 'hover:border-border-emphasis hover:bg-bg-hover'
          )}
        >
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[#FF0000]/10">
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-[#FF0000]">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </div>
          <h3 className="text-text-primary text-sm font-medium">
            {t('dashboard.automations.wizard.source.youtube.title')}
          </h3>
          <p className="text-text-tertiary mt-1 text-xs">
            {t('dashboard.automations.wizard.source.youtube.description')}
          </p>
        </button>

        <button
          type="button"
          onClick={() => selectTemplate('twitch_to_clips')}
          className={cn(
            'border-border-default rounded-xl border p-5 text-left transition-all duration-150',
            state.source.templateType === 'twitch_to_clips'
              ? 'border-border-focus bg-bg-hover ring-1 ring-[var(--border-focus)]'
              : 'hover:border-border-emphasis hover:bg-bg-hover'
          )}
        >
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[#9146FF]/10">
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-[#9146FF]">
              <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
            </svg>
          </div>
          <h3 className="text-text-primary text-sm font-medium">
            {t('dashboard.automations.wizard.source.twitch.title')}
          </h3>
          <p className="text-text-tertiary mt-1 text-xs">
            {t('dashboard.automations.wizard.source.twitch.description')}
          </p>
        </button>
      </div>

      {/* Channel URL */}
      {state.source.templateType && (
        <div className="space-y-2">
          <Label className="text-text-secondary text-sm">
            {t('dashboard.automations.wizard.source.channelUrl')}
          </Label>
          <Input
            value={state.source.channelUrl}
            onChange={(e) =>
              onUpdate({
                source: { ...state.source, channelUrl: e.target.value },
              })
            }
            placeholder={
              state.source.templateType === 'youtube_to_clips'
                ? t('dashboard.automations.wizard.source.channelUrlPlaceholder')
                : t('dashboard.automations.wizard.source.twitchPlaceholder')
            }
          />
        </div>
      )}

      {/* Twitch content type */}
      {state.source.templateType === 'twitch_to_clips' && (
        <div className="space-y-2">
          <Label className="text-text-secondary text-sm">
            {t('dashboard.automations.wizard.source.contentType')}
          </Label>
          <div className="flex gap-2">
            {(['clip', 'vod'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() =>
                  onUpdate({
                    source: { ...state.source, contentType: type },
                  })
                }
                className={cn(
                  'rounded-lg px-4 py-2 text-sm font-medium transition-all',
                  state.source.contentType === type
                    ? 'bg-bg-active text-text-primary'
                    : 'bg-bg-hover text-text-tertiary hover:text-text-secondary'
                )}
              >
                {t(`dashboard.automations.wizard.source.${type === 'clip' ? 'clips' : 'vods'}`)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
