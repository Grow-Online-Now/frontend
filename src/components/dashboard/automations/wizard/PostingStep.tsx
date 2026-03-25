import { useTranslation } from 'react-i18next'
import { Plus, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { PlatformIcon } from '@/components/dashboard/posts/PlatformIcon'
import { useConnections } from '@/hooks/useConnections'
import { cn } from '@/lib/utils'
import type { WizardState } from '@/types/automation'

interface PostingStepProps {
  state: WizardState
  onUpdate: (updates: Partial<WizardState>) => void
}

const DEFAULT_TIMES: Record<number, string[]> = {
  1: ['12:00'],
  2: ['09:00', '18:00'],
  3: ['09:00', '14:00', '19:00'],
  4: ['08:00', '12:00', '16:00', '20:00'],
  5: ['07:00', '10:00', '13:00', '16:00', '19:00'],
}

export function PostingStep({ state, onUpdate }: PostingStepProps) {
  const { t } = useTranslation()
  const { connections, connect } = useConnections()

  const toggleAccount = (accountId: string) => {
    const current = state.posting.socialAccountIds
    const next = current.includes(accountId)
      ? current.filter((id) => id !== accountId)
      : [...current, accountId]
    onUpdate({ posting: { ...state.posting, socialAccountIds: next } })
  }

  const updateClipsPerDay = (value: number) => {
    const clipsPerDay = Math.min(10, Math.max(1, value))
    const postingTimes = DEFAULT_TIMES[clipsPerDay] || state.posting.postingTimes

    // If changing clips/day, auto-fill default times
    const times =
      clipsPerDay !== state.posting.clipsPerDay ? postingTimes : state.posting.postingTimes

    // Ensure we have enough time slots
    const adjustedTimes =
      times.length < clipsPerDay
        ? [...times, ...Array(clipsPerDay - times.length).fill('12:00')]
        : times.slice(0, clipsPerDay)

    onUpdate({
      posting: { ...state.posting, clipsPerDay, postingTimes: adjustedTimes },
    })
  }

  const updateTime = (index: number, value: string) => {
    const times = [...state.posting.postingTimes]
    times[index] = value
    onUpdate({ posting: { ...state.posting, postingTimes: times } })
  }

  // Platforms that support video posting
  const videoPlatforms = ['tiktok', 'instagram', 'youtube', 'facebook', 'twitter', 'linkedin'] as const

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-text-primary text-lg font-semibold">
          {t('dashboard.automations.wizard.posting.title')}
        </h2>
        <p className="text-text-secondary mt-1 text-sm">
          {t('dashboard.automations.wizard.posting.description')}
        </p>
      </div>

      {/* Platform selection */}
      <div className="space-y-2">
        <Label className="text-text-secondary text-sm">
          {t('dashboard.automations.wizard.posting.platforms')}
        </Label>
        <p className="text-text-muted text-xs">
          {t('dashboard.automations.wizard.posting.platformsDescription')}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {videoPlatforms.map((platform) => {
            const connection = connections.find((c) => c.platform === platform)
            const isSelected = connection
              ? state.posting.socialAccountIds.includes(connection.id)
              : false

            return (
              <button
                key={platform}
                type="button"
                onClick={() => {
                  if (connection) {
                    toggleAccount(connection.id)
                  } else {
                    connect(platform)
                  }
                }}
                className={cn(
                  'flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all duration-150',
                  isSelected
                    ? 'border-border-focus bg-bg-hover text-text-primary ring-1 ring-[var(--border-focus)]'
                    : connection
                      ? 'border-border-default text-text-secondary hover:border-border-emphasis hover:bg-bg-hover'
                      : 'border-border-default text-text-muted border-dashed',
                )}
              >
                <PlatformIcon platform={platform} size="xs" />
                <span className="capitalize">{platform}</span>
                {!connection && (
                  <span className="text-text-muted text-xs">
                    {t('dashboard.automations.wizard.posting.connect')}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Clips per day */}
      <div className="space-y-2">
        <Label className="text-text-secondary text-sm">
          {t('dashboard.automations.wizard.posting.clipsPerDay')}
        </Label>
        <Input
          type="number"
          min={1}
          max={10}
          value={state.posting.clipsPerDay}
          onChange={(e) => updateClipsPerDay(parseInt(e.target.value, 10) || 3)}
          className="w-24"
        />
      </div>

      {/* Posting times */}
      <div className="space-y-2">
        <Label className="text-text-secondary text-sm">
          {t('dashboard.automations.wizard.posting.postingTimes')}
        </Label>
        <div className="space-y-2">
          {state.posting.postingTimes.map((time, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                type="time"
                value={time}
                onChange={(e) => updateTime(index, e.target.value)}
                className="w-32"
              />
              {state.posting.postingTimes.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    const times = state.posting.postingTimes.filter(
                      (_, i) => i !== index,
                    )
                    onUpdate({
                      posting: {
                        ...state.posting,
                        postingTimes: times,
                        clipsPerDay: times.length,
                      },
                    })
                  }}
                  className="text-text-muted hover:text-text-secondary p-1 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
