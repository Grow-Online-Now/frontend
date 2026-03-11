/**
 * VariablePicker
 * Floating dropdown (rendered via portal) to browse and insert upstream node variables.
 * For array ports with execution data, shows nested sub-paths (e.g. videos[0].url).
 */

import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { createPortal } from 'react-dom'
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
  isGroupHeader: boolean
}

export function VariablePicker({ onInsert }: VariablePickerProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ top: 0, left: 0 })

  const workflow = useWorkflowEditorStore((s) => s.workflow)
  const nodeTypeMap = useWorkflowEditorStore((s) => s.nodeTypeMap)
  const selectedNodeId = useWorkflowEditorStore((s) => s.selectedNodeId)
  const lastRun = useWorkflowEditorStore((s) => s.lastRun)

  // Position dropdown below button
  useEffect(() => {
    if (!open || !buttonRef.current) return
    const rect = buttonRef.current.getBoundingClientRect()
    setPos({
      top: rect.bottom + 4,
      left: Math.max(8, rect.right - 320),
    })
  }, [open])

  // Close on outside click or scroll
  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (
        buttonRef.current?.contains(e.target as Node) ||
        dropdownRef.current?.contains(e.target as Node)
      )
        return
      setOpen(false)
    }
    function handleScroll(e: Event) {
      if (dropdownRef.current?.contains(e.target as Node)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('scroll', handleScroll, true)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('scroll', handleScroll, true)
    }
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

  // Build variable entries
  const entries = useMemo<VariableEntry[]>(() => {
    if (!workflow) return []
    const list: VariableEntry[] = []

    for (const node of workflow.nodes) {
      if (!upstreamNodeIds.has(node.id)) continue
      const def = nodeTypeMap[node.type]
      if (!def?.outputPorts?.length) continue

      const step = lastRun?.steps.find((s) => s.nodeId === node.id)

      // Group header
      list.push({
        nodeId: node.id,
        nodeName: def.name,
        nodeIcon: def.icon,
        nodeCategory: def.category,
        path: '',
        label: def.name,
        portType: '',
        reference: '',
        preview: null,
        indent: 0,
        isGroupHeader: true,
      })

      for (const port of def.outputPorts) {
        const portValue = step?.output?.[port.key]

        // Top-level port
        list.push({
          nodeId: node.id,
          nodeName: def.name,
          nodeIcon: def.icon,
          nodeCategory: def.category,
          path: port.key,
          label: port.label,
          portType: port.type,
          reference: `{{ ${node.id}.${port.key} }}`,
          preview: formatPreview(portValue),
          indent: 1,
          isGroupHeader: false,
        })

        // For array ports with data, show first item's fields
        if (port.type === 'array' && Array.isArray(portValue) && portValue.length > 0) {
          const firstItem = portValue[0]
          if (typeof firstItem === 'object' && firstItem !== null) {
            for (const [subKey, subVal] of Object.entries(
              firstItem as Record<string, unknown>,
            )) {
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
                indent: 2,
                isGroupHeader: false,
              })
            }
          }
        }
      }
    }
    return list
  }, [workflow, upstreamNodeIds, nodeTypeMap, lastRun])

  const handleInsert = useCallback(
    (ref: string) => {
      onInsert(ref)
      setOpen(false)
    },
    [onInsert],
  )

  if (entries.length === 0) return null

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-7 items-center gap-1.5 rounded-md border border-border-subtle px-2 text-[11px] text-text-muted transition-colors duration-150 hover:border-border-emphasis hover:text-text-secondary"
        title={t('dashboard.workflows.editor.insertVariable')}
      >
        <Braces style={{ width: 12, height: 12 }} />
        <span>{t('dashboard.workflows.editor.insertVariable')}</span>
      </button>

      {open &&
        createPortal(
          <div
            ref={dropdownRef}
            className="fixed z-[9999] max-h-96 w-80 overflow-y-auto rounded-xl border border-border-subtle bg-bg-elevated shadow-lg"
            style={{ top: pos.top, left: pos.left }}
          >
            <div className="px-3 pb-1 pt-2.5 text-[10px] font-medium uppercase tracking-wider text-text-muted">
              {t('dashboard.workflows.editor.availableVariables')}
            </div>

            {entries.map((v, idx) => {
              if (v.isGroupHeader) {
                const Icon = getNodeIcon(v.nodeIcon)
                const accent =
                  CATEGORY_ACCENT_COLORS[
                    v.nodeCategory as keyof typeof CATEGORY_ACCENT_COLORS
                  ] ?? '#666'
                return (
                  <div
                    key={`header-${v.nodeId}-${idx}`}
                    className="flex items-center gap-2 border-t border-border-subtle px-3 pb-1 pt-2.5 first:border-t-0"
                  >
                    <Icon
                      style={{
                        width: 12,
                        height: 12,
                        color: accent,
                        flexShrink: 0,
                      }}
                    />
                    <span className="text-xs font-medium text-text-tertiary">
                      {v.nodeName}
                    </span>
                  </div>
                )
              }

              const accent =
                CATEGORY_ACCENT_COLORS[
                  v.nodeCategory as keyof typeof CATEGORY_ACCENT_COLORS
                ] ?? '#666'

              return (
                <button
                  key={`${v.nodeId}.${v.path}`}
                  type="button"
                  onClick={() => handleInsert(v.reference)}
                  className="flex w-full items-start gap-2 px-3 py-1.5 text-left transition-colors duration-150 hover:bg-bg-hover"
                  style={{ paddingLeft: v.indent === 2 ? 32 : 20 }}
                >
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-center gap-2">
                      <span
                        className="font-mono text-xs"
                        style={{ color: v.indent === 2 ? '#a78bfa' : accent }}
                      >
                        {v.indent === 2 ? `[0].${v.label}` : v.path}
                      </span>
                      <span className="rounded-sm bg-bg-active px-1 py-0.5 font-mono text-[10px] text-text-muted">
                        {v.portType}
                      </span>
                      {v.indent === 1 && (
                        <span className="truncate text-[11px] text-text-muted">
                          {v.label}
                        </span>
                      )}
                    </div>
                    {v.preview !== null && (
                      <div className="mt-0.5 max-w-full truncate font-mono text-[10px] text-text-muted">
                        {v.preview}
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>,
          document.body,
        )}
    </>
  )
}

function formatPreview(value: unknown): string | null {
  if (value === undefined || value === null) return null
  if (Array.isArray(value)) return `Array[${value.length}]`
  if (typeof value === 'object') return JSON.stringify(value).slice(0, 100)
  const s = String(value)
  return s.length > 100 ? s.slice(0, 97) + '...' : s
}
