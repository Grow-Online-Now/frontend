/**
 * ConfigTab
 * Renders form fields for the selected node's configuration.
 * Text/textarea fields support {{ variable }} insertion from upstream nodes.
 * Uses CSS variable tokens — always rendered inside .dark wrapper.
 */

import { useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useWorkflowEditorStore } from '@/stores/workflowEditorStore'
import { VariablePicker } from './VariablePicker'
import type { ConfigFieldSchema } from '@/types/workflow'

const INPUT_CLASS =
  'w-full rounded-lg border border-border-subtle bg-bg-elevated px-3 py-2 text-sm text-text-secondary outline-none transition-colors duration-150 focus:border-border-focus'

/** Detect {{ ... }} tokens in a string value */
function hasVariableRef(value: unknown): boolean {
  return typeof value === 'string' && /\{\{\s*\w+\.[\w.\[\]]+\s*\}\}/.test(value)
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

  // Check if current node has any upstream connections
  const hasUpstream = workflow?.edges.some((e) => e.targetNodeId === node.id) ?? false

  return (
    <div className="flex flex-col gap-5">
      {def.configSchema.map((field) => (
        <ConfigField
          key={field.key}
          field={field}
          nodeId={node.id}
          value={node.config[field.key]}
          hasUpstream={hasUpstream}
          updateNodeConfig={updateNodeConfig}
        />
      ))}

      {def.configSchema.length === 0 && (
        <p className="text-sm text-text-muted">
          {t('dashboard.workflows.editor.noConfig')}
        </p>
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
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)

  const currentValue = String(value ?? field.default ?? '')
  const isTextLike = field.type === 'text' || field.type === 'textarea' || field.type === 'variable_ref'
  const showPicker = isTextLike && hasUpstream

  const handleInsert = useCallback(
    (variable: string) => {
      const el = inputRef.current
      if (!el) {
        // Fallback: append
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
      // Restore cursor after inserted text
      const cursorPos = start + variable.length
      requestAnimationFrame(() => {
        el.focus()
        el.setSelectionRange(cursorPos, cursorPos)
      })
    },
    [currentValue, nodeId, field.key, updateNodeConfig],
  )

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label className="block text-xs font-medium uppercase tracking-wider text-text-tertiary">
          {field.label}
        </label>
        {showPicker && <VariablePicker onInsert={handleInsert} />}
      </div>
      {field.description && (
        <p className="mb-2 text-xs text-text-muted">{field.description}</p>
      )}

      {(field.type === 'textarea' || field.type === 'variable_ref') ? (
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
          <span className="text-sm text-text-secondary">{field.label}</span>
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

      {/* Inline preview of resolved variable tokens */}
      {hasVariableRef(value) && (
        <VariableTokenPreview value={String(value)} />
      )}
    </div>
  )
}

/** Renders the variable tokens found in a value as styled chips */
function VariableTokenPreview({ value }: { value: string }) {
  const workflow = useWorkflowEditorStore((s) => s.workflow)
  const nodeTypeMap = useWorkflowEditorStore((s) => s.nodeTypeMap)
  const lastRun = useWorkflowEditorStore((s) => s.lastRun)

  const tokens = [...value.matchAll(/\{\{\s*(\w+)\.([\w.\[\]]+)\s*\}\}/g)]
  if (tokens.length === 0) return null

  return (
    <div className="mt-1.5 flex flex-wrap gap-1">
      {tokens.map((match, i) => {
        const [, nodeId, path] = match
        const sourceDef = workflow?.nodes.find((n) => n.id === nodeId)
        const typeDef = sourceDef ? nodeTypeMap[sourceDef.type] : null
        const step = lastRun?.steps.find((s) => s.nodeId === nodeId)
        const previewVal = step?.output ? resolvePathClient(step.output, path) : undefined
        const label = typeDef?.name ?? nodeId

        return (
          <span
            key={i}
            className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-mono text-[10px]"
            style={{
              background: 'rgba(139,92,246,0.12)',
              color: '#a78bfa',
              border: '1px solid rgba(139,92,246,0.2)',
            }}
            title={
              previewVal !== undefined && previewVal !== null
                ? `${label}.${path} = ${typeof previewVal === 'object' ? JSON.stringify(previewVal) : String(previewVal)}`
                : `${label}.${path}`
            }
          >
            {label}.{path}
            {previewVal !== undefined && previewVal !== null && (
              <span className="max-w-20 truncate text-text-muted">
                = {typeof previewVal === 'object' ? '{...}' : String(previewVal)}
              </span>
            )}
          </span>
        )
      })}
    </div>
  )
}

/** Resolve a dot/bracket path on a JS object (mirrors backend resolvePath). */
function resolvePathClient(obj: unknown, path: string): unknown {
  const segments = path.replace(/\[(\d+)\]/g, '.$1').split('.').filter(Boolean)
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
