/**
 * NodeConfigPanel
 * Right panel with Config / Preview / Output tabs for the selected node
 */

import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { useWorkflowEditorStore } from '@/stores/workflowEditorStore'
import { NODE_TYPE_DEFINITIONS } from '@/data/workflow-mocks'
import { ConfigTab } from './ConfigTab'
import { PreviewTab } from './PreviewTab'
import { OutputTab } from './OutputTab'

const TABS = [
  { key: 'config' as const, labelKey: 'dashboard.workflows.editor.tabs.config' },
  { key: 'preview' as const, labelKey: 'dashboard.workflows.editor.tabs.preview' },
  { key: 'output' as const, labelKey: 'dashboard.workflows.editor.tabs.output' },
]

export function NodeConfigPanel() {
  const { t } = useTranslation()
  const workflow = useWorkflowEditorStore((s) => s.workflow)
  const selectedNodeId = useWorkflowEditorStore((s) => s.selectedNodeId)
  const rightPanelTab = useWorkflowEditorStore((s) => s.rightPanelTab)
  const setRightPanelTab = useWorkflowEditorStore((s) => s.setRightPanelTab)

  const node = workflow?.nodes.find((n) => n.id === selectedNodeId)
  const def = node ? NODE_TYPE_DEFINITIONS[node.type] : null

  if (!node || !def) return null

  const Icon = def.icon

  return (
    <div className="flex w-[280px] shrink-0 flex-col border-l border-border-subtle bg-bg-elevated">
      {/* Header */}
      <div className="border-b border-border-subtle p-4">
        <div className="flex items-center gap-2.5">
          <Icon className="h-5 w-5 text-foreground" />
          <div>
            <div className="text-sm font-semibold text-foreground">{t(def.nameKey)}</div>
            <div className="text-xs text-muted-foreground">{t(def.descriptionKey)}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border-subtle">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setRightPanelTab(tab.key)}
            className={cn(
              'flex-1 py-2.5 text-center text-xs font-medium transition-colors duration-150',
              rightPanelTab === tab.key
                ? 'border-b-2 border-foreground text-foreground'
                : 'border-b-2 border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {t(tab.labelKey)}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-4">
        {rightPanelTab === 'config' && <ConfigTab />}
        {rightPanelTab === 'preview' && <PreviewTab />}
        {rightPanelTab === 'output' && <OutputTab />}
      </div>
    </div>
  )
}
