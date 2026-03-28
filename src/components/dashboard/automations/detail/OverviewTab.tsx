import { useTranslation } from 'react-i18next'
import { Film } from 'lucide-react'
import type { Automation } from '@/types/automation'

interface OverviewTabProps {
  automation: Automation
}

export function OverviewTab({ automation }: OverviewTabProps) {
  const { t } = useTranslation()

  const runs = automation.runs || []
  const totalRuns = runs.length
  const clipsGenerated = runs.reduce((sum, r) => sum + r.clipsGenerated, 0)
  const clipsPosted = runs.reduce((sum, r) => sum + r.postsScheduled, 0)
  const completedRuns = runs.filter((r) => r.status === 'completed').length
  const successRate = totalRuns > 0 ? Math.round((completedRuns / totalRuns) * 100) : 0

  const consecutiveFailures = (() => {
    let count = 0
    for (const run of runs) {
      if (run.status === 'failed') count++
      else break
    }
    return count
  })()

  const isFailing = automation.status === 'failed' || consecutiveFailures > 0

  const presetLabel =
    (automation.subtitleConfig as Record<string, string>)?.preset === 'none'
      ? t('dashboard.automations.wizard.clipStyle.presets.none')
      : t(
          `dashboard.automations.wizard.clipStyle.presets.${(automation.subtitleConfig as Record<string, string>)?.preset || 'none'}`
        )

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {isFailing ? (
          <>
            <StatCard
              label={t('dashboard.automations.detail.consecutiveFailures')}
              value={String(consecutiveFailures)}
              valueClassName="text-error"
            />
            <StatCard
              label={t('dashboard.automations.detail.totalRuns')}
              value={String(totalRuns)}
            />
            <StatCard
              label={t('dashboard.automations.detail.clipsGenerated')}
              value={String(clipsGenerated)}
            />
            <StatCard
              label={t('dashboard.automations.detail.successRate')}
              value={`${successRate}%`}
            />
          </>
        ) : (
          <>
            <StatCard
              label={t('dashboard.automations.detail.totalRuns')}
              value={String(totalRuns)}
            />
            <StatCard
              label={t('dashboard.automations.detail.clipsGenerated')}
              value={String(clipsGenerated)}
            />
            <StatCard
              label={t('dashboard.automations.detail.clipsPosted')}
              value={String(clipsPosted)}
            />
            <StatCard
              label={t('dashboard.automations.detail.nextRun')}
              value={
                automation.postingConfig.postingTimes[0]
                  ? automation.postingConfig.postingTimes[0]
                  : '—'
              }
            />
          </>
        )}
      </div>

      {/* Empty state for clips */}
      {clipsGenerated === 0 && (
        <div className="bg-bg-elevated border-border-default rounded-xl border p-8 text-center">
          <Film className="text-text-muted mx-auto h-6 w-6" />
          <p className="text-text-muted mt-3 text-sm">
            {t('dashboard.automations.detail.noClipsYet')}
          </p>
        </div>
      )}

      {/* Configuration Section */}
      <div>
        <h3 className="text-text-primary text-sm font-semibold">
          {t('dashboard.automations.detail.configuration')}
        </h3>
        <div className="mt-3 space-y-2">
          <ConfigRow
            label={t('dashboard.automations.detail.config.clipSettings')}
            value={`${automation.clipConfig.n_clips} clips, ${automation.clipConfig.clip_duration_min}-${automation.clipConfig.clip_duration_max}s, ${automation.clipConfig.tone}`}
          />
          <ConfigRow
            label={t('dashboard.automations.detail.config.subtitleStyle')}
            value={presetLabel}
          />
          <ConfigRow
            label={t('dashboard.automations.detail.config.schedule')}
            value={`${automation.postingConfig.clipsPerDay} clips/day — ${automation.postingConfig.postingTimes.join(', ')} — ${automation.postingConfig.socialAccountIds.length} platform(s)`}
          />
        </div>
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  valueClassName,
}: {
  label: string
  value: string
  valueClassName?: string
}) {
  return (
    <div className="bg-bg-elevated border-border-default rounded-lg border px-4 py-3">
      <dt className="text-text-muted text-xs uppercase tracking-wider">{label}</dt>
      <dd className={`mt-1 text-xl font-semibold ${valueClassName || 'text-text-primary'}`}>
        {value}
      </dd>
    </div>
  )
}

function ConfigRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-text-tertiary text-sm">{label}</span>
      <span className="text-text-primary text-sm">{value}</span>
    </div>
  )
}
