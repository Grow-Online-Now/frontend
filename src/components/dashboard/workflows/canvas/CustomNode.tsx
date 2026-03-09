/**
 * CustomNode
 * Soft dark card with category accent bar, tinted icon, name, description, and ports.
 * Uses inline styles for guaranteed dark-mode rendering inside React Flow.
 */

import { memo, useState } from 'react'
import { Handle, Position } from '@xyflow/react'
import { getNodeIcon, CATEGORY_ACCENT_COLORS, CATEGORY_ICON_BG } from '@/lib/workflow-utils'
import type { NodeCategory } from '@/types/workflow'

interface CustomNodeData {
  name: string
  description: string
  icon: string
  category: NodeCategory
  isRunning: boolean
}

function CustomNodeComponent({ data, selected }: { data: CustomNodeData; selected: boolean }) {
  const [hovered, setHovered] = useState(false)
  const Icon = getNodeIcon(data.icon)
  const accent = CATEGORY_ACCENT_COLORS[data.category] ?? '#666666'
  const iconBg = CATEGORY_ICON_BG[data.category] ?? 'rgba(255,255,255,0.05)'

  const bg = selected ? '#1c1c1c' : hovered ? '#1a1a1a' : '#161616'
  const border = selected
    ? 'rgba(255,255,255,0.14)'
    : hovered
      ? 'rgba(255,255,255,0.09)'
      : 'rgba(255,255,255,0.05)'
  const accentOpacity = selected ? 1 : hovered ? 0.7 : 0.4

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 200,
        height: 58,
        background: bg,
        borderRadius: 10,
        border: `1px solid ${border}`,
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 150ms ease-out',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* Left accent bar */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 3,
          background: accent,
          opacity: accentOpacity,
          borderRadius: '10px 0 0 10px',
          transition: 'opacity 150ms ease-out',
        }}
      />

      {/* Content */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          padding: '0 12px 0 14px',
          gap: 10,
        }}
      >
        {/* Icon container */}
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            background: iconBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon style={{ width: 14, height: 14, color: accent }} />
        </div>

        {/* Text */}
        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: '#e0e0e0',
              lineHeight: 1.2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {data.name}
          </div>
          <div
            style={{
              fontSize: 11,
              color: '#555555',
              lineHeight: 1.3,
              marginTop: 2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {data.description}
          </div>
        </div>
      </div>

      {/* Input port — triggers have none */}
      {data.category !== 'trigger' && (
        <Handle type="target" position={Position.Left} className="workflow-handle" />
      )}

      {/* Output port */}
      <Handle type="source" position={Position.Right} className="workflow-handle" />
    </div>
  )
}

export const CustomNode = memo(CustomNodeComponent)
