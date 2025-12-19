/**
 * AccountAvatar Component
 * Profile picture with platform badge overlay - reusable across the app
 *
 * Usage:
 * <AccountAvatar
 *   src={account.avatarUrl}
 *   platform="instagram"
 *   name="@username"
 *   size="md"
 * />
 */

import { cn } from '@/lib/utils'
import type { SocialPlatform } from '@/types/connections'

// Monochrome badge style for premium look
// All platforms use foreground color for badge background, icons use background color
// This creates visual consistency: dark badges in light mode, light badges in dark mode
const BADGE_BG_COLOR = 'var(--color-foreground)'

// Platform icons as inline SVGs for crisp rendering at small sizes
const PLATFORM_ICONS: Record<SocialPlatform, React.ReactNode> = {
  youtube: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-full">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-full">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-full">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  ),
  twitter: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-full">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-full">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-full">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  pinterest: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-full">
      <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
    </svg>
  ),
  bluesky: (
    <svg viewBox="0 0 48 48" fill="currentColor" className="size-full">
      <path d="M10.8576 6.06895C16.1772 10.1191 21.8992 18.3313 24 22.7383C26.1009 18.3316 31.8225 10.1191 37.1424 6.06895C40.9808 3.14649 47.2 0.885261 47.2 8.08062C47.2 9.51763 46.3876 20.1523 45.9111 21.8788C44.2548 27.8812 38.2196 29.4122 32.8511 28.4856C42.2351 30.1053 44.6223 35.4704 39.4668 40.8355C29.6756 51.0249 25.394 38.279 24.2964 35.013C24.0953 34.4143 24.0012 34.1342 23.9998 34.3723C23.9984 34.1342 23.9043 34.4143 23.7032 35.013C22.6061 38.279 18.3246 51.0252 8.5328 40.8355C3.37728 35.4704 5.7644 30.105 15.1486 28.4856C9.77992 29.4122 3.74456 27.8812 2.08856 21.8788C1.61207 20.1521 0.799683 9.51747 0.799683 8.08062C0.799683 0.885261 7.01904 3.14649 10.8573 6.06895H10.8576Z" />
    </svg>
  ),
  threads: (
    <svg viewBox="0 0 48 48" fill="currentColor" className="size-full">
      <path d="M35.3843 22.2471C35.1775 22.148 34.9675 22.0526 34.7547 21.9613C34.3842 15.1346 30.654 11.2262 24.3905 11.1862C24.3621 11.1861 24.3339 11.1861 24.3055 11.1861C20.5591 11.1861 17.4433 12.7852 15.5255 15.6952L18.9702 18.0582C20.4029 15.8846 22.6513 15.4212 24.3071 15.4212C24.3263 15.4212 24.3455 15.4212 24.3644 15.4214C26.4268 15.4345 27.983 16.0342 28.9902 17.2035C29.7232 18.0548 30.2135 19.2313 30.4562 20.716C28.6277 20.4052 26.6502 20.3096 24.5362 20.4308C18.5812 20.7738 14.7528 24.247 15.0099 29.073C15.1404 31.521 16.3599 33.627 18.4438 35.0028C20.2056 36.1657 22.4748 36.7345 24.8331 36.6058C27.9475 36.435 30.3907 35.2467 32.0952 33.074C33.3897 31.424 34.2085 29.2857 34.57 26.5915C36.0542 27.4872 37.1543 28.666 37.7617 30.083C38.7948 32.4917 38.855 36.45 35.6253 39.677C32.7955 42.504 29.394 43.727 24.2534 43.7648C18.551 43.7225 14.2384 41.8937 11.4345 38.3293C8.80887 34.9915 7.45192 30.1705 7.4013 24C7.45192 17.8295 8.80887 13.0084 11.4345 9.67068C14.2384 6.10623 18.551 4.2775 24.2533 4.23513C29.997 4.27782 34.3848 6.11535 37.296 9.697C38.7235 11.4534 39.7998 13.6622 40.5093 16.2376L44.546 15.1606C43.686 11.9906 42.3327 9.25893 40.4912 6.9935C36.759 2.40167 31.3005 0.048787 24.2674 0H24.2392C17.2204 0.0486175 11.823 2.41045 8.19707 7.01982C4.97047 11.1216 3.3061 16.8289 3.25017 23.9831L3.25 24L3.25017 24.0169C3.3061 31.171 4.97047 36.8785 8.19707 40.9803C11.823 45.5895 17.2204 47.9515 24.2392 48H24.2674C30.5075 47.9567 34.906 46.323 38.5295 42.7028C43.2702 37.9665 43.1275 32.0298 41.565 28.3853C40.444 25.7717 38.3068 23.649 35.3843 22.2471ZM24.6101 32.3768C22.0001 32.5238 19.2886 31.3523 19.1549 28.843C19.0558 26.9825 20.479 24.9065 24.7703 24.6592C25.2617 24.6308 25.744 24.617 26.2178 24.617C27.7765 24.617 29.2347 24.7684 30.5605 25.0583C30.066 31.2337 27.1655 32.2365 24.6101 32.3768Z" />
    </svg>
  ),
}

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

