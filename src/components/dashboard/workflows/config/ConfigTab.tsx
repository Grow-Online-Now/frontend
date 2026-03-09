/**
 * ConfigTab
 * Renders form fields for the selected node's configuration.
 * Uses CSS variable tokens — always rendered inside .dark wrapper.
 */

import { useTranslation } from 'react-i18next'
import { useWorkflowEditorStore } from '@/stores/workflowEditorStore'

export function ConfigTab() {
  const { t } = useTranslation()
  const workflow = useWorkflowEditorStore((s) => s.workflow)
  const nodeTypeMap = useWorkflowEditorStore((s) => s.nodeTypeMap)
  const selectedNodeId = useWorkflowEditorStore((s) => s.selectedNodeId)
  const updateNodeConfig = useWorkflowEditorStore((s) => s.updateNodeConfig)

  const node = workflow?.nodes.find((n) => n.id === selectedNodeId)
  if (!node) return null

  const def = nodeTypeMap[node.type]
  if (!def) return null

  return (
    <div className="flex flex-col gap-5">
      {def.configSchema.map((field) => (
        <div key={field.key}>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-text-tertiary">
            {field.label}
          </label>
          {field.description && (
            <p className="mb-2 text-xs text-text-muted">
              {field.description}
            </p>
          )}
          {field.type === 'textarea' ? (
            <textarea
              defaultValue={String(node.config[field.key] ?? field.default ?? '')}
              onChange={(e) => updateNodeConfig(node.id, { [field.key]: e.target.value })}
              placeholder={field.placeholder}
              rows={3}
              className="w-full rounded-lg border border-border-subtle bg-bg-elevated px-3 py-2 text-sm text-text-secondary outline-none transition-colors duration-150 focus:border-border-focus"
              style={{ resize: 'vertical' }}
            />
          ) : field.type === 'select' ? (
            <select
              defaultValue={String(node.config[field.key] ?? field.default ?? '')}
              onChange={(e) => updateNodeConfig(node.id, { [field.key]: e.target.value })}
              className="w-full rounded-lg border border-border-subtle bg-bg-elevated px-3 py-2 text-sm text-text-secondary outline-none transition-colors duration-150 focus:border-border-focus"
            >
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : field.type === 'toggle' ? (
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={Boolean(node.config[field.key] ?? field.default ?? false)}
                onChange={(e) => updateNodeConfig(node.id, { [field.key]: e.target.checked })}
                className="h-4 w-4 rounded"
                style={{ accentColor: '#8b5cf6' }}
              />
              <span className="text-sm text-text-secondary">
                {field.label}
              </span>
            </label>
          ) : (
            <input
              type={field.type === 'number' ? 'number' : 'text'}
              defaultValue={String(node.config[field.key] ?? field.default ?? '')}
              onChange={(e) =>
                updateNodeConfig(node.id, {
                  [field.key]: field.type === 'number' ? Number(e.target.value) : e.target.value,
                })
              }
              placeholder={field.placeholder}
              min={field.validation?.min}
              max={field.validation?.max}
              className="w-full rounded-lg border border-border-subtle bg-bg-elevated px-3 py-2 text-sm text-text-secondary outline-none transition-colors duration-150 focus:border-border-focus"
            />
          )}
        </div>
      ))}

      {/* Variable reference hint */}
      {def.inputPorts.length > 0 && (
        <div
          className="rounded-lg px-3 py-2"
          style={{
            border: '1px solid rgba(139,92,246,0.15)',
            background: 'rgba(139,92,246,0.08)',
          }}
        >
          <p className="text-xs" style={{ color: '#8b5cf6' }}>
            {t('dashboard.workflows.editor.variableHint')}
          </p>
        </div>
      )}

      {def.configSchema.length === 0 && (
        <p className="text-sm text-text-muted">
          {t('dashboard.workflows.editor.noConfig')}
        </p>
      )}
    </div>
  )
}
