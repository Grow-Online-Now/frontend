/**
 * Workflow utility functions
 * Icon mapping for backend icon strings and category visual config
 */

import {
  Play,
  Clock,
  Link,
  MonitorPlay,
  Scissors,
  Captions,
  FileText,
  Bot,
  Globe,
  GitBranch,
  Timer,
  Filter,
  Camera,
  Music,
  Youtube,
  Bell,
  Upload,
  Sparkles,
  Gamepad2,
  Image,
  Zap,
  Film,
  ListVideo,
  Twitch,
  Mic,
  Flame,
  Maximize,
  Clapperboard,
  Check,
  XCircle,
  Loader2,
  Database,
  SkipForward,
  type LucideIcon,
} from 'lucide-react'
import type { NodeCategory, CategoryConfig, StepStatus } from '@/types/workflow'

const ICON_MAP: Record<string, LucideIcon> = {
  play: Play,
  clock: Clock,
  link: Link,
  monitor_play: MonitorPlay,
  monitor: MonitorPlay,
  scissors: Scissors,
  captions: Captions,
  subtitles: Captions,
  file_text: FileText,
  file: FileText,
  bot: Bot,
  globe: Globe,
  git_branch: GitBranch,
  branch: GitBranch,
  timer: Timer,
  filter: Filter,
  camera: Camera,
  music: Music,
  youtube: Youtube,
  bell: Bell,
  upload: Upload,
  sparkles: Sparkles,
  gamepad: Gamepad2,
  image: Image,
  zap: Zap,
  film: Film,
  list_video: ListVideo,
  twitch: Twitch,
  mic: Mic,
  flame: Flame,
  maximize: Maximize,
  clapperboard: Clapperboard,
}

/**
 * Resolve a backend icon name string to a Lucide icon component
 */
export function getNodeIcon(iconName: string): LucideIcon {
  return ICON_MAP[iconName] ?? Zap
}

/**
 * Visual configuration per node category
 */
export const CATEGORY_CONFIG: Record<NodeCategory, CategoryConfig> = {
  trigger: {
    labelKey: 'dashboard.workflows.categories.triggers',
    colorClass: 'text-text-primary',
    mutedColorClass: 'bg-bg-hover',
    bgAccentClass: 'bg-foreground',
  },
  media: {
    labelKey: 'dashboard.workflows.categories.media',
    colorClass: 'text-success',
    mutedColorClass: 'bg-success-muted',
    bgAccentClass: 'bg-success',
  },
  text: {
    labelKey: 'dashboard.workflows.categories.text',
    colorClass: 'text-[#8b5cf6]',
    mutedColorClass: 'bg-[rgba(139,92,246,0.15)]',
    bgAccentClass: 'bg-[#8b5cf6]',
  },
  logic: {
    labelKey: 'dashboard.workflows.categories.logic',
    colorClass: 'text-warning',
    mutedColorClass: 'bg-warning-muted',
    bgAccentClass: 'bg-warning',
  },
  output: {
    labelKey: 'dashboard.workflows.categories.output',
    colorClass: 'text-destructive',
    mutedColorClass: 'bg-destructive-muted',
    bgAccentClass: 'bg-destructive',
  },
  ai: {
    labelKey: 'dashboard.workflows.categories.ai',
    colorClass: 'text-[#8b5cf6]',
    mutedColorClass: 'bg-[rgba(139,92,246,0.15)]',
    bgAccentClass: 'bg-[#8b5cf6]',
  },
}

/**
 * Hardcoded accent colors per category for inline styles (guaranteed visibility on dark canvas)
 */
export const CATEGORY_ACCENT_COLORS: Record<NodeCategory, string> = {
  trigger: '#94a3b8',
  media: '#22c55e',
  text: '#8b5cf6',
  ai: '#8b5cf6',
  logic: '#f59e0b',
  output: '#ef4444',
}

/**
 * Subtle category-tinted backgrounds for icon containers
 */
export const CATEGORY_ICON_BG: Record<NodeCategory, string> = {
  trigger: 'rgba(148, 163, 184, 0.08)',
  media: 'rgba(34, 197, 94, 0.10)',
  text: 'rgba(139, 92, 246, 0.10)',
  ai: 'rgba(139, 92, 246, 0.10)',
  logic: 'rgba(245, 158, 11, 0.10)',
  output: 'rgba(239, 68, 68, 0.10)',
}

/**
 * Category display order for the palette
 */
export const CATEGORY_ORDER: NodeCategory[] = ['trigger', 'media', 'text', 'ai', 'logic', 'output']

/**
 * Format duration in milliseconds to human-readable string
 */
export function formatDurationMs(ms: number | null): string {
  if (ms === null) return '—'
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(1)}s`
}

// ─── Step Status Utilities ───

/** Lucide icon per step status */
export const STEP_STATUS_ICONS: Record<StepStatus, LucideIcon> = {
  success: Check,
  failed: XCircle,
  running: Loader2,
  cached: Database,
  skipped: SkipForward,
  pending: Clock,
}

/** Tailwind classes for status badges (bg + text) */
export const STEP_STATUS_BADGE_CLASSES: Record<StepStatus, string> = {
  success: 'bg-success-muted text-success',
  failed: 'bg-destructive-muted text-destructive',
  running: 'bg-info-muted text-info',
  skipped: 'bg-bg-hover text-text-muted',
  pending: 'bg-bg-hover text-text-muted',
  cached: 'bg-info-muted text-info/60',
}

/** Text-only color class per status */
export const STEP_STATUS_TEXT_CLASSES: Record<StepStatus, string> = {
  success: 'text-success',
  failed: 'text-destructive',
  running: 'text-info',
  skipped: 'text-text-muted',
  pending: 'text-text-muted',
  cached: 'text-info/60',
}

/** Canvas inline-style colors per status (for React Flow nodes) */
export const STEP_STATUS_GLOW: Record<StepStatus, string> = {
  success: '0 0 10px rgba(34,197,94,0.25), inset 0 0 0 1px rgba(34,197,94,0.15)',
  failed: '0 0 10px rgba(239,68,68,0.25), inset 0 0 0 1px rgba(239,68,68,0.15)',
  running: '0 0 12px rgba(59,130,246,0.3), inset 0 0 0 1px rgba(59,130,246,0.15)',
  cached: '0 0 6px rgba(59,130,246,0.15)',
  skipped: 'none',
  pending: 'none',
}

export const STEP_STATUS_BORDER: Record<StepStatus, string> = {
  success: 'rgba(34,197,94,0.5)',
  failed: 'rgba(239,68,68,0.5)',
  running: 'rgba(59,130,246,0.5)',
  cached: 'rgba(59,130,246,0.3)',
  skipped: 'rgba(255,255,255,0.03)',
  pending: 'rgba(255,255,255,0.05)',
}

export interface StepStatusPill {
  bg: string
  text: string
  label: string
}

export const STEP_STATUS_PILL: Record<StepStatus, StepStatusPill> = {
  success: { bg: 'rgba(34,197,94,0.12)', text: '#22c55e', label: 'Done' },
  failed: { bg: 'rgba(239,68,68,0.12)', text: '#ef4444', label: 'Error' },
  running: { bg: 'rgba(59,130,246,0.12)', text: '#3b82f6', label: '' },
  cached: { bg: 'rgba(59,130,246,0.08)', text: '#3b82f680', label: 'Cached' },
  skipped: { bg: 'rgba(255,255,255,0.04)', text: '#555', label: 'Skip' },
  pending: { bg: 'rgba(255,255,255,0.04)', text: '#444', label: '' },
}

export { type LucideIcon }
