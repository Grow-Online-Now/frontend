/**
 * Step1Write Component
 * First step of the text flow: Write content with optional media
 * Compact card-based layout that hugs content
 */

import { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { TextComposer } from './TextComposer'
import { CharacterCounts } from './CharacterCounts'
import { ComposerToolbar } from './ComposerToolbar'
import { MediaPreviewGrid } from '@/components/create/shared/MediaPreviewGrid'
import type { FileUploadState } from '@/hooks/useMediaUpload'

interface Step1WriteProps {
  content: string
  onContentChange: (content: string) => void
  media: FileUploadState[]
  onMediaUpload: (files: FileList) => void
  onMediaRemove: (id: string) => void
  onMediaRetry?: (id: string) => void
  onContinue?: () => void
  canContinue?: boolean
  className?: string
}

const stepAnimation = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.2, ease: 'easeOut' as const },
}

export function Step1Write({
  content,
  onContentChange,
  media,
  onMediaUpload,
  onMediaRemove,
  onMediaRetry,
  onContinue,
  canContinue = false,
  className,
}: Step1WriteProps) {
  const { t } = useTranslation()

  // Detect Mac vs Windows/Linux for modifier key display
  const isMac = useMemo(
    () => typeof navigator !== 'undefined' && navigator.platform.toUpperCase().includes('MAC'),
    []
  )
  const modKey = isMac ? '⌘' : 'Ctrl'

  // Handle Cmd/Ctrl + Enter to continue (Save draft handled in CreateTextPostPage)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isModKey = isMac ? e.metaKey : e.ctrlKey

      // Mod + Enter: Continue to next step
      if (isModKey && e.key === 'Enter') {
        e.preventDefault()
        if (canContinue && onContinue) {
          onContinue()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isMac, canContinue, onContinue])

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      const files = e.dataTransfer.files
      if (files.length > 0) {
        onMediaUpload(files)
      }
    },
    [onMediaUpload]
  )

  // Handle paste from clipboard
  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      const items = e.clipboardData.items
      const files: File[] = []
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile()
          if (file) files.push(file)
        }
      }
      if (files.length > 0) {
        const dataTransfer = new DataTransfer()
        files.forEach((f) => dataTransfer.items.add(f))
        onMediaUpload(dataTransfer.files)
      }
    },
    [onMediaUpload]
  )

  return (
    <motion.div {...stepAnimation} className={cn('mx-auto w-full max-w-[640px]', className)}>
      {/* Composer card */}
      <div
        className="bg-surface-subtle border-border overflow-hidden rounded-2xl border"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Textarea */}
        <div onPaste={handlePaste}>
          <TextComposer value={content} onChange={onContentChange} />
        </div>

        {/* Media preview grid - inside card body */}
        {media.length > 0 && (
          <div className="px-5 pb-4">
            <MediaPreviewGrid media={media} onRemove={onMediaRemove} onRetry={onMediaRetry} />
          </div>
        )}

        {/* Toolbar footer */}
        <div className="border-border flex items-center justify-between border-t px-5 py-3">
          <ComposerToolbar onMediaUpload={onMediaUpload} />
          <CharacterCounts content={content} />
        </div>
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="text-muted-foreground mt-4 flex items-center justify-center gap-1 text-xs">
        <span>
          <kbd className="bg-surface-elevated rounded px-1.5 py-0.5 font-mono text-[11px]">
            {modKey}
          </kbd>
          <span className="mx-0.5">+</span>
          <kbd className="bg-surface-elevated rounded px-1.5 py-0.5 font-mono text-[11px]">
            Enter
          </kbd>
          <span className="ml-1">{t('dashboard.create.text.shortcuts.continue')}</span>
        </span>
        <span className="text-border mx-2">·</span>
        <span>{t('dashboard.create.text.shortcuts.dragFiles')}</span>
        <span className="text-border mx-2">·</span>
        <span>
          <kbd className="bg-surface-elevated rounded px-1.5 py-0.5 font-mono text-[11px]">
            {modKey}
          </kbd>
          <span className="mx-0.5">+</span>
          <kbd className="bg-surface-elevated rounded px-1.5 py-0.5 font-mono text-[11px]">S</kbd>
          <span className="ml-1">{t('dashboard.create.text.shortcuts.saveDraft')}</span>
        </span>
      </div>
    </motion.div>
  )
}
