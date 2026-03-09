/**
 * ExecutionPanel
 * Bottom collapsible panel — thin shell managing tab state.
 * Draggable handle bar to resize; click to toggle when collapsed.
 */

import { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useWorkflowEditorStore } from '@/stores/workflowEditorStore'
import { useWorkflowRuns } from '@/hooks/useWorkflowRuns'
import { RunsTable } from './RunsTable'
import { LogsTab } from './LogsTab'

const TABS = ['executions', 'logs'] as const
const MIN_HEIGHT = 100
const MAX_HEIGHT = 500
const DEFAULT_HEIGHT = 170
const CLICK_THRESHOLD = 4

export function ExecutionPanel() {
  const { t } = useTranslation()
  const workflow = useWorkflowEditorStore((s) => s.workflow)
  const bottomPanelOpen = useWorkflowEditorStore((s) => s.bottomPanelOpen)
  const setBottomPanelOpen = useWorkflowEditorStore((s) => s.setBottomPanelOpen)
  const activeTab = useWorkflowEditorStore((s) => s.bottomPanelTab)
  const setActiveTab = useWorkflowEditorStore((s) => s.setBottomPanelTab)
  const { runs, isLoading } = useWorkflowRuns(workflow?.id)

  const [panelHeight, setPanelHeight] = useState(DEFAULT_HEIGHT)
  const dragRef = useRef<{ startY: number; startHeight: number; moved: boolean } | null>(null)

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      const startY = e.clientY
      const startHeight = bottomPanelOpen ? panelHeight : DEFAULT_HEIGHT
      dragRef.current = { startY, startHeight, moved: false }

      const onMouseMove = (ev: MouseEvent) => {
        if (!dragRef.current) return
        const delta = dragRef.current.startY - ev.clientY
        if (Math.abs(delta) > CLICK_THRESHOLD) {
          dragRef.current.moved = true
        }
        if (dragRef.current.moved) {
          if (!bottomPanelOpen) setBottomPanelOpen(true)
          const next = Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, dragRef.current.startHeight + delta))
          setPanelHeight(next)
        }
      }

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)
        document.body.style.cursor = ''
        document.body.style.userSelect = ''

        if (dragRef.current && !dragRef.current.moved) {
          // It was a click, not a drag — toggle
          setBottomPanelOpen(!bottomPanelOpen)
          if (!bottomPanelOpen) setPanelHeight(DEFAULT_HEIGHT)
        }
        dragRef.current = null
      }

      document.body.style.cursor = 'row-resize'
      document.body.style.userSelect = 'none'
      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    },
    [bottomPanelOpen, panelHeight, setBottomPanelOpen]
  )

  return (
    <div
      className="shrink-0 border-t border-border-subtle bg-bg-subtle"
      style={{ height: bottomPanelOpen ? panelHeight : undefined }}
    >
      {/* Drag handle — always visible */}
      <div
        onMouseDown={handleMouseDown}
        className="group flex h-[6px] cursor-row-resize items-center justify-center transition-colors duration-100 hover:bg-bg-hover"
      >
        <div className="h-[2px] w-8 rounded-full bg-border-default opacity-0 transition-opacity duration-100 group-hover:opacity-100" />
      </div>

      {!bottomPanelOpen && (
        <button
          type="button"
          onClick={() => {
            setBottomPanelOpen(true)
            setPanelHeight(DEFAULT_HEIGHT)
          }}
          className="flex w-full items-center justify-center gap-1.5 py-1 text-[10px] text-text-muted transition-colors hover:text-text-secondary"
        >
          <ChevronUp className="h-3 w-3" />
          {t('dashboard.workflows.executions.tabs.executions')}
        </button>
      )}

      {bottomPanelOpen && (
        <>
          {/* Tab bar */}
          <div className="flex items-center border-b border-border-subtle">
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'border-b-2 px-5 py-2 text-xs font-medium transition-colors',
                  activeTab === tab
                    ? 'border-border-emphasis text-text-primary'
                    : 'border-transparent text-text-muted hover:text-text-secondary'
                )}
              >
                {t(`dashboard.workflows.executions.tabs.${tab}`)}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setBottomPanelOpen(false)}
              className="ml-auto flex items-center gap-1 px-4 text-text-muted transition-colors hover:text-text-secondary"
            >
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Tab content */}
          {activeTab === 'executions' && (
            <RunsTable runs={runs} isLoading={isLoading} />
          )}
          {activeTab === 'logs' && <LogsTab runs={runs} />}
        </>
      )}
    </div>
  )
}
