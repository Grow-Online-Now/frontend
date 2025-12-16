/**
 * Step1Write Component
 * First step of the text flow: Write content + Select accounts
 * Three-column layout: Left (library), Center (composer), Right (preview)
 */

import { useState, useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { TextComposer } from './TextComposer'
import { CharacterCounts } from './CharacterCounts'
import { ComposerToolbar } from './ComposerToolbar'
import { AccountSelector } from './AccountSelector'
import { Step1PreviewPanel } from './Step1PreviewPanel'
import { PreviewModal } from './PreviewModal'
import { LibraryPanel } from './LibraryPanel'
import { MediaPreviewGrid } from '@/components/create/shared/MediaPreviewGrid'
import type { FileUploadState } from '@/hooks/useMediaUpload'
import type { MediaItem } from '@/types/media'
import type { PostResponse } from '@/types/posts'
import type { PlatformWithValidation, ValidationWarning } from '@/types/create'

interface Step1WriteProps {
  // Content
  content: string
  onContentChange: (content: string) => void

  // Media
  media: FileUploadState[]
  onMediaUpload: (files: FileList) => void
  onMediaRemove: (id: string) => void
  onMediaRetry?: (id: string) => void
  onAddLibraryMedia?: (media: MediaItem) => void

  // Account selection
  availableAccounts: PlatformWithValidation[]
  selectedAccountIds: string[]
  onToggleAccount: (id: string) => void
  validations?: ValidationWarning[]
  onShortenWithAI?: (platformId: string) => void

  // Library panel data
  recentMedia: MediaItem[]
  isLoadingRecentMedia?: boolean
  recentDrafts: PostResponse[]
  isLoadingDrafts?: boolean
  onSelectDraft: (draft: PostResponse) => void
  onOpenMediaLibrary: () => void

  // Flow controls
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
  onAddLibraryMedia,
  availableAccounts,
  selectedAccountIds,
  onToggleAccount,
  validations = [],
  onShortenWithAI,
  recentMedia,
  isLoadingRecentMedia,
  recentDrafts,
  isLoadingDrafts,
  onSelectDraft,
  onOpenMediaLibrary,
  onContinue,
  canContinue = false,
  className,
}: Step1WriteProps) {
  const { t } = useTranslation()
  const [previewOpen, setPreviewOpen] = useState(false)

  // Detect Mac vs Windows/Linux for modifier key display
  const isMac = useMemo(
    () => typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.userAgent),
    []
  )
  const modKey = isMac ? '⌘' : 'Ctrl'

  // Compute selected platforms with validation for preview
  const selectedPlatforms = useMemo(
    () => availableAccounts.filter((a) => selectedAccountIds.includes(a.id)),
    [availableAccounts, selectedAccountIds]
  )

  // Create a map of account IDs to platform types for CharacterCounts
  const platformsMap = useMemo(
    () => new Map(availableAccounts.map((a) => [a.id, a.platform])),
    [availableAccounts]
  )

  // Handle Cmd/Ctrl + Enter to continue
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

      // Check for MediaItem JSON (from sidebar)
      const jsonData = e.dataTransfer.getData('application/json')
      if (jsonData && onAddLibraryMedia) {
        try {
          const mediaItem = JSON.parse(jsonData) as MediaItem
          if (mediaItem.id && mediaItem.url) {
            onAddLibraryMedia(mediaItem)
            return
          }
        } catch {
          // Not valid JSON, fall through to file handling
        }
      }

      // Handle file drops
      const files = e.dataTransfer.files
      if (files.length > 0) {
        onMediaUpload(files)
      }
    },
    [onMediaUpload, onAddLibraryMedia]
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
    <motion.div {...stepAnimation} className={cn('flex h-full w-full gap-5', className)}>
      {/* LEFT: Library Panel (desktop only) */}
      <div className="hidden w-[260px] shrink-0 lg:block">
        <LibraryPanel
          recentMedia={recentMedia}
          recentDrafts={recentDrafts}
          isLoadingMedia={isLoadingRecentMedia}
          isLoadingDrafts={isLoadingDrafts}
          onAddMedia={onAddLibraryMedia!}
          onSelectDraft={onSelectDraft}
          onOpenMediaLibrary={onOpenMediaLibrary}
        />
      </div>

      {/* CENTER: Composer */}
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        {/* Account Selector - fixed height */}
        <AccountSelector
          accounts={availableAccounts}
          selectedIds={selectedAccountIds}
          onToggle={onToggleAccount}
          validations={validations}
          onShortenWithAI={onShortenWithAI}
          onOpenPreview={() => setPreviewOpen(true)}
          onOpenLibrary={onOpenMediaLibrary}
          className="shrink-0"
        />

        {/* Composer card - grows to fill space, internal scroll */}
        <div
          className="border-border bg-surface-elevated flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {/* Textarea - scrolls internally when content grows */}
          <div className="min-h-0 flex-1" onPaste={handlePaste}>
            <TextComposer value={content} onChange={onContentChange} />
          </div>

          {/* Media preview grid - compact thumbnails */}
          {media.length > 0 && (
            <div className="border-border shrink-0 border-t px-5 py-3">
              <MediaPreviewGrid
                media={media}
                onRemove={onMediaRemove}
                onRetry={onMediaRetry}
                variant="compact"
              />
            </div>
          )}

          {/* Toolbar footer - fixed at bottom */}
          <div className="border-border flex shrink-0 items-center justify-between border-t px-5 py-3">
            <ComposerToolbar onMediaUpload={onMediaUpload} />
            <CharacterCounts
              content={content}
              selectedPlatformIds={selectedAccountIds}
              platformsMap={platformsMap}
            />
          </div>
        </div>

        {/* Keyboard shortcuts hint - fixed height */}
        <div className="text-muted-foreground flex shrink-0 flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs">
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
          <span className="hidden sm:inline">{t('dashboard.create.text.shortcuts.dragFiles')}</span>
          <span className="hidden sm:inline">
            <kbd className="bg-surface-elevated rounded px-1.5 py-0.5 font-mono text-[11px]">
              {modKey}
            </kbd>
            <span className="mx-0.5">+</span>
            <kbd className="bg-surface-elevated rounded px-1.5 py-0.5 font-mono text-[11px]">S</kbd>
            <span className="ml-1">{t('dashboard.create.text.shortcuts.saveDraft')}</span>
          </span>
        </div>
      </div>

      {/* RIGHT: Preview Panel (desktop only) */}
      <div className="hidden w-[320px] shrink-0 lg:block">
        <Step1PreviewPanel content={content} media={media} selectedPlatforms={selectedPlatforms} />
      </div>

      {/* Mobile Preview Modal */}
      <PreviewModal
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        content={content}
        media={media}
        selectedPlatforms={selectedPlatforms}
      />
    </motion.div>
  )
}
