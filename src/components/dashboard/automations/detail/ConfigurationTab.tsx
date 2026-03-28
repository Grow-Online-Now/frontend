import { useTranslation } from 'react-i18next'
import type { Automation } from '@/types/automation'

interface ConfigurationTabProps {
  automation: Automation
}

export function ConfigurationTab({ automation }: ConfigurationTabProps) {
  const { t } = useTranslation()

  const isYoutube = automation.templateType === 'youtube_to_clips'

  const presetKey = (automation.subtitleConfig as Record<string, string>)?.preset || 'none'
  const presetLabel =
    presetKey === 'none'
      ? t('dashboard.automations.wizard.clipStyle.presets.none')
      : t(`dashboard.automations.wizard.clipStyle.presets.${presetKey}`)

  return (
    <div className="space-y-5">
      {/* Source */}
      <ConfigSection title={t('dashboard.automations.detail.config.sourceConfig')}>
        <ConfigRow
          label={t('dashboard.automations.detail.config.platform')}
          value={isYoutube ? 'YouTube' : 'Twitch'}
        />
        <ConfigRow
          label={t('dashboard.automations.detail.config.channelUrl')}
          value={automation.sourceConfig.channelUrl}
        />
      </ConfigSection>

      {/* Clip Settings */}
      <ConfigSection title={t('dashboard.automations.detail.config.clipSettings')}>
        <ConfigRow
          label={t('dashboard.automations.detail.config.clipsPerVideo')}
          value={String(automation.clipConfig.n_clips)}
        />
        <ConfigRow
          label={t('dashboard.automations.detail.config.duration')}
          value={`${automation.clipConfig.clip_duration_min}–${automation.clipConfig.clip_duration_max}s`}
        />
        <ConfigRow
          label={t('dashboard.automations.detail.config.tone')}
          value={t(`dashboard.automations.wizard.clipStyle.tones.${automation.clipConfig.tone}`)}
        />
      </ConfigSection>

      {/* Subtitle Style */}
      <ConfigSection title={t('dashboard.automations.detail.config.subtitleStyle')}>
        <ConfigRow
          label={t('dashboard.automations.wizard.clipStyle.presets.title')}
          value={presetLabel}
        />
      </ConfigSection>

      {/* Schedule */}
      <ConfigSection title={t('dashboard.automations.detail.config.schedule')}>
        <ConfigRow
          label={t('dashboard.automations.detail.config.clipsPerDay')}
          value={String(automation.postingConfig.clipsPerDay)}
        />
        <ConfigRow
          label={t('dashboard.automations.detail.config.postingTimes')}
          value={automation.postingConfig.postingTimes.join(', ')}
        />
        <ConfigRow
          label={t('dashboard.automations.detail.config.timezone')}
          value={automation.postingConfig.timezone}
        />
        <ConfigRow
          label={t('dashboard.automations.detail.config.platforms')}
          value={`${automation.postingConfig.socialAccountIds.length} platform(s)`}
        />
      </ConfigSection>
    </div>
  )
}

function ConfigSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-bg-elevated border-border-default rounded-xl border p-5">
      <h3 className="text-text-primary mb-3 text-sm font-semibold">{title}</h3>
      <div className="space-y-2">{children}</div>
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
