/**
 * NodeConfigPanel
 * Right panel with conditional tabs based on view mode:
 * - Editor mode: Config / Preview / Output
 * - Execution mode: Execution / Config
 * Uses CSS variable tokens — always rendered inside .dark wrapper.
 */

import { useTranslation } from 'react-i18next'
import { MousePointerClick } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getNodeIcon, CATEGORY_ACCENT_COLORS, CATEGORY_ICON_BG } from '@/lib/workflow-utils'
import { useWorkflowEditorStore } from '@/stores/workflowEditorStore'
import type { RightPanelTab } from '@/stores/workflowEditorStore'
import { ConfigTab } from './ConfigTab'
import { PreviewTab } from './PreviewTab'
import { OutputTab } from './OutputTab'
import { ExecutionDataTab } from './ExecutionDataTab'

const EDITOR_TABS: { key: RightPanelTab; labelKey: string }[] = [
  { key: 'config', labelKey: 'dashboard.workflows.editor.tabs.config' },
  { key: 'preview', labelKey: 'dashboard.workflows.editor.tabs.preview' },
  { key: 'output', labelKey: 'dashboard.workflows.editor.tabs.output' },
]

const EXECUTION_TABS: { key: RightPanelTab; labelKey: string }[] = [
  { key: 'execution', labelKey: 'dashboard.workflows.execution.tab' },
  { key: 'config', labelKey: 'dashboard.workflows.editor.tabs.config' },
]

export function NodeConfigPanel() {
  const { t } = useTranslation()
  const workflow = useWorkflowEditorStore((s) => s.workflow)
  const nodeTypeMap = useWorkflowEditorStore((s) => s.nodeTypeMap)
  const selectedNodeId = useWorkflowEditorStore((s) => s.selectedNodeId)
  const rightPanelTab = useWorkflowEditorStore((s) => s.rightPanelTab)
  const setRightPanelTab = useWorkflowEditorStore((s) => s.setRightPanelTab)
  const viewMode = useWorkflowEditorStore((s) => s.viewMode)

  const node = workflow?.nodes.find((n) => n.id === selectedNodeId)
  const def = node ? nodeTypeMap[node.type] : null

  const isExecMode = viewMode === 'execution'
  const tabs = isExecMode ? EXECUTION_TABS : EDITOR_TABS

  if (!node || !def) {
    return (
      <div className="flex w-[360px] shrink-0 flex-col border-l border-border-subtle bg-bg-subtle">
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-5 text-center">
          <MousePointerClick className="h-6 w-6 text-text-muted" />
          <p className="text-xs text-text-muted">
            {t('dashboard.workflows.editor.selectNode')}
          </p>
        </div>
      </div>
    )
  }

  const Icon = getNodeIcon(def.icon)
  const accent = CATEGORY_ACCENT_COLORS[def.category] ?? '#666'
  const iconBg = CATEGORY_ICON_BG[def.category] ?? 'rgba(255,255,255,0.05)'

  // Ensure the current tab is valid for the current mode
  const activeTab = tabs.some((t) => t.key === rightPanelTab) ? rightPanelTab : tabs[0].key

  return (
    <div className="flex w-[360px] shrink-0 flex-col border-l border-border-subtle bg-bg-subtle">
      {/* Header */}
      <div className="border-b border-border-subtle px-5 py-4">
        <div className="flex items-center gap-3">
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
            style={{ background: iconBg }}
          >
            <Icon style={{ width: 16, height: 16, color: accent }} />
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-text-primary">
              {def.name}
            </div>
            <div className="truncate text-xs text-text-tertiary">
              {def.description}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border-subtle">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setRightPanelTab(tab.key)}
              className={cn(
                'flex-1 py-2.5 text-center text-xs font-medium transition-colors duration-150',
                isActive ? 'text-text-primary' : 'text-text-muted'
              )}
              style={{
                borderBottom: isActive
                  ? `2px solid ${accent}`
                  : '2px solid transparent',
              }}
            >
              {t(tab.labelKey)}
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {activeTab === 'config' && <ConfigTab />}
        {activeTab === 'preview' && <PreviewTab />}
        {activeTab === 'output' && <OutputTab />}
        {activeTab === 'execution' && <ExecutionDataTab />}
      </div>
    </div>
  )
}
