/**
 * CustomNode
 * Soft dark card with category accent bar, tinted icon, name, description, and ports.
 * In execution mode: shows per-node status (border glow, inline status pill, action overlay).
 * Uses inline styles for guaranteed dark-mode rendering inside React Flow.
 */

import { memo, useState, useCallback } from 'react'
import { Handle, Position } from '@xyflow/react'
import {
  Check,
  XCircle,
  Loader2,
  Database,
  SkipForward,
  Clock,
  Play,
  RefreshCw,
} from 'lucide-react'
import { getNodeIcon, CATEGORY_ACCENT_COLORS, CATEGORY_ICON_BG } from '@/lib/workflow-utils'
import { useWorkflowEditorStore } from '@/stores/workflowEditorStore'
import type { NodeCategory, StepStatus } from '@/types/workflow'
import type { ViewMode } from '@/stores/workflowEditorStore'

interface CustomNodeData {
  name: string
  description: string
  icon: string
  category: NodeCategory
  stepStatus?: StepStatus
  viewMode: ViewMode
  nodeId: string
}

const STATUS_GLOW: Record<StepStatus, string> = {
  success: '0 0 10px rgba(34,197,94,0.25), inset 0 0 0 1px rgba(34,197,94,0.15)',
  failed: '0 0 10px rgba(239,68,68,0.25), inset 0 0 0 1px rgba(239,68,68,0.15)',
  running: '0 0 12px rgba(59,130,246,0.3), inset 0 0 0 1px rgba(59,130,246,0.15)',
  cached: '0 0 6px rgba(59,130,246,0.15)',
  skipped: 'none',
  pending: 'none',
}

const STATUS_BORDER: Record<StepStatus, string> = {
  success: 'rgba(34,197,94,0.5)',
  failed: 'rgba(239,68,68,0.5)',
  running: 'rgba(59,130,246,0.5)',
  cached: 'rgba(59,130,246,0.3)',
  skipped: 'rgba(255,255,255,0.03)',
  pending: 'rgba(255,255,255,0.05)',
}

/** Colors for the inline status pill */
const STATUS_PILL: Record<StepStatus, { bg: string; text: string; label: string }> = {
  success: { bg: 'rgba(34,197,94,0.12)', text: '#22c55e', label: 'Done' },
  failed: { bg: 'rgba(239,68,68,0.12)', text: '#ef4444', label: 'Error' },
  running: { bg: 'rgba(59,130,246,0.12)', text: '#3b82f6', label: '' },
  cached: { bg: 'rgba(59,130,246,0.08)', text: '#3b82f680', label: 'Cached' },
  skipped: { bg: 'rgba(255,255,255,0.04)', text: '#555', label: 'Skip' },
  pending: { bg: 'rgba(255,255,255,0.04)', text: '#444', label: '' },
}

const StatusIcon: Record<StepStatus, typeof Check> = {
  success: Check,
  failed: XCircle,
  running: Loader2,
  cached: Database,
  skipped: SkipForward,
  pending: Clock,
}

function CustomNodeComponent({ data, selected }: { data: CustomNodeData; selected: boolean }) {
  const [hovered, setHovered] = useState(false)
  const Icon = getNodeIcon(data.icon)
  const accent = CATEGORY_ACCENT_COLORS[data.category] ?? '#666666'
  const iconBg = CATEGORY_ICON_BG[data.category] ?? 'rgba(255,255,255,0.05)'

  const isExecMode = data.viewMode === 'execution'
  const status = data.stepStatus

  const bg = selected ? '#1c1c1c' : hovered ? '#1a1a1a' : '#161616'
  const baseBorder = selected
    ? 'rgba(255,255,255,0.14)'
    : hovered
      ? 'rgba(255,255,255,0.09)'
      : 'rgba(255,255,255,0.05)'
  const border = isExecMode && status ? STATUS_BORDER[status] : baseBorder
  const boxShadow = isExecMode && status ? STATUS_GLOW[status] : 'none'
  const accentOpacity = selected ? 1 : hovered ? 0.7 : 0.4
  const nodeOpacity = status === 'skipped' ? 0.4 : 1

  const showActionOverlay =
    isExecMode && hovered && (status === 'pending' || status === 'failed')

  const handleActionClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      const store = useWorkflowEditorStore.getState()
      const { activeRun } = store
      if (!activeRun) return
      if (status === 'failed') {
        store.retryFromNode(activeRun.id, data.nodeId)
      } else if (status === 'pending') {
        store.stepNode(activeRun.id, data.nodeId)
      }
    },
    [status, data.nodeId],
  )

  const pill = isExecMode && status ? STATUS_PILL[status] : null

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 220,
        height: 58,
        background: bg,
        borderRadius: 10,
        border: `1px solid ${border}`,
        position: 'relative',
        overflow: 'visible',
        transition: 'all 150ms ease-out',
        fontFamily: 'var(--font-sans)',
        boxShadow,
        opacity: nodeOpacity,
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
          padding: '0 10px 0 14px',
          gap: 10,
          borderRadius: 10,
          overflow: 'hidden',
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

        {/* Inline status pill — visible in execution mode */}
        {pill && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 3,
              padding: '2px 6px',
              borderRadius: 6,
              background: pill.bg,
              flexShrink: 0,
            }}
          >
            {(() => {
              const BadgeIcon = StatusIcon[status!]
              return (
                <BadgeIcon
                  style={{
                    width: 10,
                    height: 10,
                    color: pill.text,
                  }}
                  className={status === 'running' ? 'node-status-spin' : undefined}
                />
              )
            })()}
            {pill.label && (
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: pill.text,
                  lineHeight: 1,
                  letterSpacing: '0.02em',
                }}
              >
                {pill.label}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Action overlay — execution mode, hover on pending/failed */}
      {showActionOverlay && (
        <div
          onClick={handleActionClick}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            background: 'rgba(0,0,0,0.7)',
            borderRadius: 10,
            cursor: 'pointer',
            zIndex: 10,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '5px 12px',
              borderRadius: 6,
              background: status === 'failed' ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.08)',
              border: `1px solid ${status === 'failed' ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.12)'}`,
            }}
          >
            {status === 'failed' ? (
              <RefreshCw style={{ width: 12, height: 12, color: '#ef4444' }} />
            ) : (
              <Play style={{ width: 12, height: 12, color: '#e0e0e0' }} />
            )}
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: status === 'failed' ? '#ef4444' : '#e0e0e0',
                letterSpacing: '0.01em',
              }}
            >
              {status === 'failed' ? 'Retry' : 'Run'}
            </span>
          </div>
        </div>
      )}

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
