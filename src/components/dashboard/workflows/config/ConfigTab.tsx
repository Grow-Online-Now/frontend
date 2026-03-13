/**
 * ConfigTab
 * Renders config fields for the selected node.
 * Text/textarea fields support {{ variable }} insertion from upstream nodes.
 * Shows n8n-style resolved value preview from last execution below each field.
 */

import { useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useWorkflowEditorStore } from '@/stores/workflowEditorStore'
import { VariablePicker } from './VariablePicker'
import { SubtitleVisualEditor } from './subtitle-editor/SubtitleVisualEditor'
import type { ConfigFieldSchema } from '@/types/workflow'

const INPUT_CLASS =
  'w-full rounded-lg border border-border-subtle bg-bg-elevated px-3 py-2 text-sm text-text-secondary outline-none transition-colors duration-150 focus:border-border-focus'

const SUBTITLE_FIELD_KEYS = new Set([
  'font_name',
  'font_size',
  'text_color',
  'outline_color',
  'outline_width',
  'bold',
  'position',
  'margin_v',
  'background_box',
  'animation_style',
  'highlight_color',
  'highlight_scale',
  'max_words_per_group',
  'uppercase',
])

/** Detect {{ ... }} tokens in a string value */
function hasVariableRef(value: unknown): boolean {
  return typeof value === 'string' && /\{\{\s*\w+\.[\w.[\]]+\s*\}\}/.test(value)
}

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

  const hasUpstream = workflow?.edges.some((e) => e.targetNodeId === node.id) ?? false

  const hasSubtitleFields = def.configSchema.some((f) => SUBTITLE_FIELD_KEYS.has(f.key))
  const enableSubtitles = node.config.enable_subtitles !== false
  const showVisualEditor = hasSubtitleFields && enableSubtitles

  return (
    <div className="flex flex-col gap-6">
      {def.configSchema
        .filter((field) => !showVisualEditor || !SUBTITLE_FIELD_KEYS.has(field.key))
        .map((field) => (
          <ConfigField
            key={field.key}
            field={field}
            nodeId={node.id}
            value={node.config[field.key]}
            hasUpstream={hasUpstream}
            updateNodeConfig={updateNodeConfig}
          />
        ))}

      {showVisualEditor && (
        <SubtitleVisualEditor
          nodeId={node.id}
          config={node.config}
          updateNodeConfig={updateNodeConfig}
        />
      )}

      {def.configSchema.length === 0 && (
        <p className="text-text-muted text-sm">{t('dashboard.workflows.editor.noConfig')}</p>
      )}
    </div>
  )
}

interface ConfigFieldProps {
  field: ConfigFieldSchema
  nodeId: string
  value: unknown
  hasUpstream: boolean
  updateNodeConfig: (nodeId: string, config: Record<string, unknown>) => void
}

