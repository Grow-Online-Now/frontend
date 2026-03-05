/**
 * NodePalette Component
 * Sidebar listing available node types grouped by category
 */

import { useTranslation } from 'react-i18next'
import { Zap, FileCode, Send, HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { NodeHandlerDescriptor, NodeCategory } from '@/types/automations'

interface NodePaletteProps {
  nodeTypes: NodeHandlerDescriptor[]
  className?: string
}

const categoryConfig: Record<
  NodeCategory,
  {
    icon: React.ComponentType<{ className?: string }>
    labelKey: string
    iconColor: string
  }
> = {
  trigger: {
    icon: Zap,
    labelKey: 'dashboard.automations.editor.palette.triggers',
    iconColor: 'text-success',
  },
  processor: {
    icon: FileCode,
    labelKey: 'dashboard.automations.editor.palette.processors',
    iconColor: 'text-info',
  },
  action: {
    icon: Send,
    labelKey: 'dashboard.automations.editor.palette.actions',
    iconColor: 'text-warning',
  },
}

const categoryOrder: NodeCategory[] = ['trigger', 'processor', 'action']

export function NodePalette({ nodeTypes, className }: NodePaletteProps) {
  const { t } = useTranslation()

  const grouped = categoryOrder.reduce(
    (acc, category) => {
      acc[category] = nodeTypes.filter((n) => n.category === category)
      return acc
    },
    {} as Record<NodeCategory, NodeHandlerDescriptor[]>
  )

  const onDragStart = (event: React.DragEvent, nodeType: NodeHandlerDescriptor) => {
    event.dataTransfer.setData('application/reactflow-node', JSON.stringify(nodeType))
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div className={cn('bg-bg-elevated border-border w-60 overflow-y-auto border-r', className)}>
      <div className="border-border border-b px-4 py-3">
        <h3 className="text-text-primary text-sm font-semibold">
          {t('dashboard.automations.editor.palette.title')}
        </h3>
      </div>
      <div className="p-3">
        {categoryOrder.map((category) => {
          const nodes = grouped[category]
          if (!nodes || nodes.length === 0) return null
          const config = categoryConfig[category] || {
            icon: HelpCircle,
            labelKey: category,
            iconColor: 'text-muted-foreground',
          }

          return (
            <div key={category} className="mb-4">
              <h4 className="text-text-muted mb-2 px-1 text-xs font-medium uppercase tracking-wider">
                {t(config.labelKey)}
              </h4>
              <div className="space-y-1">
                {nodes.map((nodeType) => (
                  <div
                    key={nodeType.type}
                    draggable
                    onDragStart={(e) => onDragStart(e, nodeType)}
                    className="bg-bg-subtle hover:bg-bg-hover border-border cursor-grab rounded-lg border px-3 py-2 transition-all duration-150 active:cursor-grabbing"
                  >
                    <div className="flex items-center gap-2">
                      <config.icon className={cn('size-4', config.iconColor)} />
                      <span className="text-text-primary text-sm font-medium">
                        {nodeType.label}
                      </span>
                    </div>
                    <p className="text-text-muted mt-1 text-xs leading-relaxed">
                      {nodeType.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
