/**
 * NodePalette
 * Floating panel for adding nodes — uses CSS variable tokens.
 * Always rendered inside .dark wrapper.
 */

import { useState, useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronRight, Search, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  getNodeIcon,
  CATEGORY_CONFIG,
  CATEGORY_ORDER,
  CATEGORY_ACCENT_COLORS,
} from '@/lib/workflow-utils'
import { useWorkflowEditorStore } from '@/stores/workflowEditorStore'
import type { NodeCategory, NodeTypeDefinition } from '@/types/workflow'

interface NodePaletteProps {
  nodesByCategory: Record<NodeCategory, NodeTypeDefinition[]>
}

export function NodePalette({ nodesByCategory }: NodePaletteProps) {
  const { t } = useTranslation()
  const addNode = useWorkflowEditorStore((s) => s.addNode)
  const workflow = useWorkflowEditorStore((s) => s.workflow)
  const [openCategory, setOpenCategory] = useState<NodeCategory | null>('media')
  const [searchQuery, setSearchQuery] = useState('')

  const allNodeTypes = useMemo(() => {
    return Object.values(nodesByCategory).flat()
  }, [nodesByCategory])

  const filteredNodes = useMemo(() => {
    if (!searchQuery) return null
    const q = searchQuery.toLowerCase()
    return allNodeTypes.filter(
      (def) => def.name.toLowerCase().includes(q) || def.description.toLowerCase().includes(q)
    )
  }, [searchQuery, allNodeTypes])

  const handleAddNode = useCallback(
    (def: NodeTypeDefinition) => {
      const existingNodes = workflow?.nodes ?? []
      const baseX = 300
      const baseY = 150
      const offsetX = 240
      const offsetY = 90
      const col = Math.floor(existingNodes.length / 4)
      const row = existingNodes.length % 4

      addNode({
        id: `${def.type}_${Date.now()}`,
        type: def.type,
        position: { x: baseX + col * offsetX, y: baseY + row * offsetY },
        config: {},
      })
    },
    [addNode, workflow?.nodes]
  )

  return (
    <div
      className="border-border-subtle bg-bg-subtle absolute top-3 left-3 z-10 w-[200px] rounded-xl border"
      style={{ backdropFilter: 'blur(16px)' }}
    >
      {/* Header */}
      <div className="text-text-muted px-3 pt-2.5 pb-1.5 text-[10px] font-medium tracking-wider uppercase">
        {t('dashboard.workflows.editor.addNode')}
      </div>

      <div className="px-2 pb-1">
        {/* Search */}
        <div className="relative mb-1.5">
          <Search className="text-text-muted absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('dashboard.workflows.editor.searchNodes')}
            className="border-border-subtle bg-bg-elevated text-text-secondary focus:border-border-focus w-full rounded-md border py-1.5 pr-2.5 pl-8 text-xs transition-colors duration-150 outline-none"
          />
        </div>

        {/* Search results */}
        {filteredNodes ? (
          <div className="py-1">
            {filteredNodes.map((def) => (
              <NodeItem key={def.type} def={def} onAdd={handleAddNode} />
            ))}
            {filteredNodes.length === 0 && (
              <div className="text-text-muted px-2 py-3 text-center text-xs">
                {t('dashboard.workflows.editor.searchNodes')}
              </div>
            )}
          </div>
        ) : (
          CATEGORY_ORDER.map((catKey) => {
            const catConfig = CATEGORY_CONFIG[catKey]
            const nodes = nodesByCategory[catKey]
            if (!nodes || nodes.length === 0) return null
            const CatIcon = getNodeIcon(
              catKey === 'trigger'
                ? 'zap'
                : catKey === 'media'
                  ? 'film'
                  : catKey === 'text'
                    ? 'sparkles'
                    : catKey === 'logic'
                      ? 'branch'
                      : catKey === 'ai'
                        ? 'sparkles'
                        : 'upload'
            )
            const isOpen = openCategory === catKey
            const accent = CATEGORY_ACCENT_COLORS[catKey]
            return (
              <div key={catKey}>
                <button
                  type="button"
                  onClick={() => setOpenCategory(isOpen ? null : catKey)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs transition-all duration-150',
                    isOpen
                      ? 'bg-bg-hover text-text-secondary'
                      : 'text-text-tertiary hover:bg-bg-hover hover:text-text-secondary'
                  )}
                >
                  <span className="flex items-center gap-2">
                    <CatIcon
                      className="h-3.5 w-3.5"
                      style={{ color: isOpen ? accent : undefined }}
                    />
                    {t(catConfig.labelKey)}
                  </span>
                  <ChevronRight
                    className="h-3 w-3 transition-transform duration-150"
                    style={{
                      transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                    }}
                  />
                </button>
                {isOpen && (
                  <div className="py-0.5 pl-2">
                    {nodes.map((def) => (
                      <NodeItem key={def.type} def={def} onAdd={handleAddNode} />
                    ))}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* AI Agent box */}
      <div
        className="mx-2 mb-2 rounded-lg p-3"
        style={{
          border: '1px solid rgba(139,92,246,0.15)',
          background: 'rgba(139,92,246,0.06)',
        }}
      >
        <div
          className="mb-1 flex items-center gap-1.5 text-xs font-semibold"
          style={{ color: '#8b5cf6' }}
        >
          <Sparkles className="h-3 w-3" />
          {t('dashboard.workflows.editor.aiAgent')}
        </div>
        <p className="text-text-muted mb-1.5 text-[11px] leading-snug">
          {t('dashboard.workflows.editor.aiAgentDesc')}
        </p>
        <div
          className="text-text-muted rounded-sm px-2 py-1 text-[11px]"
          style={{
            border: '1px solid rgba(139,92,246,0.08)',
            background: 'rgba(139,92,246,0.06)',
          }}
        >
          {t('dashboard.workflows.editor.aiAgentPlaceholder')}
        </div>
      </div>
    </div>
  )
}

function NodeItem({
  def,
  onAdd,
}: {
  def: NodeTypeDefinition
  onAdd: (def: NodeTypeDefinition) => void
}) {
  const Icon = getNodeIcon(def.icon)
  return (
    <button
      type="button"
      onClick={() => onAdd(def)}
      className="text-text-tertiary hover:bg-bg-hover hover:text-text-secondary flex w-full cursor-grab items-center gap-2 rounded-sm px-2.5 py-1 text-xs transition-all duration-150"
    >
      <Icon className="h-3.5 w-3.5" />
      <span>{def.name}</span>
    </button>
  )
}