function ConfigField({ field, nodeId, value, hasUpstream, updateNodeConfig }: ConfigFieldProps) {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)
  const lastRun = useWorkflowEditorStore((s) => s.lastRun)

  const currentValue = String(value ?? field.default ?? '')
  const isTextLike =
    field.type === 'text' || field.type === 'textarea' || field.type === 'variable_ref'
  const showPicker = isTextLike && hasUpstream

  const handleInsert = useCallback(
    (variable: string) => {
      const el = inputRef.current
      if (!el) {
        updateNodeConfig(nodeId, { [field.key]: currentValue + variable })
        return
      }
      const start = el.selectionStart ?? el.value.length
      const end = el.selectionEnd ?? el.value.length
      const before = el.value.slice(0, start)
      const after = el.value.slice(end)
      const newValue = before + variable + after
      el.value = newValue
      updateNodeConfig(nodeId, { [field.key]: newValue })
      const cursorPos = start + variable.length
      requestAnimationFrame(() => {
        el.focus()
        el.setSelectionRange(cursorPos, cursorPos)
      })
    },
    [currentValue, nodeId, field.key, updateNodeConfig]
  )

  // Resolve variable preview from last run
  const resolvedPreview = hasVariableRef(value) ? resolveAllVariables(String(value), lastRun) : null

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <label className="text-text-tertiary text-xs font-medium tracking-wider uppercase">
          {field.label}
        </label>
        {showPicker && <VariablePicker onInsert={handleInsert} />}
      </div>
      {field.description && <p className="text-text-muted mb-2 text-xs">{field.description}</p>}

      {field.type === 'textarea' || field.type === 'variable_ref' ? (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          defaultValue={currentValue}
          onChange={(e) => updateNodeConfig(nodeId, { [field.key]: e.target.value })}
          placeholder={field.placeholder}
          rows={3}
          className={INPUT_CLASS}
          style={{ resize: 'vertical' }}
        />
      ) : field.type === 'select' ? (
        <select
          defaultValue={currentValue}
          onChange={(e) => updateNodeConfig(nodeId, { [field.key]: e.target.value })}
          className={INPUT_CLASS}
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
            checked={Boolean(value ?? field.default ?? false)}
            onChange={(e) => updateNodeConfig(nodeId, { [field.key]: e.target.checked })}
            className="h-4 w-4 rounded"
            style={{ accentColor: '#8b5cf6' }}
          />
          <span className="text-text-secondary text-sm">{field.label}</span>
        </label>
      ) : (
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type={field.type === 'number' ? 'number' : 'text'}
          defaultValue={currentValue}
          onChange={(e) =>
            updateNodeConfig(nodeId, {
              [field.key]: field.type === 'number' ? Number(e.target.value) : e.target.value,
            })
          }
          placeholder={field.placeholder}
          min={field.validation?.min}
          max={field.validation?.max}
          className={INPUT_CLASS}
        />
      )}

      {/* Resolved value preview — n8n-style */}
      {resolvedPreview !== null && (
        <div
          className="mt-1.5 rounded-md px-3 py-2"
          style={{
            background: 'rgba(139,92,246,0.06)',
            border: '1px solid rgba(139,92,246,0.12)',
          }}
        >
          <div
            className="mb-1 text-[10px] font-medium tracking-wider uppercase"
            style={{ color: '#8b5cf6' }}
          >
            {t('dashboard.workflows.editor.resolvedValue')}
          </div>
          <div className="text-text-secondary max-h-16 overflow-hidden font-mono text-xs break-all">
            {resolvedPreview}
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Resolve all {{ nodeId.path }} variables in a string using last run data.
 * Returns the fully resolved string, or null if no run data.
 */
function resolveAllVariables(
  template: string,
  lastRun: ReturnType<typeof useWorkflowEditorStore.getState>['lastRun']
): string | null {
  if (!lastRun) return null

  let hasResolution = false
  const resolved = template.replace(
    /\{\{\s*(\w+)\.([\w.[\]]+)\s*\}\}/g,
    (_match, nodeId: string, path: string) => {
      const step = lastRun.steps.find((s) => s.nodeId === nodeId)
      if (!step?.output) return _match
      const val = resolvePathClient(step.output, path)
      if (val === undefined) return _match
      hasResolution = true
      if (val === null) return 'null'
      if (typeof val === 'object') {
        const json = JSON.stringify(val)
        return json.length > 200 ? json.slice(0, 197) + '...' : json
      }
      return String(val)
    }
  )

  return hasResolution ? resolved : null
}

/** Resolve a dot/bracket path on a JS object (mirrors backend resolvePath). */
function resolvePathClient(obj: unknown, path: string): unknown {
  const segments = path
    .replace(/\[(\d+)\]/g, '.$1')
    .split('.')
    .filter(Boolean)
  let current: unknown = obj
  for (const seg of segments) {
    if (current === null || current === undefined) return undefined
    if (Array.isArray(current)) {
      const idx = Number(seg)
      if (Number.isNaN(idx)) return undefined
      current = current[idx]
    } else if (typeof current === 'object') {
      current = (current as Record<string, unknown>)[seg]
    } else {
      return undefined
    }
  }
  return current
}
