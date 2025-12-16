/**
 * CharacterCounts Component
 * Displays character count for platforms with color-coded status
 * When selectedPlatformIds is provided, shows count for the most restrictive platform
 * Otherwise falls back to showing counts for CHARACTER_COUNT_PLATFORMS
 */

import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import { PlatformIcon } from '@/components/dashboard/posts/PlatformIcon'
import {
  CHARACTER_COUNT_PLATFORMS,
  PLATFORM_CONFIG,
  TEXT_FIRST_PLATFORMS,
} from '@/config/text-flow'
import type { SocialPlatform } from '@/types/connections'

interface CharacterCountsProps {
  content: string
  /** If provided, shows count for selected platforms (most restrictive) */
  selectedPlatformIds?: string[]
  /** Platforms for those IDs - maps ID to platform type */
  platformsMap?: Map<string, SocialPlatform>
  /** Fallback: specific platforms to show (defaults to CHARACTER_COUNT_PLATFORMS) */
  platforms?: SocialPlatform[]
  className?: string
}

// Format limit display (e.g., 3000 -> 3k)
const formatLimit = (num: number) => {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(num % 1000 === 0 ? 0 : 1)}k`
  }
  return num.toString()
}

export function CharacterCounts({
  content,
  selectedPlatformIds,
  platformsMap,
  platforms = CHARACTER_COUNT_PLATFORMS,
  className,
}: CharacterCountsProps) {
  const charCount = content.length

  // Determine which platforms to show
  const displayPlatforms = useMemo(() => {
    // If we have selected platform IDs and a map, use those
    if (selectedPlatformIds && selectedPlatformIds.length > 0 && platformsMap) {
      // Get unique platforms from selected IDs
      const selectedPlatforms = new Set<SocialPlatform>()
      selectedPlatformIds.forEach((id) => {
        const platform = platformsMap.get(id)
        if (platform && TEXT_FIRST_PLATFORMS.includes(platform)) {
          selectedPlatforms.add(platform)
        }
      })

      // Sort by character limit (most restrictive first) and take top 2
      return Array.from(selectedPlatforms)
        .sort((a, b) => PLATFORM_CONFIG[a].characterLimit - PLATFORM_CONFIG[b].characterLimit)
        .slice(0, 2)
    }

    // Fallback to default platforms
    return platforms
  }, [selectedPlatformIds, platformsMap, platforms])

  // If no platforms to display, show nothing
  if (displayPlatforms.length === 0) {
    return null
  }

  return (
    <div className={cn('flex items-center gap-4', className)}>
      {displayPlatforms.map((platform) => {
        const config = PLATFORM_CONFIG[platform]
        const limit = config.characterLimit
        const percentage = (charCount / limit) * 100

        // Determine color: muted default, warning at 90%, error when over
        let colorClass = 'text-muted-foreground'
        if (percentage >= 100) {
          colorClass = 'text-error'
        } else if (percentage >= 90) {
          colorClass = 'text-warning'
        }

        return (
          <div
            key={platform}
            className={cn('flex items-center gap-1.5 transition-colors duration-150', colorClass)}
          >
            <PlatformIcon platform={platform} size="xs" />
            <span className="font-mono text-xs tabular-nums">
              {charCount}/{formatLimit(limit)}
            </span>
          </div>
        )
      })}
    </div>
  )
}
