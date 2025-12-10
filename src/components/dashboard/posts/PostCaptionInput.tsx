/**
 * PostCaptionInput Component
 * Textarea with character counter and platform-specific limits
 */

import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { PLATFORM_CHARACTER_LIMITS } from '@/types/posts'
import type { SocialPlatform } from '@/types/connections'

interface PostCaptionInputProps {
  value: string
  onChange: (value: string) => void
  selectedPlatforms: SocialPlatform[]
  error?: string
  className?: string
}

export function PostCaptionInput({
  value,
  onChange,
  selectedPlatforms,
  error,
  className,
}: PostCaptionInputProps) {
  const { t } = useTranslation()

  // Calculate the minimum character limit from selected platforms
  const minLimit =
    selectedPlatforms.length > 0
      ? Math.min(...selectedPlatforms.map((p) => PLATFORM_CHARACTER_LIMITS[p] ?? 3000))
      : 3000

  const characterCount = value.length
  const isOverLimit = characterCount > minLimit
  const warningThreshold = minLimit * 0.9

  return (
    <div className={cn('space-y-2', className)}>
      <label className="text-foreground text-[13px] font-medium">
        {t('dashboard.createPost.caption.label')}
      </label>
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t('dashboard.createPost.caption.placeholder')}
          rows={8}
          className={cn(
            'bg-background text-foreground placeholder:text-muted-foreground/50 w-full resize-none rounded-xl border p-5 pb-10 text-[15px] leading-[1.7] transition-all duration-200',
            'shadow-[inset_0_2px_4px_rgba(0,0,0,0.04)] dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)]',
            'hover:border-border',
            'focus:border-primary focus:ring-primary/10 focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.04),0_0_0_3px_rgba(59,130,246,0.1)] focus:ring-[3px] focus:outline-none',
            'dark:focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.15),0_0_0_3px_rgba(59,130,246,0.15)]',
            error || isOverLimit
              ? 'border-destructive focus:ring-destructive/10'
              : 'border-border-subtle'
          )}
        />
        {/* Character count positioned inside textarea */}
        <div className="pointer-events-none absolute right-4 bottom-3 flex items-center gap-1.5 text-xs">
          <span
            className={cn(
              'tabular-nums transition-colors',
              characterCount === 0 && 'text-muted-foreground/40',
              characterCount > 0 &&
                characterCount <= warningThreshold &&
                'text-muted-foreground/60',
              characterCount > warningThreshold && !isOverLimit && 'text-warning font-medium',
              isOverLimit && 'text-destructive font-semibold'
            )}
          >
            {characterCount.toLocaleString()}
          </span>
          <span className="text-muted-foreground/30">/</span>
          <span className="text-muted-foreground/30 tabular-nums">{minLimit.toLocaleString()}</span>
        </div>
      </div>
      {error && <p className="text-destructive text-xs">{error}</p>}
    </div>
  )
}
