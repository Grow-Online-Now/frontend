/**
 * WorkflowNode Component
 * Custom React Flow node for the workflow editor
 */

import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { Zap, FileCode, Send, HelpCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { NodeCategory } from '@/types/automations'

export interface WorkflowNodeData {
  label: string
  nodeType: string
  category: NodeCategory
  description?: string
  onDelete?: (nodeId: string) => void
  [key: string]: unknown
}

const categoryConfig: Record<
  NodeCategory,
  {
    icon: React.ComponentType<{ className?: string }>
    borderColor: string
    bgColor: string
    iconColor: string
  }
> = {
  trigger: {
    icon: Zap,
    borderColor: 'border-t-success',
    bgColor: 'bg-success/5',
    iconColor: 'text-success',
  },
  processor: {
    icon: FileCode,
    borderColor: 'border-t-info',
    bgColor: 'bg-info/5',
    iconColor: 'text-info',
  },
  action: {
    icon: Send,
    borderColor: 'border-t-warning',
    bgColor: 'bg-warning/5',
    iconColor: 'text-warning',
  },
}

function WorkflowNodeComponent({ id, data, selected }: NodeProps) {
  const nodeData = data as unknown as WorkflowNodeData
  const config = categoryConfig[nodeData.category] || {
    icon: HelpCircle,
    borderColor: 'border-t-muted-foreground',
    bgColor: 'bg-muted/5',
    iconColor: 'text-muted-foreground',
  }
  const Icon = config.icon

  return (
    <>
      {nodeData.category !== 'trigger' && (
        <Handle
          type="target"
          position={Position.Left}
          className="!bg-border-emphasis !border-bg-elevated !h-3 !w-3 !border-2"
        />
      )}

      <div
        className={cn(
          'group/node bg-bg-elevated border-border relative min-w-[180px] rounded-lg border border-t-[3px] shadow-sm transition-all duration-150',
          config.borderColor,
          selected && 'border-border-focus ring-border-focus/20 ring-2'
        )}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            nodeData.onDelete?.(id)
          }}
          className="bg-bg-elevated border-border text-text-muted hover:bg-error-muted hover:text-error hover:border-error/30 absolute -right-2 -top-2 hidden size-5 items-center justify-center rounded-full border shadow-sm transition-colors group-hover/node:flex"
        >
          <X className="size-3" />
        </button>

        <div className={cn('flex items-center gap-2 px-3 py-2.5', config.bgColor)}>
          <Icon className={cn('size-4', config.iconColor)} />
          <span className="text-text-primary text-sm font-medium">{nodeData.label}</span>
        </div>
        <div className="px-3 py-2">
          <span className="text-text-muted text-xs">{nodeData.nodeType}</span>
        </div>
      </div>

      {nodeData.category !== 'action' && (
        <Handle
          type="source"
          position={Position.Right}
          className="!bg-border-emphasis !border-bg-elevated !h-3 !w-3 !border-2"
        />
      )}
    </>
  )
}

export const WorkflowNodeMemo = memo(WorkflowNodeComponent)
