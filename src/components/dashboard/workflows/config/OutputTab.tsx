/**
 * OutputTab
 * Displays output schema for the selected node with variable reference hints
 */

import { useTranslation } from 'react-i18next'
import { useWorkflowEditorStore } from '@/stores/workflowEditorStore'
import { NODE_TYPE_DEFINITIONS } from '@/data/workflow-mocks'

export function OutputTab() {
  const { t } = useTranslation()
  const workflow = useWorkflowEditorStore((s) => s.workflow)
  const selectedNodeId = useWorkflowEditorStore((s) => s.selectedNodeId)

  const node = workflow?.nodes.find((n) => n.id === selectedNodeId)
  const def = node ? NODE_TYPE_DEFINITIONS[node.type] : null

  if (!def?.outputs?.length) {
    return (
      <p className="text-sm text-muted-foreground">
        {t('dashboard.workflows.editor.noPreview')}
      </p>
    )
  }

  return (
    <div>
      <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {t('dashboard.workflows.editor.outputSchema')}
      </div>

      <div className="flex flex-col gap-1">
        {def.outputs.map((output) => (
          <div
            key={output.key}
            className="flex items-center justify-between rounded-md border border-border-subtle bg-bg-hover px-2.5 py-2"
          >
            <span className="font-mono text-sm text-foreground">{output.key}</span>
            <span className="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
              {output.type}
            </span>
          </div>
        ))}
      </div>

      {/* Reference hint */}
      <div className="mt-3 rounded-lg border border-border-subtle bg-bg-hover p-2.5 text-xs text-muted-foreground">
        {t('dashboard.workflows.editor.reference')}:{' '}
        <span className="font-mono text-[#8b5cf6]">
          {'{{ ' + node!.type + '.' + def.outputs[0].key + ' }}'}
        </span>
      </div>
    </div>
  )
}
