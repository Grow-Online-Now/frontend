/**
 * CustomEdge
 * Smooth S-curve bezier — dark by default, animated dot when running
 */

import { memo } from 'react'
import { BaseEdge, type EdgeProps } from '@xyflow/react'

function CustomEdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  selected,
  data,
}: EdgeProps) {
  // Horizontally-symmetric S-curve: control points at horizontal midpoint
  const midX = (sourceX + targetX) / 2
  const edgePath = `M ${sourceX} ${sourceY} C ${midX} ${sourceY}, ${midX} ${targetY}, ${targetX} ${targetY}`

  const isAnimated = data?.animated === true

  // Hardcoded hex values to guarantee dark edges on dark canvas
  const strokeColor = isAnimated ? '#222222' : selected ? '#333333' : '#1a1a1a'

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

      {isAnimated && (
        <circle r="2.5" fill="#a0a0a0">
          <animateMotion dur="2s" repeatCount="indefinite" path={edgePath} />
        </circle>
      )}
    </>
  )
}

export const CustomEdge = memo(CustomEdgeComponent)
