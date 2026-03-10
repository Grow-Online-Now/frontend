/**
 * VariablePicker
 * Dropdown to pick upstream node output variables and insert them into config fields.
 * Shows all output ports from upstream nodes.
 * For array ports with execution data, also shows nested sub-paths (e.g. videos[0].url).
 */

import { useState, useRef, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Braces } from 'lucide-react'
import { getNodeIcon, CATEGORY_ACCENT_COLORS } from '@/lib/workflow-utils'
import { useWorkflowEditorStore } from '@/stores/workflowEditorStore'

interface VariablePickerProps {
  onInsert: (variable: string) => void
}

interface VariableEntry {
  nodeId: string
  nodeName: string
  nodeIcon: string
  nodeCategory: string
  path: string
  label: string
  portType: string
  reference: string
  preview: string | null
  indent: number
}

export function VariablePicker({ onInsert }: VariablePickerProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const workflow = useWorkflowEditorStore((s) => s.workflow)
  const nodeTypeMap = useWorkflowEditorStore((s) => s.nodeTypeMap)
  const selectedNodeId = useWorkflowEditorStore((s) => s.selectedNodeId)
  const lastRun = useWorkflowEditorStore((s) => s.lastRun)

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  // Collect upstream node IDs via edges (walk backward)
  const upstreamNodeIds = useMemo(() => {
    if (!workflow || !selectedNodeId) return new Set<string>()
    const ids = new Set<string>()
    const queue = [selectedNodeId]
    while (queue.length > 0) {
      const current = queue.shift()!
      for (const edge of workflow.edges) {
        if (edge.targetNodeId === current && !ids.has(edge.sourceNodeId)) {
          ids.add(edge.sourceNodeId)
          queue.push(edge.sourceNodeId)
        }
      }
    }
    return ids
  }, [workflow, selectedNodeId])

  // Build variable entries: top-level ports + nested sub-paths from execution data
  const entries = useMemo<VariableEntry[]>(() => {
    if (!workflow) return []
    const list: VariableEntry[] = []

    for (const node of workflow.nodes) {
      if (!upstreamNodeIds.has(node.id)) continue
      const def = nodeTypeMap[node.type]
      if (!def?.outputPorts?.length) continue

      const step = lastRun?.steps.find((s) => s.nodeId === node.id)

      for (const port of def.outputPorts) {
        const portValue = step?.output?.[port.key]
        const previewStr = formatPreview(portValue)

        // Top-level entry
        list.push({
          nodeId: node.id,
          nodeName: def.name,
          nodeIcon: def.icon,
          nodeCategory: def.category,
          path: port.key,
          label: port.label,
          portType: port.type,
          reference: `{{ ${node.id}.${port.key} }}`,
          preview: previewStr,
          indent: 0,
        })

        // For array ports with data, show first item's fields as sub-paths
        if (port.type === 'array' && Array.isArray(portValue) && portValue.length > 0) {
          const firstItem = portValue[0]
          if (typeof firstItem === 'object' && firstItem !== null) {
            for (const [subKey, subVal] of Object.entries(firstItem as Record<string, unknown>)) {
              list.push({
                nodeId: node.id,
                nodeName: def.name,
                nodeIcon: def.icon,
                nodeCategory: def.category,
                path: `${port.key}[0].${subKey}`,
                label: subKey,
                portType: typeof subVal === 'number' ? 'number' : 'string',
                reference: `{{ ${node.id}.${port.key}[0].${subKey} }}`,
                preview: formatPreview(subVal),
                indent: 1,
              })
            }
          }
        }
      }
    }
    return list
  }, [workflow, upstreamNodeIds, nodeTypeMap, lastRun])

  if (entries.length === 0) return null

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-8 items-center gap-1.5 rounded-lg border border-border-subtle px-2.5 text-xs text-text-muted transition-colors duration-150 hover:border-border-emphasis hover:text-text-secondary"
        title={t('dashboard.workflows.editor.insertVariable')}
      >
        <Braces style={{ width: 14, height: 14 }} />
        <span>{t('dashboard.workflows.editor.insertVariable')}</span>
      </button>

      {open && (
        <div
          className="absolute right-0 z-50 mt-1 max-h-80 w-72 overflow-y-auto rounded-xl border border-border-subtle bg-bg-elevated shadow-lg"
          style={{ top: '100%' }}
        >
          <div className="px-3 pb-1.5 pt-2.5 text-[10px] font-medium uppercase tracking-wider text-text-muted">
            {t('dashboard.workflows.editor.availableVariables')}
          </div>

          {entries.map((v) => {
            const Icon = getNodeIcon(v.nodeIcon)
            const accent =
              CATEGORY_ACCENT_COLORS[v.nodeCategory as keyof typeof CATEGORY_ACCENT_COLORS] ?? '#666'

            return (
              <button
                key={`${v.nodeId}.${v.path}`}
                type="button"
                onClick={() => {
                  onInsert(v.reference)
                  setOpen(false)
                }}
                className="flex w-full flex-col gap-1 border-b border-border-subtle px-3 py-2 text-left transition-colors duration-150 last:border-b-0 hover:bg-bg-hover"
                style={{ paddingLeft: v.indent ? 28 : 12 }}
              >
                {v.indent === 0 && (
                  <div className="flex items-center gap-2">
                    <Icon style={{ width: 12, height: 12, color: accent, flexShrink: 0 }} />
                    <span className="truncate text-xs text-text-tertiary">{v.nodeName}</span>
                    <span className="rounded-sm bg-bg-active px-1 py-0.5 font-mono text-[10px] text-text-muted">
                      {v.portType}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs" style={{ color: v.indent ? '#a78bfa' : accent }}>
                    {v.indent ? `[0].${v.label}` : v.path}
                  </span>
                  {v.indent === 0 && (
                    <span className="text-[11px] text-text-muted">{v.label}</span>
                  )}
                </div>
                {v.preview !== null && (
                  <div className="mt-0.5 max-h-6 overflow-hidden truncate rounded bg-bg-active px-1.5 py-0.5 font-mono text-[10px] text-text-muted">
                    {v.preview}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function formatPreview(value: unknown): string | null {
  if (value === undefined || value === null) return null
  if (Array.isArray(value)) return `Array[${value.length}]`
  if (typeof value === 'object') return JSON.stringify(value).slice(0, 80)
  const s = String(value)
  return s.length > 80 ? s.slice(0, 77) + '...' : s
}
