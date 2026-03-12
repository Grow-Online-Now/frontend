/**
 * CustomEdge
 * Smooth S-curve bezier — status-aware coloring and animation in execution mode.
 * Green when both ends succeed, red when source failed, animated dot when flowing.
 */

import { memo } from 'react'
import { BaseEdge, type EdgeProps } from '@xyflow/react'
import type { StepStatus } from '@/types/workflow'
import type { ViewMode } from '@/stores/workflowEditorStore'

function getEdgeStyle(
  viewMode: ViewMode | undefined,
  sourceStatus: StepStatus | undefined,
  targetStatus: StepStatus | undefined,
  selected: boolean | undefined,
): { strokeColor: string; animated: boolean } {
  if (viewMode !== 'execution' || !sourceStatus) {
    // Editor mode — original dark appearance
    return {
      strokeColor: selected ? '#333333' : '#1a1a1a',
      animated: false,
    }
  }

  // Source failed → red edge
  if (sourceStatus === 'failed') {
    return { strokeColor: '#ef4444', animated: false }
  }

  // Both ends succeeded/cached → green
  const sourceOk = sourceStatus === 'success' || sourceStatus === 'cached'
  const targetOk = targetStatus === 'success' || targetStatus === 'cached'
  if (sourceOk && targetOk) {
    return { strokeColor: '#22c55e', animated: false }
  }

  // Source done, target running → animated flow
  if (sourceOk && targetStatus === 'running') {
    return { strokeColor: '#3b82f6', animated: true }
  }

  // Source done, target pending → dim green
  if (sourceOk) {
    return { strokeColor: 'rgba(34,197,94,0.25)', animated: false }
  }

  // Default dim
  return { strokeColor: '#1a1a1a', animated: false }
}

function CustomEdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  selected,
  data,
}: EdgeProps) {
  const midX = (sourceX + targetX) / 2
  const edgePath = `M ${sourceX} ${sourceY} C ${midX} ${sourceY}, ${midX} ${targetY}, ${targetX} ${targetY}`

  const { strokeColor, animated } = getEdgeStyle(
    data?.viewMode as ViewMode | undefined,
    data?.sourceStatus as StepStatus | undefined,
    data?.targetStatus as StepStatus | undefined,
    selected,
  )

  return (
    <>
      {/* Wide invisible hit area for easier selection */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={16}
        className="react-flow__edge-interaction"
      />

      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: strokeColor,
          strokeWidth: 1.5,
        }}
      />

      {animated && (
        <circle r="2.5" fill="#a0a0a0">
          <animateMotion dur="2s" repeatCount="indefinite" path={edgePath} />
        </circle>
      )}
    </>
  )
}

export const CustomEdge = memo(CustomEdgeComponent)
