/**
 * PreviewTab
 * Shows output data from the last execution of the selected node.
 * Uses CSS variable tokens — always rendered inside .dark wrapper.
 */

import { useTranslation } from 'react-i18next'
import { useWorkflowEditorStore } from '@/stores/workflowEditorStore'

export function PreviewTab() {
  const { t } = useTranslation()
  const selectedNodeId = useWorkflowEditorStore((s) => s.selectedNodeId)
  const lastRun = useWorkflowEditorStore((s) => s.lastRun)

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
      {Object.entries(outputData).map(([key, value]) => (
        <div key={key}>
          <div className="mb-1 text-xs font-medium uppercase tracking-wider text-text-tertiary">
            {key}
          </div>
          <div className="max-h-14 overflow-hidden break-all rounded-lg border border-border-subtle bg-bg-elevated px-3 py-2 font-mono text-xs text-text-secondary">
            {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
          </div>
        </div>
      ))}
    </div>
  )
}
