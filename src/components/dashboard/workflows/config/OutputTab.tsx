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
    return <p className="text-text-muted text-sm">{t('dashboard.workflows.editor.noPreview')}</p>
  }

  return (
    <div>
      <div className="text-text-tertiary mb-2 text-xs font-medium tracking-wider uppercase">
        {t('dashboard.workflows.editor.outputSchema')}
      </div>

      <div className="flex flex-col gap-1.5">
        {def.outputPorts.map((port) => (
          <div
            key={port.key}
            className="border-border-subtle bg-bg-elevated flex items-center justify-between rounded-lg border px-3 py-2"
          >
            <div>
              <span className="text-text-secondary font-mono text-sm">{port.key}</span>
              {port.label && <span className="text-text-muted ml-2 text-xs">{port.label}</span>}
            </div>
            <span className="bg-bg-active text-text-tertiary rounded-sm px-1.5 py-0.5 font-mono text-[10px]">
              {port.type}
            </span>
          </div>
        ))}
      </div>

      {/* Reference hint */}
      <div className="border-border-subtle bg-bg-elevated text-text-muted mt-3 rounded-lg border p-2.5 text-xs">
        {t('dashboard.workflows.editor.reference')}:{' '}
        <span className="font-mono" style={{ color: '#8b5cf6' }}>
          {'{{ ' + node!.id + '.' + def.outputPorts[0].key + ' }}'}
        </span>
      </div>
    </div>
  )
}
