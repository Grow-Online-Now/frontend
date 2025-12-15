/**
 * CreateTextPostPage
 * Text-first post creation flow with 3 progressive steps
 */

import { useEffect, useCallback, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { CreateFlowTopBar } from '@/components/create/shared'
import { Step1Write, Step2Platforms, Step3Schedule, PreviewPanel } from '@/components/create/text'
import { useTextFlow } from '@/hooks/create/useTextFlow'
import { Skeleton } from '@/components/ui/skeleton'

export default function CreateTextPostPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { lang } = useParams<{ lang: string }>()

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
            <Step1Write
              key="step1"
              content={content}
              onContentChange={setContent}
              media={media.uploadsArray}
              onMediaUpload={handleMediaUpload}
              onMediaRemove={media.removeFile}
              onMediaRetry={media.retryUpload}
              onContinue={goNext}
              canContinue={canContinue}
            />
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
      </main>
    </div>
  )
}
