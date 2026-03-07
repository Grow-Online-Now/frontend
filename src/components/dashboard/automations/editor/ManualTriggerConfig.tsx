/**
 * ManualTriggerConfig Component
 * Configuration panel for the manual-trigger node
 */

import { useTranslation } from 'react-i18next'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface ManualTriggerConfigProps {
  config: Record<string, unknown>
  onChange: (config: Record<string, unknown>) => void
}

export function ManualTriggerConfig({ config, onChange }: ManualTriggerConfigProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="trigger-description">
          {t('dashboard.automations.editor.config.trigger.descriptionLabel')}
        </Label>
        <Textarea
          id="trigger-description"
          value={(config.description as string) || ''}
          onChange={(e) => onChange({ ...config, description: e.target.value })}
          placeholder={t(
            'dashboard.automations.editor.config.trigger.descriptionPlaceholder'
          )}
          rows={3}
          className="resize-none"
        />
        <p className="text-text-muted text-xs">
          {t('dashboard.automations.editor.config.trigger.descriptionHint')}
        </p>
      </div>
    </div>
  )
}
