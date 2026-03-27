import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import type { WizardState } from '@/types/automation'

interface ClipStyleStepProps {
  state: WizardState
  onUpdate: (updates: Partial<WizardState>) => void
}

const PRESETS = [
  {
    key: 'tiktok_viral',
    preview: 'DYNAMIC HIGHLIGHT',
    style: 'text-yellow-400 font-black uppercase text-lg',
  },
  {
    key: 'clean',
    preview: 'Clean subtitles',
    style: 'text-white font-normal text-sm',
  },
  {
    key: 'bold',
    preview: 'BOLD STYLE',
    style: 'text-cyan-400 font-black uppercase text-lg',
  },
  {
    key: 'none',
    preview: 'No subtitles',
    style: 'text-text-muted text-sm italic',
  },
]

const TONES = ['engaging', 'professional', 'casual', 'educational', 'entertaining', 'inspirational']

export function ClipStyleStep({ state, onUpdate }: ClipStyleStepProps) {
  const { t } = useTranslation()
  const [showCustomize, setShowCustomize] = useState(false)

  const selectPreset = (key: string) => {
    onUpdate({
      subtitles: { ...state.subtitles, preset: key },
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-text-primary text-lg font-semibold">
          {t('dashboard.automations.wizard.clipStyle.title')}
        </h2>
        <p className="text-text-secondary mt-1 text-sm">
          {t('dashboard.automations.wizard.clipStyle.description')}
        </p>
      </div>

      {/* Subtitle presets */}
      <div className="space-y-2">
        <Label className="text-text-secondary text-sm">
          {t('dashboard.automations.wizard.clipStyle.presets.title')}
        </Label>
        <div className="grid grid-cols-2 gap-3">
          {PRESETS.map((preset) => (
            <button
              key={preset.key}
              type="button"
              onClick={() => selectPreset(preset.key)}
              className={cn(
                'border-border-default rounded-xl border p-4 text-left transition-all duration-150',
                state.subtitles.preset === preset.key
                  ? 'border-border-focus bg-bg-hover ring-1 ring-[var(--border-focus)]'
                  : 'hover:border-border-emphasis hover:bg-bg-hover'
              )}
            >
              {/* Mini preview */}
              <div className="bg-bg-base mb-3 flex h-16 items-center justify-center rounded-lg">
                <span className={preset.style}>{preset.preview}</span>
              </div>
              <h3 className="text-text-primary text-sm font-medium">
                {t(`dashboard.automations.wizard.clipStyle.presets.${preset.key}`)}
              </h3>
              <p className="text-text-tertiary mt-0.5 text-xs">
                {t(`dashboard.automations.wizard.clipStyle.presets.${preset.key}Desc`)}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Customize toggle */}
      <button
        type="button"
        onClick={() => setShowCustomize(!showCustomize)}
        className="text-text-secondary hover:text-text-primary flex items-center gap-1 text-sm font-medium transition-colors"
      >
        {t('dashboard.automations.wizard.clipStyle.customize')}
        {showCustomize ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>

      {showCustomize && (
        <div className="bg-bg-subtle border-border-default space-y-4 rounded-lg border p-4">
          {/* Font, colors, etc. - simplified for v1 */}
          <p className="text-text-muted text-xs">
            Advanced subtitle customization coming soon. Using preset styles for now.
          </p>
        </div>
      )}

      {/* Clip settings */}
      <div className="border-border-default space-y-4 border-t pt-6">
        <div className="space-y-2">
          <Label className="text-text-secondary text-sm">
            {t('dashboard.automations.wizard.clipStyle.clipsPerVideo')}
          </Label>
          <Input
            type="number"
            min={1}
            max={10}
            value={state.clips.n_clips}
            onChange={(e) =>
              onUpdate({
                clips: {
                  ...state.clips,
                  n_clips: parseInt(e.target.value, 10) || 3,
                },
              })
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label className="text-text-secondary text-sm">
              {t('dashboard.automations.wizard.clipStyle.minSeconds')}
            </Label>
            <Input
              type="number"
              min={5}
              max={120}
              value={state.clips.clip_duration_min}
              onChange={(e) =>
                onUpdate({
                  clips: {
                    ...state.clips,
                    clip_duration_min: parseInt(e.target.value, 10) || 15,
                  },
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label className="text-text-secondary text-sm">
              {t('dashboard.automations.wizard.clipStyle.maxSeconds')}
            </Label>
            <Input
              type="number"
              min={10}
              max={180}
              value={state.clips.clip_duration_max}
              onChange={(e) =>
                onUpdate({
                  clips: {
                    ...state.clips,
                    clip_duration_max: parseInt(e.target.value, 10) || 60,
                  },
                })
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-text-secondary text-sm">
            {t('dashboard.automations.wizard.clipStyle.tone')}
          </Label>
          <Select
            value={state.clips.tone}
            onValueChange={(value) => onUpdate({ clips: { ...state.clips, tone: value } })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TONES.map((tone) => (
                <SelectItem key={tone} value={tone}>
                  {t(`dashboard.automations.wizard.clipStyle.tones.${tone}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
