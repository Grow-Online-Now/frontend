/**
 * Constants for the Create Campaign feature
 * Design tokens and configuration values
 */

/**
 * Panel widths
 */
export const PANEL_WIDTHS = {
  left: 260, // Media assets panel
  right: 300, // Settings panel
} as const

/**
 * Transition timing (in ms)
 */
export const TRANSITIONS = {
  fast: 150,
  base: 200,
  slow: 300,
  layout: 400,
} as const

/**
 * Transition easing functions
 */
export const EASINGS = {
  default: 'ease-out',
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  outExpo: 'cubic-bezier(0.16, 1, 0.3, 1)',
} as const

/**
 * Animation stagger delay (in ms)
 */
export const STAGGER_DELAY = 50

/**
 * Platform card grid configuration
 */
export const PLATFORM_CARD_GRID = {
  minColumns: 1,
  maxColumns: 3,
  gap: 16,
  cardMinWidth: 320,
} as const

/**
 * Media asset thumbnail sizes
 */
export const ASSET_THUMBNAIL = {
  width: 100,
  height: 100,
  gap: 8,
} as const

/**
 * Breakpoints for responsive design
 */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const

/**
 * Z-index layers
 */
export const Z_INDEX = {
  dropZone: 10,
  dragging: 100,
  modal: 1000,
} as const

/**
 * Drag and drop configuration
 */
export const DND_CONFIG = {
  dragActivationDelay: 100,
  dragOverlayOpacity: 0.9,
} as const
