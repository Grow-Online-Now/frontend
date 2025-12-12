/**
 * TwitterCharacterCounter
 * Reusable character counter for Twitter's 280 character limit
 */

import { cn } from '@/lib/utils'

const TWITTER_CHAR_LIMIT = 280
const WARNING_THRESHOLD = 260

interface TwitterCharacterCounterProps {
  current: number
  limit?: number
  warningThreshold?: number
  className?: string
}

export function TwitterCharacterCounter({
  current,
  limit = TWITTER_CHAR_LIMIT,
  warningThreshold = WARNING_THRESHOLD,
  className,
}: TwitterCharacterCounterProps) {
  const isOverLimit = current > limit
  const isNearLimit = current > warningThreshold

  return (
    <span
      className={cn(
        'text-xs tabular-nums transition-colors',
        current === 0 && 'text-muted-foreground/50',
        current > 0 && !isNearLimit && 'text-muted-foreground',
        isNearLimit && !isOverLimit && 'text-warning font-medium',
        isOverLimit && 'text-destructive font-semibold',
        className
      )}
    >
      {current}/{limit}
    </span>
  )
}
