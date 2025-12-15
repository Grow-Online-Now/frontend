/**
 * CaptionEditor Component
 * Rich text editor with character count and toolbar
 */

import { useTranslation } from 'react-i18next'
import { Smile, Hash, AtSign, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PLATFORM_CHARACTER_LIMITS } from '@/types/posts'
import type { SocialPlatform } from '@/types/connections'

interface CaptionEditorProps {
  value: string
  onChange: (value: string) => void
  selectedPlatforms: SocialPlatform[]
  placeholder?: string
  error?: string
  className?: string
}

export function CaptionEditor({
  value,
  onChange,
  selectedPlatforms,
  placeholder,
  error,
  className,
}: CaptionEditorProps) {
  const { t } = useTranslation()

  // Calculate the minimum character limit from selected platforms
  const characterLimit =
    selectedPlatforms.length > 0
      ? Math.min(...selectedPlatforms.map((p) => PLATFORM_CHARACTER_LIMITS[p] ?? 3000))
      : 3000

  const characterCount = value.length
  const isOverLimit = characterCount > characterLimit
  const isNearLimit = characterCount > characterLimit * 0.9

  return (
    <div
      className={cn('bg-card border-border-subtle overflow-hidden rounded-xl border', className)}
    >
      {/* Header */}
      <div className="border-border-subtle flex items-center justify-between border-b px-4 py-3">
        <label className="text-muted-foreground text-sm font-medium">
          {t('dashboard.createPost.caption.label')}
        </label>
        <span
          className={cn(
            'text-xs tabular-nums transition-colors',
            characterCount === 0 && 'text-muted-foreground/50',
            characterCount > 0 && !isNearLimit && 'text-muted-foreground',
            isNearLimit && !isOverLimit && 'text-warning font-medium',
            isOverLimit && 'text-destructive font-semibold'
          )}
        >
          {characterCount.toLocaleString()}/{characterLimit.toLocaleString()}
        </span>
      </div>

      {/* Textarea */}
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || t('dashboard.createPost.caption.placeholder')}
          rows={6}
          className={cn(
            'w-full resize-none bg-transparent px-4 py-4 text-base leading-relaxed outline-none',
            'placeholder:text-muted-foreground/40',
            error && 'ring-destructive/20 ring-2'
          )}
        />
      </div>

      {/* Toolbar */}
      <div className="bg-surface-elevated border-border-subtle flex items-center gap-1 border-t px-3 py-2">
        <button
          type="button"
          className="text-muted-foreground hover:bg-surface hover:text-foreground flex h-8 w-8 items-center justify-center rounded-md transition-colors"
          title={t('dashboard.createPost.caption.addEmoji')}
        >
          <Smile className="h-[18px] w-[18px]" />
        </button>
        <button
          type="button"
          className="text-muted-foreground hover:bg-surface hover:text-foreground flex h-8 w-8 items-center justify-center rounded-md transition-colors"
          title={t('dashboard.createPost.caption.addHashtag')}
        >
          <Hash className="h-[18px] w-[18px]" />
        </button>
        <button
          type="button"
          className="text-muted-foreground hover:bg-surface hover:text-foreground flex h-8 w-8 items-center justify-center rounded-md transition-colors"
          title={t('dashboard.createPost.caption.addMention')}
        >
          <AtSign className="h-[18px] w-[18px]" />
        </button>

        <div className="bg-border-subtle mx-2 h-5 w-px" />

        <button
          type="button"
          className="text-muted-foreground hover:bg-surface hover:text-foreground flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium transition-colors"
        >
          <Sparkles className="h-4 w-4" />
          {t('dashboard.createPost.caption.aiAssist')}
        </button>
      </div>

      {error && (
        <div className="bg-destructive/5 border-border-subtle border-t px-4 py-2">
          <p className="text-destructive text-xs">{error}</p>
        </div>
      )}
    </div>
  )
}
