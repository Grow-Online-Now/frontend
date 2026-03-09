/**
 * NodePalette
 * Floating panel for adding nodes to the workflow canvas
 * Features category accordion, search, and AI agent section
 */

import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronRight, Search, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NODE_CATEGORIES, NODE_TYPE_DEFINITIONS } from '@/data/workflow-mocks'
import type { NodeCategory } from '@/types/workflow'

export function NodePalette() {
  const { t } = useTranslation()
  const [openCategory, setOpenCategory] = useState<NodeCategory | null>('media')
  const [searchQuery, setSearchQuery] = useState('')

  const nodesByCategory = useMemo(() => {
    const map: Record<string, typeof NODE_TYPE_DEFINITIONS[string][]> = {}
    for (const [, def] of Object.entries(NODE_TYPE_DEFINITIONS)) {
      if (!map[def.category]) map[def.category] = []
      map[def.category].push(def)
    }
    return map
  }, [])

  const filteredNodes = useMemo(() => {
    if (!searchQuery) return null
    const q = searchQuery.toLowerCase()
    return Object.values(NODE_TYPE_DEFINITIONS).filter(
      (def) =>
        t(def.nameKey).toLowerCase().includes(q) ||
        t(def.descriptionKey).toLowerCase().includes(q)
    )
  }, [searchQuery, t])

  return (
    <div className="absolute left-3 top-3 z-10 w-[200px] rounded-xl border border-border-subtle bg-bg-elevated/95 backdrop-blur-xl">
      {/* Header */}
      <div className="px-3 pt-2.5 pb-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {t('dashboard.workflows.editor.addNode')}
      </div>

      <div className="px-2 pb-1">
        {/* Search */}
        <div className="relative mb-1.5">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('dashboard.workflows.editor.searchNodes')}
            className="w-full rounded-md border border-border-subtle bg-bg-hover py-1.5 pl-8 pr-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-border-focus focus:outline-none"
          />
        </div>

        {/* Search results */}
        {filteredNodes ? (
          <div className="py-1">
            {filteredNodes.map((def) => (
              <NodeItem key={def.key} def={def} t={t} />
            ))}
            {filteredNodes.length === 0 && (
              <div className="px-2 py-3 text-center text-xs text-muted-foreground">
                {t('dashboard.workflows.editor.searchNodes')}
              </div>
            )}
          </div>
        ) : (
          /* Category accordion */
          NODE_CATEGORIES.map((cat) => (
            <div key={cat.key}>
              <button
                type="button"
                onClick={() => setOpenCategory(openCategory === cat.key ? null : cat.key)}
                className={cn(
                  'flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-all duration-150',
                  openCategory === cat.key
                    ? 'bg-bg-hover text-foreground'
                    : 'text-muted-foreground hover:bg-bg-hover hover:text-foreground'
                )}
              >
                <span className="flex items-center gap-2">
                  <cat.icon className="h-3.5 w-3.5" />
                  {t(cat.labelKey)}
                </span>
                <ChevronRight
                  className={cn(
                    'h-3 w-3 transition-transform duration-150',
                    openCategory === cat.key && 'rotate-90'
                  )}
                />
              </button>
              {openCategory === cat.key && nodesByCategory[cat.key] && (
                <div className="py-0.5 pl-2">
                  {nodesByCategory[cat.key].map((def) => (
                    <NodeItem key={def.key} def={def} t={t} />
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* AI Agent box */}
      <div className="mx-2 mb-2 rounded-lg border border-[rgba(139,92,246,0.2)] bg-[rgba(139,92,246,0.15)] p-3">
        <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-[#8b5cf6]">
          <Sparkles className="h-3 w-3" />
          {t('dashboard.workflows.editor.aiAgent')}
        </div>
        <p className="mb-1.5 text-xs leading-snug text-muted-foreground">
          {t('dashboard.workflows.editor.aiAgentDesc')}
        </p>
        <div className="rounded-sm border border-[rgba(139,92,246,0.1)] bg-[rgba(139,92,246,0.15)] px-2 py-1 text-xs text-text-muted">
          {t('dashboard.workflows.editor.aiAgentPlaceholder')}
        </div>
      </div>
    </div>
  )
}

function NodeItem({
  def,
  t,
}: {
  def: typeof NODE_TYPE_DEFINITIONS[string]
  t: (key: string) => string
}) {
  const Icon = def.icon
  return (
    <div className="flex cursor-grab items-center gap-2 rounded-sm px-2.5 py-1 text-xs text-muted-foreground transition-all duration-150 hover:bg-bg-hover hover:text-foreground">
      <Icon className="h-3.5 w-3.5" />
      <span>{t(def.nameKey)}</span>
    </div>
  )
}
