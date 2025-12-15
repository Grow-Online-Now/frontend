/**
 * CharacterCounts Component
 * Displays character count for multiple platforms with color-coded status
 * Format: [platform icon] count/max, monospace 12px
 */

import { cn } from '@/lib/utils'
import { PlatformIcon } from '@/components/dashboard/posts/PlatformIcon'
import { CHARACTER_COUNT_PLATFORMS, PLATFORM_CONFIG } from '@/config/text-flow'
import type { SocialPlatform } from '@/types/connections'

interface CharacterCountsProps {
  content: string
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
  platforms = CHARACTER_COUNT_PLATFORMS,
  className,
}: CharacterCountsProps) {
  const charCount = content.length

  return (
    <div className={cn('flex items-center gap-4', className)}>
      {platforms.map((platform) => {
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
