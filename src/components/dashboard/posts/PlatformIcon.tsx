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

// Platform background and icon colors
const platformStyles: Record<SocialPlatform, { bg: string; icon: string }> = {
  youtube: {
    bg: 'bg-[#FF0000]/8 dark:bg-[#FF0000]/12',
    icon: 'text-[#FF0000]',
  },
  instagram: {
    bg: 'bg-gradient-to-br from-[#FA7E1E]/8 to-[#D62976]/8 dark:from-[#FA7E1E]/12 dark:to-[#D62976]/12',
    icon: 'text-[#E4405F]',
  },
  facebook: {
    bg: 'bg-[#1877F2]/8 dark:bg-[#1877F2]/12',
    icon: 'text-[#1877F2]',
  },
  twitter: {
    bg: 'bg-foreground/5 dark:bg-foreground/8',
    icon: 'text-foreground',
  },
  linkedin: {
    bg: 'bg-[#0A66C2]/8 dark:bg-[#0A66C2]/12',
    icon: 'text-[#0A66C2]',
  },
  tiktok: {
    bg: 'bg-foreground/5 dark:bg-foreground/8',
    icon: 'text-foreground',
  },
  pinterest: {
    bg: 'bg-[#E60023]/8 dark:bg-[#E60023]/12',
    icon: 'text-[#E60023]',
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
