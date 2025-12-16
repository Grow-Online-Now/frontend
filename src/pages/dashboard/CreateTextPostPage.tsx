/**
 * CreateTextPostPage
 * Text-first post creation flow with 2 progressive steps
 * Step 1: Write content + Select accounts
 * Step 2: Schedule & Publish
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { CreateFlowTopBar } from '@/components/create/shared'
import { Step1Write, Step3Schedule, MediaLibraryModal } from '@/components/create/text'
import { useTextFlow } from '@/hooks/create/useTextFlow'
import { useMediaLibrary } from '@/hooks/useMediaLibrary'
import { usePosts } from '@/hooks/usePosts'
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
    loadDraft,
    isLoadingConnections,
    hasTextFirstAccounts,
  } = useTextFlow()

  // Fetch recent media for the sidebar
  const { media: recentMedia, isLoading: isLoadingMedia } = useMediaLibrary({ limit: 10 })

  // Fetch recent drafts for the library panel
  const { posts: recentDrafts, isLoading: isLoadingDrafts } = usePosts({
    is_draft: true,
    limit: 3,
    sort: 'created_at',
    order: 'desc',
  })

  // Get IDs of media already added to the post
  const addedMediaIds = useMemo(
    () => media.uploadsArray.map((u) => u.mediaId).filter(Boolean) as string[],
    [media.uploadsArray]
  )

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + Enter: Publish (only on Step 2)
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        if (currentStep === 2 && canContinue && !isSubmitting) {
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

  // Compute selected platforms for Step 2 summary
  const selectedPlatforms = useMemo(
    () => availablePlatforms.filter((p) => selectedPlatformIds.includes(p.id)),
    [availablePlatforms, selectedPlatformIds]
  )

  // Filter recent media to exclude already added
  const filteredRecentMedia = useMemo(
    () => recentMedia.filter((m) => !addedMediaIds.includes(m.id)),
    [recentMedia, addedMediaIds]
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
    <div className="flex h-full flex-col overflow-hidden">
      {/* Top bar - now with 2 steps */}
      <CreateFlowTopBar
        onBack={handleBack}
        titleKey="dashboard.create.text.title"
        currentStep={currentStep}
        totalSteps={2}
        showContinue={currentStep < 2}
        canContinue={canContinue}
        onContinue={goNext}
      />

      {/* Main content - fills available space, no page scroll */}
      <main className="flex min-h-0 flex-1 px-5 py-4">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="flex h-full w-full"
            >
              <Step1Write
                content={content}
                onContentChange={setContent}
                media={media.uploadsArray}
                onMediaUpload={handleMediaUpload}
                onMediaRemove={media.removeFile}
                onMediaRetry={media.retryUpload}
                onAddLibraryMedia={handleAddLibraryMedia}
                availableAccounts={availablePlatforms}
                selectedAccountIds={selectedPlatformIds}
                onToggleAccount={togglePlatform}
                validations={validations}
                recentMedia={filteredRecentMedia}
                isLoadingRecentMedia={isLoadingMedia}
                recentDrafts={recentDrafts}
                isLoadingDrafts={isLoadingDrafts}
                onSelectDraft={loadDraft}
                onOpenMediaLibrary={() => setIsMediaLibraryOpen(true)}
                onContinue={goNext}
                canContinue={canContinue}
              />
            </motion.div>
          )}

          {currentStep === 2 && (
            <Step3Schedule
              key="step2"
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
