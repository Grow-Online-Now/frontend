/**
 * CustomEdge
 * Bezier edge with animated dot when workflow is running
 */

import { memo } from 'react'
import { BaseEdge, getBezierPath, type EdgeProps } from '@xyflow/react'

function CustomEdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  })

  const isAnimated = data?.animated === true

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{ stroke: 'var(--border-subtle)', strokeWidth: 1.5 }}
      />
      {isAnimated && (
        <circle r="2.5" fill="var(--text-secondary)">
          <animateMotion dur="2s" repeatCount="indefinite" path={edgePath} />
        </circle>
      )}
    </>
  )
}

export const CustomEdge = memo(CustomEdgeComponent)
