/**
 * PlatformIcon Component
 * Displays a social platform icon with appropriate styling
 */

import { cn } from '@/lib/utils'
import type { SocialPlatform } from '@/types/connections'
import { platformIcons } from '@/components/icons/platform-icons-map'

interface PlatformIconProps {
  platform: SocialPlatform
  size?: 'xs' | 'sm' | 'md' | 'lg'
  showBackground?: boolean
  className?: string
}

const sizeClasses = {
  xs: 'size-4',
  sm: 'size-6',
  md: 'size-8',
  lg: 'size-10',
}

const containerSizeClasses = {
  xs: 'size-6',
  sm: 'size-8',
  md: 'size-10',
  lg: 'size-12',
}

const iconInContainerSizeClasses = {
  xs: 'size-3',
  sm: 'size-4',
  md: 'size-5',
  lg: 'size-6',
}

// Platform background and icon colors using CSS variables from design system
// Platform colors defined in index.css: --platform-twitter, --platform-linkedin, etc.
const platformStyles: Record<SocialPlatform, { bg: string; icon: string; className: string }> = {
  youtube: {
    bg: 'bg-[var(--platform-youtube)]/8 dark:bg-[var(--platform-youtube)]/12',
    icon: 'text-[var(--platform-youtube)]',
    className: 'platform-youtube',
  },
  instagram: {
    bg: 'bg-[var(--platform-instagram)]/8 dark:bg-[var(--platform-instagram)]/12',
    icon: 'text-[var(--platform-instagram)]',
    className: 'platform-instagram',
  },
  facebook: {
    bg: 'bg-[var(--platform-facebook)]/8 dark:bg-[var(--platform-facebook)]/12',
    icon: 'text-[var(--platform-facebook)]',
    className: 'platform-facebook',
  },
  twitter: {
    bg: 'bg-foreground/5 dark:bg-foreground/8',
    icon: 'text-foreground',
    className: 'platform-twitter',
  },
  linkedin: {
    bg: 'bg-[var(--platform-linkedin)]/8 dark:bg-[var(--platform-linkedin)]/12',
    icon: 'text-[var(--platform-linkedin)]',
    className: 'platform-linkedin',
  },
  tiktok: {
    bg: 'bg-foreground/5 dark:bg-foreground/8',
    icon: 'text-foreground',
    className: 'platform-tiktok',
  },
  pinterest: {
    bg: 'bg-[var(--platform-pinterest)]/8 dark:bg-[var(--platform-pinterest)]/12',
    icon: 'text-[var(--platform-pinterest)]',
    className: 'platform-pinterest',
  },
}

export function PlatformIcon({
  platform,
  size = 'md',
  showBackground = false,
  className,
}: PlatformIconProps) {
  const Icon = platformIcons[platform]
  const styles = platformStyles[platform]

  if (!Icon) {
    return null
  }

  if (showBackground) {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-xl',
          containerSizeClasses[size],
          styles.bg,
          className
        )}
      >
        <Icon className={cn(iconInContainerSizeClasses[size], styles.icon)} />
      </div>
    )
  }

  return <Icon className={cn(sizeClasses[size], styles.icon, className)} />
}
