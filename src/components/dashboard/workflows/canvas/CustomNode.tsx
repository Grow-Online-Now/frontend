/**
 * CustomNode
 * React Flow custom node component for workflow canvas
 * 190x64px card with category accent bar and ports
 */

import { memo } from 'react'
import { Handle, Position } from '@xyflow/react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { NODE_TYPE_DEFINITIONS } from '@/data/workflow-mocks'

const categoryColorMap: Record<string, string> = {
  trigger: 'bg-foreground',
  media: 'bg-success',
  text: 'bg-[#8b5cf6]',
  logic: 'bg-warning',
  output: 'bg-destructive',
}

function CustomNodeComponent({ data, selected }: { data: Record<string, unknown>; selected: boolean }) {
  const { t } = useTranslation()
  const nodeType = data.nodeType as string
  const isRunning = data.isRunning as boolean
  const def = NODE_TYPE_DEFINITIONS[nodeType]

  if (!def) return null

  const Icon = def.icon
  const accentColor = categoryColorMap[def.category] || 'bg-foreground'
  const description = t(def.descriptionKey)
  const truncatedDesc = description.length > 26 ? description.slice(0, 26) + '…' : description

  return (
    <div
      className={cn(
        'relative h-16 w-[190px] rounded-xl border bg-bg-elevated transition-all duration-150',
        selected ? 'border-border-emphasis bg-bg-hover' : 'border-border-subtle'
      )}
    >
      {/* Category accent bar */}
      <div
        className={cn(
          'absolute left-0 top-4 h-8 w-[3px] rounded-sm transition-opacity',
          accentColor,
          selected ? 'opacity-90' : 'opacity-30'
        )}
      />

      {/* Running pulse */}
      {isRunning && (
        <div className="absolute inset-0 animate-pulse rounded-xl border border-border-emphasis" />
      )}

      {/* Content */}
      <div className="px-[18px] pt-[10px]">
        <div className="flex items-center gap-1.5">
          <Icon className="h-3.5 w-3.5 text-text-primary" />
          <span className="text-sm font-medium text-text-primary">
            {t(def.nameKey)}
          </span>
        </div>
        <p className="mt-1 text-xs text-text-tertiary">{truncatedDesc}</p>
      </div>

      {/* Input port (not for triggers) */}
      {def.category !== 'trigger' && (
        <Handle
          type="target"
          position={Position.Left}
          className="!h-2 !w-2 !rounded-full !border !border-border-default !bg-bg-base"
        />
      )}

      {/* Output port */}
      <Handle
        type="source"
        position={Position.Right}
        className="!h-2 !w-2 !rounded-full !border !border-border-default !bg-bg-base"
      />
    </div>
  )
}

export const CustomNode = memo(CustomNodeComponent)
