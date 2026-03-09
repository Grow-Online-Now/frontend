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
  type LucideIcon,
} from 'lucide-react'
import type { NodeCategory, CategoryConfig } from '@/types/workflow'

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
export const CATEGORY_ORDER: NodeCategory[] = [
  'trigger',
  'media',
  'text',
  'ai',
  'logic',
  'output',
]

/**
 * Format duration in milliseconds to human-readable string
 */
export function formatDurationMs(ms: number | null): string {
  if (ms === null) return '—'
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(1)}s`
}
