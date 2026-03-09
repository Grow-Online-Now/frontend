/**
 * ConfigTab
 * Renders form fields for the selected node's configuration
 */

import { useTranslation } from 'react-i18next'
import { useWorkflowEditorStore } from '@/stores/workflowEditorStore'
import { NODE_TYPE_DEFINITIONS } from '@/data/workflow-mocks'

export function ConfigTab() {
  const { t } = useTranslation()
  const workflow = useWorkflowEditorStore((s) => s.workflow)
  const selectedNodeId = useWorkflowEditorStore((s) => s.selectedNodeId)
  const updateNodeConfig = useWorkflowEditorStore((s) => s.updateNodeConfig)

  const node = workflow?.nodes.find((n) => n.id === selectedNodeId)
  if (!node) return null

  const def = NODE_TYPE_DEFINITIONS[node.type]
  if (!def) return null

  return (
    <div className="flex flex-col gap-4">
      {/* Config fields from schema */}
      {def.configSchema.map((field) => (
        <div key={field.key}>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {t(field.labelKey)}
          </label>
          {field.type === 'textarea' ? (
            <textarea
              defaultValue={String(node.config[field.key] ?? field.defaultValue ?? '')}
              onChange={(e) => updateNodeConfig(node.id, { [field.key]: e.target.value })}
              rows={3}
              className="w-full rounded-lg border border-border-default bg-bg-hover px-3 py-2 text-sm text-foreground transition-colors duration-150 focus:border-border-focus focus:outline-none"
            />
          ) : field.type === 'select' ? (
            <select
              defaultValue={String(node.config[field.key] ?? field.defaultValue ?? '')}
              onChange={(e) => updateNodeConfig(node.id, { [field.key]: e.target.value })}
              className="w-full rounded-lg border border-border-default bg-bg-hover px-3 py-2 text-sm text-foreground transition-colors duration-150 focus:border-border-focus focus:outline-none"
            >
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {t(opt.labelKey)}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={field.type === 'number' ? 'number' : 'text'}
              defaultValue={String(node.config[field.key] ?? field.defaultValue ?? '')}
              onChange={(e) => updateNodeConfig(node.id, { [field.key]: e.target.value })}
              className="w-full rounded-lg border border-border-default bg-bg-hover px-3 py-2 text-sm text-foreground transition-colors duration-150 focus:border-border-focus focus:outline-none"
            />
          )}
        </div>
      ))}

      {/* Variable reference display for ai_caption */}
      {node.type === 'ai_caption' && (
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {t('dashboard.workflows.editor.contextInput')}
          </label>
          <div className="rounded-lg border border-[rgba(139,92,246,0.2)] bg-[rgba(139,92,246,0.15)] px-3 py-2 font-mono text-sm text-[#8b5cf6]">
            {'{{ youtube_fetch.transcript }}'}
          </div>
        </div>
      )}

      {def.configSchema.length === 0 && node.type !== 'ai_caption' && (
        <p className="text-sm text-muted-foreground">
          {t('dashboard.workflows.editor.tabs.config')}
        </p>
      )}
    </div>
  )
}
