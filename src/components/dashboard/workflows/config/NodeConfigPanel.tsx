/**
 * NodeConfigPanel
 * Right panel with Config / Preview / Output tabs for the selected node.
 * Uses CSS variable tokens — always rendered inside .dark wrapper.
 */

import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { getNodeIcon, CATEGORY_ACCENT_COLORS, CATEGORY_ICON_BG } from '@/lib/workflow-utils'
import { useWorkflowEditorStore } from '@/stores/workflowEditorStore'
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
  const nodeTypeMap = useWorkflowEditorStore((s) => s.nodeTypeMap)
  const selectedNodeId = useWorkflowEditorStore((s) => s.selectedNodeId)
  const rightPanelTab = useWorkflowEditorStore((s) => s.rightPanelTab)
  const setRightPanelTab = useWorkflowEditorStore((s) => s.setRightPanelTab)

  const node = workflow?.nodes.find((n) => n.id === selectedNodeId)
  const def = node ? nodeTypeMap[node.type] : null

  if (!node || !def) return null

  const Icon = getNodeIcon(def.icon)
  const accent = CATEGORY_ACCENT_COLORS[def.category] ?? '#666'
  const iconBg = CATEGORY_ICON_BG[def.category] ?? 'rgba(255,255,255,0.05)'

  return (
    <div className="flex w-[280px] shrink-0 flex-col overflow-hidden border-l border-border-subtle bg-bg-subtle">
      {/* Header */}
      <div className="border-b border-border-subtle p-4">
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
        {TABS.map((tab) => {
          const isActive = rightPanelTab === tab.key
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
      <div className="flex-1 overflow-y-auto p-4">
        {rightPanelTab === 'config' && <ConfigTab />}
        {rightPanelTab === 'preview' && <PreviewTab />}
        {rightPanelTab === 'output' && <OutputTab />}
      </div>
    </div>
  )
}
