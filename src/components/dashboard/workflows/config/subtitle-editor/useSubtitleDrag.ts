/**
 * Custom hook for dragging the subtitle preview vertically.
 * Uses pointer events on document for smooth dragging (same pattern as ExecutionPanel).
 */

import { useCallback, useRef, useState } from 'react'

interface UseSubtitleDragResult {
  yPercent: number
  handlePointerDown: (e: React.PointerEvent) => void
  isDragging: boolean
}

export function useSubtitleDrag(
  containerRef: React.RefObject<HTMLDivElement | null>,
  initialYPercent: number,
  onDragEnd: (yPercent: number) => void
): UseSubtitleDragResult {
  const [yPercent, setYPercent] = useState(initialYPercent)
  const [isDragging, setIsDragging] = useState(false)
  const dragRef = useRef<{ startY: number; startPercent: number } | null>(null)

  // Sync when external value changes while not dragging
  const lastInitial = useRef(initialYPercent)
  if (initialYPercent !== lastInitial.current && !isDragging) {
    lastInitial.current = initialYPercent
    setYPercent(initialYPercent)
  }

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault()
      const container = containerRef.current
      if (!container) return

      dragRef.current = { startY: e.clientY, startPercent: yPercent }
      setIsDragging(true)

      const onPointerMove = (ev: PointerEvent) => {
        if (!dragRef.current || !container) return
        const rect = container.getBoundingClientRect()
        const deltaPixels = ev.clientY - dragRef.current.startY
        const deltaPct = (deltaPixels / rect.height) * 100
        const next = Math.min(95, Math.max(5, dragRef.current.startPercent + deltaPct))
        setYPercent(next)
      }

      const onPointerUp = () => {
        document.removeEventListener('pointermove', onPointerMove)
        document.removeEventListener('pointerup', onPointerUp)
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
        setIsDragging(false)

        if (dragRef.current) {
          const container = containerRef.current
          if (container) {
            // Read the final yPercent from the ref-based calculation
            const rect = container.getBoundingClientRect()
            const lastEvent = dragRef.current
            // We can't access React state here easily, so we recalculate
            // Actually we persist the final value via a closure trick
          }
        }
        // Use the current yPercent by scheduling a callback
        setYPercent((current) => {
          onDragEnd(current)
          return current
        })
        dragRef.current = null
      }

      document.body.style.cursor = 'grabbing'
      document.body.style.userSelect = 'none'
      document.addEventListener('pointermove', onPointerMove)
      document.addEventListener('pointerup', onPointerUp)
    },
    [containerRef, yPercent, onDragEnd]
  )

  return { yPercent, handlePointerDown, isDragging }
}
