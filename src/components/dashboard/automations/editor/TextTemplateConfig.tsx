/**
 * TextTemplateConfig Component
 * Configuration panel for the text-template node
 */

import { useTranslation } from 'react-i18next'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface TextTemplateConfigProps {
  config: Record<string, unknown>
  onChange: (config: Record<string, unknown>) => void
  availableVariables?: string[]
}

export function TextTemplateConfig({
  config,
  onChange,
  availableVariables = [],
}: TextTemplateConfigProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="template-text">
          {t('dashboard.automations.editor.config.template.templateLabel')}
        </Label>
        <Textarea
          id="template-text"
          value={(config.template as string) || ''}
          onChange={(e) => onChange({ ...config, template: e.target.value })}
          placeholder={t(
            'dashboard.automations.editor.config.template.templatePlaceholder'
          )}
          rows={6}
          className="font-mono text-sm"
        />
        <p className="text-text-muted text-xs">
          {t('dashboard.automations.editor.config.template.templateHint')}
        </p>
      </div>

      {availableVariables.length > 0 && (
        <div className="space-y-2">
          <Label className="text-xs">
            {t('dashboard.automations.editor.config.template.availableVariables')}
          </Label>
          <div className="flex flex-wrap gap-1.5">
            {availableVariables.map((v) => (
              <code
                key={v}
                className="bg-bg-subtle text-text-secondary rounded-md px-2 py-0.5 font-mono text-xs"
              >
                {`{{${v}}}`}
              </code>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
