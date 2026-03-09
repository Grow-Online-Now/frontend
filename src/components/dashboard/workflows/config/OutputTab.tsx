/**
 * OutputTab
 * Displays output ports for the selected node with variable reference hints.
 * Uses CSS variable tokens — always rendered inside .dark wrapper.
 */

import { useTranslation } from 'react-i18next'
import { useWorkflowEditorStore } from '@/stores/workflowEditorStore'

export function OutputTab() {
  const { t } = useTranslation()
  const workflow = useWorkflowEditorStore((s) => s.workflow)
  const nodeTypeMap = useWorkflowEditorStore((s) => s.nodeTypeMap)
  const selectedNodeId = useWorkflowEditorStore((s) => s.selectedNodeId)

  const node = workflow?.nodes.find((n) => n.id === selectedNodeId)
  const def = node ? nodeTypeMap[node.type] : null

  if (!def?.outputPorts?.length) {
    return (
      <p className="text-sm text-text-muted">
        {t('dashboard.workflows.editor.noPreview')}
      </p>
    )
  }

  return (
    <div>
      <div className="mb-2 text-xs font-medium uppercase tracking-wider text-text-tertiary">
        {t('dashboard.workflows.editor.outputSchema')}
      </div>

      <div className="flex flex-col gap-1.5">
        {def.outputPorts.map((port) => (
          <div
            key={port.key}
            className="flex items-center justify-between rounded-lg border border-border-subtle bg-bg-elevated px-3 py-2"
          >
            <div>
              <span className="font-mono text-sm text-text-secondary">
                {port.key}
              </span>
              {port.label && (
                <span className="ml-2 text-xs text-text-muted">
                  {port.label}
                </span>
              )}
            </div>
            <span className="rounded-sm bg-bg-active px-1.5 py-0.5 font-mono text-[10px] text-text-tertiary">
              {port.type}
            </span>
          </div>
        ))}
      </div>

      {/* Reference hint */}
      <div className="mt-3 rounded-lg border border-border-subtle bg-bg-elevated p-2.5 text-xs text-text-muted">
        {t('dashboard.workflows.editor.reference')}:{' '}
        <span className="font-mono" style={{ color: '#8b5cf6' }}>
          {'{{ ' + node!.id + '.' + def.outputPorts[0].key + ' }}'}
        </span>
      </div>
    </div>
  )
}
