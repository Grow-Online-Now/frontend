/**
 * TextComposer Component
 * Auto-resizing textarea for post content
 * Min-height 120px, max-height 400px, scrolls internally when exceeds max
 */

import { useRef, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

interface TextComposerProps {
  value: string
  onChange: (value: string) => void
  placeholderKey?: string
  autoFocus?: boolean
  className?: string
}

const MIN_HEIGHT = 120
const MAX_HEIGHT = 400

export function TextComposer({
  value,
  onChange,
  placeholderKey = 'dashboard.create.text.step1.placeholder',
  autoFocus = true,
  className,
}: TextComposerProps) {
  const { t } = useTranslation()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea to fit content, capped at MAX_HEIGHT
  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      const scrollHeight = textarea.scrollHeight
      const newHeight = Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, scrollHeight))
      textarea.style.height = `${newHeight}px`
      // Enable scrolling only when content exceeds max height
      textarea.style.overflowY = scrollHeight > MAX_HEIGHT ? 'auto' : 'hidden'
    }
  }, [])

  // Adjust height when value changes
  useEffect(() => {
    adjustHeight()
  }, [value, adjustHeight])

  // Focus on mount if autoFocus
  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [autoFocus])

  return (
    <div className={cn('w-full', className)}>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t(placeholderKey)}
        className={cn(
          'composer-textarea', // Used in global CSS to override focus styles
          'w-full resize-none bg-transparent',
          'p-5', // 20px padding
          'text-base leading-[1.6]', // 16px, line-height 1.6
          'text-foreground placeholder:text-muted-foreground',
          // Custom scrollbar styling
          'scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent'
        )}
        style={{ minHeight: MIN_HEIGHT }}
        rows={1}
      />
    </div>
  )
}