interface AccountAvatarProps {
  /** Profile picture URL */
  src?: string | null
  /** Social platform for the badge */
  platform: SocialPlatform
  /** Account name or username for fallback/alt text */
  name?: string
  /** Size variant */
  size?: AvatarSize
  /** Additional classes */
  className?: string
  /** Show platform badge (default: true) */
  showBadge?: boolean
  /** Show border around avatar (for stacking) */
  showBorder?: boolean
  /** Inline styles */
  style?: React.CSSProperties
  /** Show as unconnected platform with dashed border */
  isUnconnected?: boolean
}

const SIZE_CONFIG: Record<
  AvatarSize,
  { avatar: string; badge: string; badgeIcon: string; offset: string }
> = {
  xs: {
    avatar: 'size-6',
    badge: 'size-3',
    badgeIcon: 'size-1.5',
    offset: '-bottom-0.5 -right-0.5',
  },
  sm: {
    avatar: 'size-8',
    badge: 'size-3.5',
    badgeIcon: 'size-2',
    offset: '-bottom-0.5 -right-0.5',
  },
  md: {
    avatar: 'size-10',
    badge: 'size-4',
    badgeIcon: 'size-2.5',
    offset: '-bottom-0.5 -right-0.5',
  },
  lg: { avatar: 'size-12', badge: 'size-5', badgeIcon: 'size-3', offset: '-bottom-1 -right-1' },
  xl: { avatar: 'size-16', badge: 'size-6', badgeIcon: 'size-3.5', offset: '-bottom-1 -right-1' },
}

export function AccountAvatar({
  src,
  platform,
  name,
  size = 'md',
  className,
  showBadge = true,
  showBorder = false,
  style,
  isUnconnected = false,
}: AccountAvatarProps) {
  const config = SIZE_CONFIG[size]
  const initials = name ? name.replace('@', '').slice(0, 2).toUpperCase() : '?'

  return (
    <div className={cn('relative inline-flex shrink-0', className)} style={style}>
      {/* Avatar */}
      <div
        className={cn(
          'relative overflow-hidden rounded-full',
          config.avatar,
          showBorder && 'border-background box-content border-2',
          isUnconnected
            ? 'border-2 border-dashed border-muted-foreground/40 bg-muted/30'
            : 'bg-muted'
        )}
      >
        {isUnconnected ? (
          // Empty state for unconnected platforms
          <div className="size-full" />
        ) : src ? (
          <img src={src} alt={name || 'Account avatar'} className="size-full object-cover" />
        ) : (
          <div className="from-muted to-muted-foreground/20 flex size-full items-center justify-center bg-linear-to-br">
            <span className="text-muted-foreground text-[0.6em] font-semibold">{initials}</span>
          </div>
        )}
      </div>

      {/* Platform Badge - Monochrome style for premium look */}
      {showBadge && (
        <div
          className={cn(
            'absolute flex items-center justify-center rounded-full ring-2',
            config.badge,
            config.offset,
            isUnconnected ? 'ring-foreground/30' : 'ring-background'
          )}
          style={{ backgroundColor: BADGE_BG_COLOR }}
        >
          <div className={cn(config.badgeIcon, 'text-background')}>
            {PLATFORM_ICONS[platform]}
          </div>
        </div>
      )}
    </div>
  )
}

interface AccountAvatarStackProps {
  accounts: Array<{
    id: string
    platform: SocialPlatform
    avatarUrl?: string | null
    name?: string
    username?: string
  }>
  /** Maximum avatars to show before +N */
  max?: number
  /** Size variant */
  size?: AvatarSize
  /** Additional classes */
  className?: string
}

export function AccountAvatarStack({
  accounts,
  max = 3,
  size = 'sm',
  className,
}: AccountAvatarStackProps) {
  const visible = accounts.slice(0, max)
  const remaining = accounts.length - max

  // Overlap amounts based on size
  const overlapClass = {
    xs: '-space-x-2',
    sm: '-space-x-3',
    md: '-space-x-3.5',
    lg: '-space-x-4',
    xl: '-space-x-5',
  }[size]

  const stackContent = (
    <div className={cn('flex items-center', className)}>
      <div className={cn('flex', overlapClass)}>
        {visible.map((account, idx) => (
          <AccountAvatar
            key={account.id}
            src={account.avatarUrl}
            platform={account.platform}
            name={account.name || account.username}
            size={size}
            showBorder
            style={{ zIndex: visible.length - idx }}
          />
        ))}
        {remaining > 0 && (
          <div
            className={cn(
              'border-background bg-muted text-muted-foreground box-content flex items-center justify-center rounded-full border-2',
              SIZE_CONFIG[size].avatar
            )}
            style={{ zIndex: 0 }}
          >
            <span className="text-[0.6em] font-medium">+{remaining}</span>
          </div>
        )}
      </div>
    </div>
  )

  return stackContent
}
