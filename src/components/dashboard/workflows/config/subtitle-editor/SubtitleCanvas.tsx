/**
 * SubtitleCanvas
 * Renders a mock video frame with live-styled, draggable subtitle text.
 */

import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useSubtitleDrag } from './useSubtitleDrag'
import {
  assToYPercent,
  parseAspectRatio,
  outlineToTextShadow,
  scaleFontSize,
} from './subtitle-utils'

interface SubtitleCanvasProps {
  fontName: string
  fontSize: number
  textColor: string
  outlineColor: string
  outlineWidth: number
  bold: boolean
  uppercase: boolean
  position: string
  marginV: number
  backgroundBox: boolean
  animationStyle: string
  highlightColor: string
  highlightScale: number
  aspectRatio: string
  onPositionChange: (position: string, marginV: number) => void
}

export function SubtitleCanvas({
  fontName,
  fontSize,
  textColor,
  outlineColor,
  outlineWidth,
  bold,
  uppercase,
  position,
  marginV,
  backgroundBox,
  animationStyle,
  highlightColor,
  highlightScale,
  aspectRatio,
  onPositionChange,
}: SubtitleCanvasProps) {
  const { t } = useTranslation()
  const containerRef = useRef<HTMLDivElement>(null)

  const initialY = assToYPercent(position, marginV)
  const { yPercent, handlePointerDown, isDragging } = useSubtitleDrag(
    containerRef,
    initialY,
    (newY) => {
      // Convert back to ASS values
      const { position: pos, marginV: mv } = (() => {
        if (newY < 40) return { position: 'top', marginV: Math.round((newY / 100) * 1080) }
        if (newY > 60) return { position: 'bottom', marginV: Math.round((1 - newY / 100) * 1080) }
        return { position: 'middle', marginV: 0 }
      })()
      onPositionChange(pos, mv)
    }
  )

  const ratio = parseAspectRatio(aspectRatio)
  const previewFontSize = scaleFontSize(fontSize)
  const shadow = outlineToTextShadow(outlineColor, outlineWidth)

  const sampleText = t('dashboard.workflows.editor.subtitleEditor.sampleText')
  const words = sampleText.split(' ')
  const isDynamic = animationStyle === 'dynamic'

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Frame */}
      <div
        ref={containerRef}
        className="relative w-full max-h-[240px] overflow-hidden rounded-xl"
        style={{
          aspectRatio: ratio,
          background: 'linear-gradient(180deg, #2a2a2e 0%, #1a1a1e 50%, #222226 100%)',
          maxWidth: ratio > 1 ? '100%' : `${240 * ratio}px`,
        }}
      >
        {/* Subtitle overlay */}
        <div
          onPointerDown={handlePointerDown}
          className="absolute left-0 right-0 flex justify-center px-3"
          style={{
            top: `${yPercent}%`,
            transform: 'translateY(-50%)',
            cursor: isDragging ? 'grabbing' : 'grab',
          }}
        >
          <span
            className="inline-block text-center leading-tight select-none"
            style={{
              fontFamily: fontName,
              fontSize: `${previewFontSize}px`,
              fontWeight: bold ? 700 : 400,
              textTransform: uppercase ? 'uppercase' : 'none',
              color: textColor,
              textShadow: shadow,
              ...(backgroundBox
                ? {
                    background: 'rgba(0, 0, 0, 0.55)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                  }
                : {}),
            }}
          >
            {isDynamic
              ? words.map((word, i) => (
                  <span
                    key={i}
                    style={
                      i === 1
                        ? {
                            color: highlightColor,
                            transform: `scale(${highlightScale})`,
                            display: 'inline-block',
                          }
                        : undefined
                    }
                  >
                    {word}
                    {i < words.length - 1 ? ' ' : ''}
                  </span>
                ))
              : sampleText}
          </span>
        </div>
      </div>

      {/* Drag hint */}
      <span className="text-text-muted text-xs">
        {t('dashboard.workflows.editor.subtitleEditor.dragHint')}
      </span>
    </div>
  )
}
