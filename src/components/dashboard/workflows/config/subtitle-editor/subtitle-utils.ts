/**
 * Pure utility functions for the visual subtitle editor.
 * Converts between ASS subtitle positioning and CSS percentages,
 * and maps ASS style values to CSS equivalents.
 */

/** Convert ASS position + marginV to a vertical CSS percentage (0-100). */
export function assToYPercent(position: string, marginV: number): number {
  switch (position) {
    case 'top':
      return (marginV / 1080) * 100
    case 'middle':
      return 50
    case 'bottom':
    default:
      return 100 - (marginV / 1080) * 100
  }
}

/** Convert a vertical CSS percentage back to ASS position + marginV. */
export function yPercentToAss(yPercent: number): { position: string; marginV: number } {
  if (yPercent < 40) {
    return { position: 'top', marginV: Math.round((yPercent / 100) * 1080) }
  }
  if (yPercent > 60) {
    return { position: 'bottom', marginV: Math.round((1 - yPercent / 100) * 1080) }
  }
  return { position: 'middle', marginV: 0 }
}

/** Parse an aspect ratio string like "9:16" into a number (0.5625). */
export function parseAspectRatio(ratio: string): number {
  const parts = ratio.split(':')
  if (parts.length !== 2) return 9 / 16
  const w = Number(parts[0])
  const h = Number(parts[1])
  if (!w || !h) return 9 / 16
  return w / h
}

/** Generate a CSS text-shadow string that simulates an outline (8 directional shadows). */
export function outlineToTextShadow(color: string, width: number): string {
  if (!width || color === '#00000000') return 'none'
  const w = width
  return [
    `${w}px 0 ${color}`,
    `${-w}px 0 ${color}`,
    `0 ${w}px ${color}`,
    `0 ${-w}px ${color}`,
    `${w}px ${w}px ${color}`,
    `${-w}px ${w}px ${color}`,
    `${w}px ${-w}px ${color}`,
    `${-w}px ${-w}px ${color}`,
  ].join(', ')
}

/** Linearly scale an ASS font size (8-72) to a preview pixel size (min-max). */
export function scaleFontSize(assFontSize: number, min = 10, max = 28): number {
  const clamped = Math.max(8, Math.min(72, assFontSize))
  return Math.round(min + ((clamped - 8) / (72 - 8)) * (max - min))
}
