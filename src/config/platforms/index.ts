import type { LucideIcon } from 'lucide-react'

// Platform theme configuration
export interface PlatformTheme {
  // CSS class names for dynamic theming
  primary: string // Primary color class
  primaryForeground: string // Text on primary
  secondary: string // Secondary color
  accent: string // Accent highlights
  gradient: string // Background gradient
  glowColor: string // Glow effects
  borderColor: string // Border accents
}

// Feature with platform-specific naming
export interface PlatformFeature {
  id: string
  icon: LucideIcon
  genericNameKey: string // Generic feature name (e.g., "AI Writer")
  specificNameKey: string // Platform-specific name (e.g., "B2B Ghostwriter")
  descriptionKey: string
}

// Use case for "Who is this for?" section
export interface PlatformUseCase {
  id: string
  icon: LucideIcon
  titleKey: string
  descriptionKey: string
  keywords: string[] // SEO keywords
}

// Platform-specific FAQ
export interface PlatformFAQ {
  id: string
  questionKey: string
  answerKey: string
}

// Competitor callout
export interface PlatformCompetitor {
  name: string
  logoUrl?: string
  attackKey: string
}

// Cross-link to another platform
export interface PlatformCrossLink {
  targetPlatform: string
  headlineKey: string
  bodyKey: string
}

// Pain point
export interface PlatformPainPoint {
  id: string
  icon: LucideIcon
  titleKey: string
  descriptionKey: string
}

// Complete platform configuration
export interface PlatformConfig {
  // Identity
  slug: string
  nameKey: string
  icon: LucideIcon
  logoUrl?: string

  // Theme
  theme: PlatformTheme

  // Hero section
  hero: {
    titleKey: string
    highlightKey: string // Highlighted text in title
    subtitleKey: string
    agitationKey: string // Pain point teaser
  }

  // Content sections
  painPoints: PlatformPainPoint[]
  features: PlatformFeature[]
  useCases: PlatformUseCase[]
  faqs: PlatformFAQ[]
  competitor: PlatformCompetitor
  crossLinks: PlatformCrossLink[]

  // SEO
  seo: {
    titleKey: string
    descriptionKey: string
    keywords: string[]
  }
}

// Platform registry type
export type PlatformSlug =
  | 'instagram'
  | 'tiktok'
  | 'linkedin'
  | 'x'
  | 'youtube'
  | 'facebook'
  | 'threads'
  | 'pinterest'
  | 'bluesky'

// Import all platform configs
import { instagramConfig } from './instagram'
import { tiktokConfig } from './tiktok'
import { linkedinConfig } from './linkedin'
import { xConfig } from './x'
import { youtubeConfig } from './youtube'
import { facebookConfig } from './facebook'
import { threadsConfig } from './threads'
import { pinterestConfig } from './pinterest'
import { blueskyConfig } from './bluesky'

// Platform registry
export const platforms: Record<PlatformSlug, PlatformConfig> = {
  instagram: instagramConfig,
  tiktok: tiktokConfig,
  linkedin: linkedinConfig,
  x: xConfig,
  youtube: youtubeConfig,
  facebook: facebookConfig,
  threads: threadsConfig,
  pinterest: pinterestConfig,
  bluesky: blueskyConfig,
}

// Helper to get platform config
export function getPlatformConfig(slug: string): PlatformConfig | undefined {
  return platforms[slug as PlatformSlug]
}

// Helper to get all platform slugs
export function getAllPlatformSlugs(): PlatformSlug[] {
  return Object.keys(platforms) as PlatformSlug[]
}

// Helper to check if slug is valid
export function isValidPlatformSlug(slug: string): slug is PlatformSlug {
  return slug in platforms
}
