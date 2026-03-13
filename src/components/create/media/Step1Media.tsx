/**
 * Step1Media Component
 * Main layout for media-first post creation
 * Two-column layout: Left (media upload + caption + configs), Right (preview panel)
 */

import { useState, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { MediaDropZone } from './MediaDropZone'
import { CaptionInput } from './CaptionInput'
import { MediaAccountSelector } from './MediaAccountSelector'
import { PlatformConfigAccordion } from './PlatformConfigAccordion'
import { MediaPreviewPanel } from './MediaPreviewPanel'
import { MediaPreviewGrid } from '@/components/create/shared/MediaPreviewGrid'
import { PublishActions } from '@/components/create/text/PublishActions'
import { PreviewModal } from '@/components/create/text/PreviewModal'
import type { FileUploadState } from '@/hooks/useMediaUpload'
import type { MediaItem } from '@/types/media'
import type { PostResponse } from '@/types/posts'
import type {
  MediaPlatformWithValidation,
  MediaFlowValidationWarning,
  MediaFlowScheduleType,
} from '@/types/create'
import type { SocialPlatform } from '@/types/connections'
import type {
  PlatformConfigurations,
  InstagramConfig,
  TikTokConfig,
  YouTubeConfig,
  PinterestConfig,
} from '@/types/posts'

interface Step1MediaProps {
  // Media
  media: FileUploadState[]
  onMediaUpload: (files: FileList) => void
  onMediaRemove: (id: string) => void
  onMediaRetry?: (id: string) => void
  onAddLibraryMedia?: (media: MediaItem) => void
  isUploading?: boolean

  // Caption
  caption: string
  onCaptionChange: (caption: string) => void

  // Account selection
  availableAccounts: MediaPlatformWithValidation[]
  selectedAccountIds: string[]
  onToggleAccount: (id: string) => void
  validations?: MediaFlowValidationWarning[]
  unconnectedPlatforms?: SocialPlatform[]
  onConnectPlatform?: (platform: SocialPlatform) => void

  // Platform configurations
  platformConfigs: PlatformConfigurations
  onInstagramConfigChange: (config: Partial<InstagramConfig>) => void
  onTikTokConfigChange: (config: Partial<TikTokConfig>) => void
  onYouTubeConfigChange: (config: Partial<YouTubeConfig>) => void
  onPinterestConfigChange: (config: Partial<PinterestConfig>) => void
  /** Callback for TikTok config validation state changes */
  onTikTokValidationChange?: (isValid: boolean, errors: string[]) => void

  // Library panel data
  recentMedia?: MediaItem[]
  isLoadingRecentMedia?: boolean
  recentDrafts?: PostResponse[]
  isLoadingDrafts?: boolean
  onSelectDraft?: (draft: PostResponse) => void
  onOpenMediaLibrary: () => void

  // Scheduling
  scheduleType: MediaFlowScheduleType
  onScheduleTypeChange: (type: MediaFlowScheduleType) => void
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

export function Step1Media({
  media,
  onMediaUpload,
  onMediaRemove,
  onMediaRetry,
  onAddLibraryMedia,
  isUploading,
  caption,
  onCaptionChange,
  availableAccounts,
  selectedAccountIds,
  onToggleAccount,
  validations = [],
  unconnectedPlatforms = [],
  onConnectPlatform,
  platformConfigs,
  onInstagramConfigChange,
  onTikTokConfigChange,
  onYouTubeConfigChange,
  onPinterestConfigChange,
  onTikTokValidationChange,
  recentMedia = [],
  isLoadingRecentMedia,
  recentDrafts = [],
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
}: Step1MediaProps) {
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

  // Create a map of account IDs to platform types for CaptionInput
  const platformsMap = useMemo(
    () => new Map(availableAccounts.map((a) => [a.id, a.platform])),
    [availableAccounts]
  )

  // Handle drag and drop on the main composer area
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

  return (
    <motion.div {...stepAnimation} className={cn('flex h-full w-full gap-5', className)}>
      {/* LEFT: Composer */}
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        {/* Account Selector - fixed height */}
        <MediaAccountSelector
          accounts={availableAccounts}
          selectedIds={selectedAccountIds}
          onToggle={onToggleAccount}
          validations={validations}
          onOpenPreview={() => setPreviewOpen(true)}
          onOpenLibrary={onOpenMediaLibrary}
          unconnectedPlatforms={unconnectedPlatforms}
          onConnectPlatform={onConnectPlatform}
          className="shrink-0"
        />

        {/* Composer card - grows to fill space */}
        <div
          className="border-border bg-bg-elevated flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {/* Main content area - two-column when platforms selected */}
          <div
            className={cn(
              'flex min-h-0 flex-1',
              selectedAccountIds.length > 0 ? 'flex-col md:flex-row' : 'flex-col'
            )}
          >
            {/* Left: Media area - always visible */}
            <div
              className={cn(
                'flex min-h-0 flex-col',
                selectedAccountIds.length > 0
                  ? 'md:border-border min-h-[200px] md:min-h-0 md:w-1/2 md:border-r'
                  : 'flex-1'
              )}
            >
              {media.length === 0 ? (
                <MediaDropZone
                  onUpload={onMediaUpload}
                  onOpenLibrary={onOpenMediaLibrary}
                  disabled={isUploading}
                  className="m-4 flex-1"
                />
              ) : (
                <div className="flex-1 overflow-auto p-4">
                  <MediaPreviewGrid
                    media={media}
                    onRemove={onMediaRemove}
                    onRetry={onMediaRetry}
                    variant="default"
                    maxVisible={10}
                  />
                </div>
              )}
            </div>

            {/* Right: Platform settings - scrollable */}
            {selectedAccountIds.length > 0 && (
              <div className="border-border flex min-h-0 flex-col border-t md:w-1/2 md:border-t-0">
                <div className="flex-1 overflow-y-auto">
                  <PlatformConfigAccordion
                    selectedPlatforms={selectedPlatforms}
                    media={media}
                    platformConfigs={platformConfigs}
                    onInstagramConfigChange={onInstagramConfigChange}
                    onTikTokConfigChange={onTikTokConfigChange}
                    onYouTubeConfigChange={onYouTubeConfigChange}
                    onPinterestConfigChange={onPinterestConfigChange}
                    onTikTokValidationChange={onTikTokValidationChange}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Caption input - SECONDARY, compact */}
          <div className="border-border shrink-0 border-t p-4">
            <CaptionInput
              value={caption}
              onChange={onCaptionChange}
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
        <div className="text-text-muted flex shrink-0 flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs">
          <span className="hidden sm:inline">
            {t('dashboard.create.media.shortcuts.dragFiles')}
          </span>
          <span className="hidden sm:inline">
            <kbd className="bg-bg-elevated rounded px-1.5 py-0.5 font-mono text-[11px]">
              {modKey}
            </kbd>
            <span className="mx-0.5">+</span>
            <kbd className="bg-bg-elevated rounded px-1.5 py-0.5 font-mono text-[11px]">S</kbd>
            <span className="ml-1">{t('dashboard.create.media.shortcuts.saveDraft')}</span>
          </span>
        </div>
      </div>

      {/* RIGHT: Preview Panel (desktop only) */}
      <div className="hidden w-[380px] shrink-0 lg:block">
        <MediaPreviewPanel
          caption={caption}
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
        content={caption}
        media={media}
        selectedPlatforms={selectedPlatforms.map((p) => ({
          ...p,
          // Map to PlatformWithValidation structure expected by PreviewModal
          isValid: p.isValid,
        }))}
      />
    </motion.div>
  )
}
