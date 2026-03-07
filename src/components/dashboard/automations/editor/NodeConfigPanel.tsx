/**
 * NodeConfigPanel Component
 * Right sidebar for configuring a selected node
 */

import { useTranslation } from 'react-i18next'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ManualTriggerConfig } from './ManualTriggerConfig'
import { TextTemplateConfig } from './TextTemplateConfig'
import { PostToPlatformsConfig } from './PostToPlatformsConfig'
import type { NodeDefinition } from '@/types/automations'

interface NodeConfigPanelProps {
  node: NodeDefinition
  onChange: (node: NodeDefinition) => void
  onClose: () => void
  availableVariables?: string[]
}

export function NodeConfigPanel({
  node,
  onChange,
  onClose,
  availableVariables = [],
}: NodeConfigPanelProps) {
  const { t } = useTranslation()

  const handleConfigChange = (config: Record<string, unknown>) => {
    onChange({ ...node, config })
  }

  const handleLabelChange = (label: string) => {
    onChange({ ...node, label })
  }

  const renderConfigForm = () => {
    switch (node.type) {
      case 'manual-trigger':
        return (
          <ManualTriggerConfig config={node.config} onChange={handleConfigChange} />
        )
      case 'text-template':
        return (
          <TextTemplateConfig
            config={node.config}
            onChange={handleConfigChange}
            availableVariables={availableVariables}
          />
        )
      case 'post-to-platforms':
        return (
          <PostToPlatformsConfig config={node.config} onChange={handleConfigChange} />
        )
      default:
        return (
          <div className="space-y-2">
            <Label>{t('dashboard.automations.editor.config.rawJson')}</Label>
            <Textarea
              value={JSON.stringify(node.config, null, 2)}
              onChange={(e) => {
                try {
                  handleConfigChange(JSON.parse(e.target.value))
                } catch {
                  // Invalid JSON, ignore
                }
              }}
              rows={8}
              className="font-mono text-sm"
            />
          </div>
        )
    }
  }

  return (
    <div className="bg-bg-elevated border-border flex w-72 flex-col border-l">
      <div className="border-border flex items-center justify-between border-b px-4 py-3">
        <h3 className="text-text-primary text-sm font-semibold">
          {t('dashboard.automations.editor.config.title')}
        </h3>
        <Button variant="ghost" size="icon" className="size-7" onClick={onClose}>
          <X className="size-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-4 space-y-2">
          <Label htmlFor="node-label">
            {t('dashboard.automations.editor.config.labelField')}
          </Label>
          <Input
            id="node-label"
            value={node.label}
            onChange={(e) => handleLabelChange(e.target.value)}
          />
        </div>

        <div className="border-border mb-4 border-t pt-4">{renderConfigForm()}</div>
      </div>
    </div>
  )
}
