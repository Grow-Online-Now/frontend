/**
 * PlatformCard Component
 * Full-width row card for platform selection
 * Layout: [icon 44px] [name + handle] [char count] [checkmark]
 */

import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PlatformIcon } from '@/components/dashboard/posts/PlatformIcon'
import type { PlatformWithValidation } from '@/types/create'

interface PlatformCardProps {
  platform: PlatformWithValidation
  isSelected: boolean
  onToggle: () => void
  className?: string
}

export function PlatformCard({ platform, isSelected, onToggle, className }: PlatformCardProps) {
  const isOverLimit = platform.isOverLimit
  const isNearLimit = platform.isNearLimit && !isOverLimit
  const isValid = !isOverLimit && !isNearLimit

  // Format character limit (3000 -> 3k)
  const formatLimit = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(num % 1000 === 0 ? 0 : 1)}k`
    }
    return num.toString()
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        'w-full rounded-xl text-left',
        'flex items-center gap-4 p-4',
        'border transition-all duration-150',
        // Selected state
        isSelected && 'border-foreground bg-surface-hover',
        // Not selected state
        !isSelected &&
          'bg-surface-subtle border-border hover:border-border-emphasis hover:bg-surface-hover',
        className
      )}
    >
      {/* Platform icon - 44px */}
      <PlatformIcon platform={platform.platform} size="md" showBackground />

      {/* Account info */}
      <div className="min-w-0 flex-1">
        <div className="text-foreground truncate text-sm font-medium">
          {platform.displayName || platform.platformUsername}
        </div>
        <div className="text-muted-foreground truncate text-[13px]">
          @{platform.platformUsername}
        </div>
      </div>

      {/* Character count - always visible */}
      <div className="flex items-center gap-3">
        <span
          className={cn(
            'font-mono text-xs',
            isOverLimit && 'text-error',
            isNearLimit && 'text-warning',
            isValid && isSelected && 'text-success',
            isValid && !isSelected && 'text-muted-foreground'
          )}
        >
          {platform.characterCount}/{formatLimit(platform.characterLimit)}
        </span>

        {/* Checkmark - visible when selected */}
        <div
          className={cn(
            'flex h-6 w-6 items-center justify-center rounded-full transition-opacity duration-150',
            isSelected ? 'bg-foreground opacity-100' : 'opacity-0'
          )}
        >
          <Check className="text-background h-3.5 w-3.5" />
        </div>
      </div>
    </button>
  )
}
