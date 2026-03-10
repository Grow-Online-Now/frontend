/**
 * PreviewTab
 * Shows output data from the last execution of the selected node.
 * Renders arrays (like video lists) as expandable items and scalars as key/value pairs.
 * Uses CSS variable tokens — always rendered inside .dark wrapper.
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDown, ChevronRight, Copy, Check } from 'lucide-react'
import { useWorkflowEditorStore } from '@/stores/workflowEditorStore'

export function PreviewTab() {
  const { t } = useTranslation()
  const selectedNodeId = useWorkflowEditorStore((s) => s.selectedNodeId)
  const lastRun = useWorkflowEditorStore((s) => s.lastRun)
  const workflow = useWorkflowEditorStore((s) => s.workflow)
  const nodeTypeMap = useWorkflowEditorStore((s) => s.nodeTypeMap)

  const node = workflow?.nodes.find((n) => n.id === selectedNodeId)
  const def = node ? nodeTypeMap[node.type] : null

  const stepResult = lastRun?.steps.find((s) => s.nodeId === selectedNodeId)
  const outputData = stepResult?.output

  if (!outputData || Object.keys(outputData).length === 0) {
    return (
      <p className="text-sm text-text-muted">
        {t('dashboard.workflows.editor.noPreview')}
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Reference hint at top */}
      {node && def && (
        <div className="rounded-lg border border-border-subtle bg-bg-elevated p-2 text-[11px] text-text-muted">
          {t('dashboard.workflows.editor.reference')}:{' '}
          <span className="font-mono" style={{ color: '#8b5cf6' }}>
            {'{{ ' + node.id + '.<key> }}'}
          </span>
        </div>
      )}

      {Object.entries(outputData).map(([key, value]) => (
        <PreviewEntry key={key} outputKey={key} value={value} nodeId={selectedNodeId!} />
      ))}
    </div>
  )
}

function PreviewEntry({ outputKey, value, nodeId }: { outputKey: string; value: unknown; nodeId: string }) {
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)

  const reference = `{{ ${nodeId}.${outputKey} }}`

  function handleCopy() {
    navigator.clipboard.writeText(reference)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const isArray = Array.isArray(value)
  const isObject = typeof value === 'object' && value !== null && !isArray

  return (
    <div>
      <div className="mb-1 flex items-center gap-2">
        <div className="flex-1 text-xs font-medium uppercase tracking-wider text-text-tertiary">
          {outputKey}
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="flex h-5 items-center gap-1 rounded px-1 text-[10px] text-text-muted transition-colors hover:text-text-secondary"
          title={reference}
        >
          {copied ? (
            <Check style={{ width: 10, height: 10, color: '#22c55e' }} />
          ) : (
            <Copy style={{ width: 10, height: 10 }} />
          )}
        </button>
      </div>

      {isArray ? (
        <div>
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="flex w-full items-center gap-1.5 rounded-lg border border-border-subtle bg-bg-elevated px-3 py-2 text-left text-xs text-text-secondary transition-colors hover:bg-bg-hover"
          >
            {expanded ? (
              <ChevronDown style={{ width: 12, height: 12 }} />
            ) : (
              <ChevronRight style={{ width: 12, height: 12 }} />
            )}
            <span className="font-mono text-text-muted">
              Array[{(value as unknown[]).length}]
            </span>
          </button>
          {expanded && (
            <div className="mt-1 flex max-h-60 flex-col gap-1 overflow-y-auto">
              {(value as unknown[]).map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-border-subtle bg-bg-elevated px-3 py-2"
                >
                  {typeof item === 'object' && item !== null ? (
                    <div className="flex flex-col gap-1">
                      {Object.entries(item as Record<string, unknown>).map(([k, v]) => (
                        <div key={k} className="flex items-start gap-2 text-xs">
                          <span className="shrink-0 font-mono text-text-muted">{k}:</span>
                          <span className="break-all text-text-secondary">
                            {v === null || v === undefined
                              ? '—'
                              : typeof v === 'object'
                                ? JSON.stringify(v)
                                : String(v)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="break-all font-mono text-xs text-text-secondary">
                      {String(item)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : isObject ? (
        <pre className="max-h-32 overflow-auto rounded-lg border border-border-subtle bg-bg-elevated px-3 py-2 font-mono text-xs text-text-secondary">
          {JSON.stringify(value, null, 2)}
        </pre>
      ) : (
        <div className="break-all rounded-lg border border-border-subtle bg-bg-elevated px-3 py-2 font-mono text-xs text-text-secondary">
          {String(value)}
        </div>
      )}
    </div>
  )
}
