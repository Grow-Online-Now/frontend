import type { PlatformTheme } from './index'

/**
 * Platform themes using CSS variables and semantic tokens.
 * Platform colors are only used for icon backgrounds per design system.
 * All other styling uses semantic tokens that adapt to light/dark mode.
 */

// LinkedIn - Uses CSS variable --platform-linkedin
export const linkedinTheme: PlatformTheme = {
  primary: 'bg-[var(--platform-linkedin)]',
  primaryForeground: 'text-primary-foreground',
  secondary: 'bg-accent',
  accent: 'text-[var(--platform-linkedin)]',
  gradient: 'bg-gradient-to-br from-[var(--platform-linkedin)]/10 via-background to-background',
  glowColor: 'shadow-[var(--platform-linkedin)]/30',
  borderColor: 'border-[var(--platform-linkedin)]/20',
}

// TikTok - Uses CSS variable --platform-tiktok
export const tiktokTheme: PlatformTheme = {
  primary: 'bg-foreground',
  primaryForeground: 'text-background',
  secondary: 'bg-accent',
  accent: 'text-foreground',
  gradient: 'bg-gradient-to-br from-foreground/5 via-background to-background',
  glowColor: 'shadow-foreground/10',
  borderColor: 'border-border',
}

// Instagram - Uses CSS variable --platform-instagram
export const instagramTheme: PlatformTheme = {
  primary: 'bg-[var(--platform-instagram)]',
  primaryForeground: 'text-primary-foreground',
  secondary: 'bg-accent',
  accent: 'text-[var(--platform-instagram)]',
  gradient: 'bg-gradient-to-br from-[var(--platform-instagram)]/10 via-background to-background',
  glowColor: 'shadow-[var(--platform-instagram)]/30',
  borderColor: 'border-[var(--platform-instagram)]/20',
}

// X/Twitter - Uses CSS variable --platform-twitter
export const xTheme: PlatformTheme = {
  primary: 'bg-foreground',
  primaryForeground: 'text-background',
  secondary: 'bg-accent',
  accent: 'text-foreground',
  gradient: 'bg-gradient-to-br from-foreground/5 via-background to-background',
  glowColor: 'shadow-foreground/10',
  borderColor: 'border-border',
}

// YouTube - Uses CSS variable --platform-youtube
export const youtubeTheme: PlatformTheme = {
  primary: 'bg-[var(--platform-youtube)]',
  primaryForeground: 'text-primary-foreground',
  secondary: 'bg-accent',
  accent: 'text-[var(--platform-youtube)]',
  gradient: 'bg-gradient-to-br from-[var(--platform-youtube)]/10 via-background to-background',
  glowColor: 'shadow-[var(--platform-youtube)]/30',
  borderColor: 'border-[var(--platform-youtube)]/20',
}

// Facebook - Uses CSS variable --platform-facebook
export const facebookTheme: PlatformTheme = {
  primary: 'bg-[var(--platform-facebook)]',
  primaryForeground: 'text-primary-foreground',
  secondary: 'bg-accent',
  accent: 'text-[var(--platform-facebook)]',
  gradient: 'bg-gradient-to-br from-[var(--platform-facebook)]/10 via-background to-background',
  glowColor: 'shadow-[var(--platform-facebook)]/30',
  borderColor: 'border-[var(--platform-facebook)]/20',
}

// Pinterest - Uses CSS variable --platform-pinterest
export const pinterestTheme: PlatformTheme = {
  primary: 'bg-[var(--platform-pinterest)]',
  primaryForeground: 'text-primary-foreground',
  secondary: 'bg-accent',
  accent: 'text-[var(--platform-pinterest)]',
  gradient: 'bg-gradient-to-br from-[var(--platform-pinterest)]/10 via-background to-background',
  glowColor: 'shadow-[var(--platform-pinterest)]/30',
  borderColor: 'border-[var(--platform-pinterest)]/20',
}

// Threads - Uses semantic tokens (black/white minimal)
export const threadsTheme: PlatformTheme = {
  primary: 'bg-foreground',
  primaryForeground: 'text-background',
  secondary: 'bg-accent',
  accent: 'text-foreground',
  gradient: 'bg-gradient-to-br from-muted via-background to-muted/50',
  glowColor: 'shadow-foreground/10',
  borderColor: 'border-border',
}

// Bluesky - Uses semantic tokens with accent hints
export const blueskyTheme: PlatformTheme = {
  primary: 'bg-primary',
  primaryForeground: 'text-primary-foreground',
  secondary: 'bg-accent',
  accent: 'text-primary',
  gradient: 'bg-gradient-to-br from-primary/10 via-background to-background',
  glowColor: 'shadow-primary/30',
  borderColor: 'border-primary/20',
}
