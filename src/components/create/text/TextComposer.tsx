/**
 * TextComposer Component
 * Textarea for post content that fills available space
 * Min-height ensures usability, container handles overflow
 */

import { useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

interface TextComposerProps {
  value: string
  onChange: (value: string) => void
  placeholderKey?: string
  autoFocus?: boolean
  className?: string
}

const MIN_HEIGHT = 150

export function TextComposer({
  value,
  onChange,
  placeholderKey = 'dashboard.create.text.step1.placeholder',
  autoFocus = true,
  className,
}: TextComposerProps) {
  const { t } = useTranslation()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Focus on mount if autoFocus
  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [autoFocus])

  return (
    <div className={cn('h-full w-full', className)}>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t(placeholderKey)}
        className={cn(
          'composer-textarea', // Used in global CSS to override focus styles
          'h-full w-full resize-none bg-transparent',
          'p-5', // 20px padding
          'text-base leading-[1.6]', // 16px, line-height 1.6
          'text-foreground placeholder:text-muted-foreground',
          // Only show scrollbar when content overflows
          'overflow-y-auto'
        )}
        style={{ minHeight: MIN_HEIGHT }}
      />
    </div>
  )
}
