/**
 * Step1Write Component
 * Single-page text post creation with compose and publish
 * Two-column layout: Left (composer), Right (preview + compact library)
 */

import { useState, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { TextComposer } from './TextComposer'
import { CharacterCounts } from './CharacterCounts'
import { ComposerToolbar } from './ComposerToolbar'
import { AccountSelector } from './AccountSelector'
import { Step1PreviewPanel } from './Step1PreviewPanel'
import { PreviewModal } from './PreviewModal'
import { PublishActions } from './PublishActions'
import { MediaPreviewGrid } from '@/components/create/shared/MediaPreviewGrid'
import type { FileUploadState } from '@/hooks/useMediaUpload'
import type { MediaItem } from '@/types/media'
import type { PostResponse } from '@/types/posts'
import type {
  PlatformWithValidation,
  ValidationWarning,
  TextFlowScheduleType,
} from '@/types/create'
import type { SocialPlatform } from '@/types/connections'

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
  unconnectedPlatforms?: SocialPlatform[]
  onConnectPlatform?: (platform: SocialPlatform) => void

  // Library panel data
  recentMedia: MediaItem[]
  isLoadingRecentMedia?: boolean
  recentDrafts: PostResponse[]
  isLoadingDrafts?: boolean
  onSelectDraft: (draft: PostResponse) => void
  onOpenMediaLibrary: () => void

  // Scheduling
  scheduleType: TextFlowScheduleType
  onScheduleTypeChange: (type: TextFlowScheduleType) => void
  scheduledDate: Date | null
  onScheduledDateChange: (date: Date | null) => void

  // Submission
  onSubmit: () => void
  isSubmitting: boolean
  canSubmit?: boolean
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
  unconnectedPlatforms = [],
  onConnectPlatform,
  recentMedia,
  isLoadingRecentMedia,
  recentDrafts,
  isLoadingDrafts,
  onSelectDraft,
  onOpenMediaLibrary,
  scheduleType,
  onScheduleTypeChange,
  scheduledDate,
  onScheduledDateChange,
  onSubmit,
  isSubmitting,
  canSubmit = false,
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
      {/* LEFT: Composer */}
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
          unconnectedPlatforms={unconnectedPlatforms}
          onConnectPlatform={onConnectPlatform}
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

          {/* Toolbar row */}
          <div className="border-border flex shrink-0 items-center justify-between border-t px-5 py-3">
            <ComposerToolbar onMediaUpload={onMediaUpload} />
            <CharacterCounts
              content={content}
              selectedPlatformIds={selectedAccountIds}
              platformsMap={platformsMap}
            />
          </div>

          {/* Publish actions - fixed at bottom */}
          <div className="border-border flex shrink-0 items-center justify-end gap-3 border-t px-5 py-3">
            <PublishActions
              scheduleType={scheduleType}
              onScheduleTypeChange={onScheduleTypeChange}
              scheduledDate={scheduledDate}
              onScheduledDateChange={onScheduledDateChange}
              onSubmit={onSubmit}
              isSubmitting={isSubmitting}
              disabled={!canSubmit}
            />
          </div>
        </div>

        {/* Keyboard shortcuts hint - fixed height */}
        <div className="text-muted-foreground flex shrink-0 flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs">
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

      {/* RIGHT: Preview Panel with Library (desktop only) */}
      <div className="hidden w-[380px] shrink-0 lg:block">
        <Step1PreviewPanel
          content={content}
          media={media}
          selectedPlatforms={selectedPlatforms}
          recentMedia={recentMedia}
          recentDrafts={recentDrafts}
          isLoadingMedia={isLoadingRecentMedia}
          isLoadingDrafts={isLoadingDrafts}
          onAddMedia={onAddLibraryMedia}
          onSelectDraft={onSelectDraft}
          onOpenMediaLibrary={onOpenMediaLibrary}
        />
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
