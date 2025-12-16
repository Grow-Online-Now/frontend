/**
 * CreateTextPostPage
 * Text-first post creation flow with 3 progressive steps
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { CreateFlowTopBar } from '@/components/create/shared'
import {
  Step1Write,
  Step2Platforms,
  Step3Schedule,
  PreviewPanel,
  RecentMediaPanel,
  MediaLibraryModal,
} from '@/components/create/text'
import { useTextFlow } from '@/hooks/create/useTextFlow'
import { useMediaLibrary } from '@/hooks/useMediaLibrary'
import { Skeleton } from '@/components/ui/skeleton'
import type { MediaItem } from '@/types/media'

export default function CreateTextPostPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { lang } = useParams<{ lang: string }>()
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false)

  const {
    currentStep,
    canContinue,
    goNext,
    goBack,
    content,
    setContent,
    media,
    availablePlatforms,
    selectedPlatformIds,
    togglePlatform,
    validations,
    scheduleType,
    setScheduleType,
    scheduledDate,
    setScheduledDate,
    isSubmitting,
    submitPost,
    saveDraft,
    isSavingDraft,
    isLoadingConnections,
    hasTextFirstAccounts,
  } = useTextFlow()

  // Fetch recent media for the sidebar
  const { media: recentMedia, isLoading: isLoadingMedia } = useMediaLibrary({ limit: 10 })

  // Get IDs of media already added to the post
  const addedMediaIds = useMemo(
    () => media.uploadsArray.map((u) => u.mediaId).filter(Boolean) as string[],
    [media.uploadsArray]
  )

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + Enter: Publish (only on Step 3)
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        if (currentStep === 3 && canContinue && !isSubmitting) {
          e.preventDefault()
          submitPost()
        }
      }

      // Cmd/Ctrl + S: Save draft
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault()
        e.stopPropagation()
        if (!isSavingDraft) {
          saveDraft()
        }
      }

      // Escape: Go back
      if (e.key === 'Escape') {
        e.preventDefault()
        goBack()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentStep, canContinue, isSubmitting, submitPost, saveDraft, isSavingDraft, goBack])

  // Handle back navigation
  const handleBack = useCallback(() => {
    if (currentStep === 1) {
      navigate(`/${lang}/dashboard/posts`)
    } else {
      goBack()
    }
  }, [currentStep, navigate, lang, goBack])

  // Handle media upload from hook
  const handleMediaUpload = useCallback(
    (files: FileList) => {
      media.addFiles(Array.from(files))
    },
    [media]
  )

  // Handle adding media from library (single item)
  const handleAddLibraryMedia = useCallback(
    (item: MediaItem) => {
      media.addPreloadedMedia(item)
    },
    [media]
  )

  // Handle adding multiple media from library modal
  const handleSelectLibraryMedia = useCallback(
    (items: MediaItem[]) => {
      items.forEach((item) => media.addPreloadedMedia(item))
    },
    [media]
  )

  // Compute selected platforms for Step 3 summary
  const selectedPlatforms = useMemo(
    () => availablePlatforms.filter((p) => selectedPlatformIds.includes(p.id)),
    [availablePlatforms, selectedPlatformIds]
  )

  // Loading state
  if (isLoadingConnections) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-12 w-full" />
        <div className="mx-auto max-w-[560px] space-y-4">
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    )
  }

  // No text-first accounts - redirect to accounts page
  if (!hasTextFirstAccounts) {
    return (
      <div className="flex min-h-full flex-col">
        <CreateFlowTopBar
          onBack={handleBack}
          titleKey="dashboard.create.text.title"
          showContinue={false}
        />
        <main className="flex flex-1 items-center justify-center px-4 py-8">
          <div className="text-center">
            <h2 className="text-foreground text-lg font-semibold">
              {t('dashboard.create.text.step2.empty.title')}
            </h2>
            <p className="text-muted-foreground mt-2 text-sm">
              {t('dashboard.create.text.step2.empty.description')}
            </p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-full flex-col">
      {/* Top bar */}
      <CreateFlowTopBar
        onBack={handleBack}
        titleKey="dashboard.create.text.title"
        currentStep={currentStep}
        showContinue={currentStep < 3}
        canContinue={canContinue}
        onContinue={goNext}
      />

      {/* Main content */}
      <main className="flex-1 px-4 py-8">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="flex items-start justify-center gap-8"
            >
              {/* Left spacer for centering on desktop */}
              <div className="hidden w-[260px] shrink-0 lg:block" />

              {/* Composer */}
              <Step1Write
                content={content}
                onContentChange={setContent}
                media={media.uploadsArray}
                onMediaUpload={handleMediaUpload}
                onMediaRemove={media.removeFile}
                onMediaRetry={media.retryUpload}
                onAddLibraryMedia={handleAddLibraryMedia}
                onContinue={goNext}
                canContinue={canContinue}
                className="mx-auto lg:mx-0"
              />

              {/* Recent media sidebar - desktop only */}
              <div className="sticky top-8 hidden w-[260px] shrink-0 lg:block">
                <RecentMediaPanel
                  media={recentMedia.filter((m) => !addedMediaIds.includes(m.id))}
                  isLoading={isLoadingMedia}
                  onAddMedia={handleAddLibraryMedia}
                  onOpenLibrary={() => setIsMediaLibraryOpen(true)}
                />
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <div key="step2" className="flex items-start justify-center gap-8">
              <Step2Platforms
                content={content}
                platforms={availablePlatforms}
                selectedIds={selectedPlatformIds}
                onToggle={togglePlatform}
                validations={validations}
              />
              {/* Preview panel - desktop only */}
              <div className="sticky top-8 hidden lg:block">
                <PreviewPanel content={content} selectedPlatforms={selectedPlatforms} />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <Step3Schedule
              key="step3"
              content={content}
              selectedPlatforms={selectedPlatforms}
              scheduleType={scheduleType}
              onScheduleTypeChange={setScheduleType}
              scheduledDate={scheduledDate}
              onScheduledDateChange={setScheduledDate}
              isSubmitting={isSubmitting}
              onSubmit={submitPost}
            />
          )}
        </AnimatePresence>

        {/* Media library modal */}
        <MediaLibraryModal
          open={isMediaLibraryOpen}
          onOpenChange={setIsMediaLibraryOpen}
          onSelect={handleSelectLibraryMedia}
          excludeIds={addedMediaIds}
        />
      </main>
    </div>
  )
}
