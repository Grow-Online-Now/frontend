/**
 * PreviewTab
 * Shows preview data from the last execution of the selected node
 */

import { useTranslation } from 'react-i18next'
import { useWorkflowEditorStore } from '@/stores/workflowEditorStore'
import { MOCK_PREVIEW_DATA } from '@/data/workflow-mocks'

export function PreviewTab() {
  const { t } = useTranslation()
  const workflow = useWorkflowEditorStore((s) => s.workflow)
  const selectedNodeId = useWorkflowEditorStore((s) => s.selectedNodeId)

  const node = workflow?.nodes.find((n) => n.id === selectedNodeId)
  const previewData = node ? MOCK_PREVIEW_DATA[node.type] : null

  if (!previewData) {
    return (
      <p className="text-sm text-muted-foreground">
        {t('dashboard.workflows.editor.noPreview')}
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {Object.entries(previewData).map(([key, value]) => (
        <div key={key}>
          <div className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {key}
          </div>
          <div className="max-h-14 overflow-hidden break-all rounded-md border border-border-subtle bg-bg-hover px-2.5 py-2 font-mono text-xs text-muted-foreground">
            {String(value)}
          </div>
        </div>
      ))}
    </div>
  )
}
