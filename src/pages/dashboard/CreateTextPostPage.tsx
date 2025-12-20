/**
 * CreateTextPostPage
 * Single-page text post creation with compose, preview, and publish
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { UserPlus } from 'lucide-react'
import { PageHeader } from '@/components/dashboard/shared/PageHeader'
import { EmptyState } from '@/components/dashboard/shared/EmptyState'
import { Step1Write, MediaLibraryModal } from '@/components/create/text'
import { PostingProgressModal } from '@/components/dashboard/create-post/PostingProgressModal'
import { useTextFlow } from '@/hooks/create/useTextFlow'
import { useMediaLibrary } from '@/hooks/useMediaLibrary'
import { usePosts } from '@/hooks/usePosts'
import { useLocalizedHref } from '@/hooks/useLocalizedHref'
import { Skeleton } from '@/components/ui/skeleton'
import type { MediaItem } from '@/types/media'
import type { PostResponse } from '@/types/posts'

interface LocationState {
  preselectedMedia?: MediaItem
  editPost?: PostResponse
}

export default function CreateTextPostPage() {
  useTranslation() // Initialize i18n
  const navigate = useNavigate()
  const location = useLocation()
  const { lang } = useParams<{ lang: string }>()
  const localizedHref = useLocalizedHref()
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false)

  const {
    canContinue,
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
    unconnectedPlatforms,
    connectPlatform,
    // Progress modal state
    showProgressModal,
    setShowProgressModal,
    platformPosts,
    createdPost,
    resetFlow,
  } = useTextFlow()

  // Get selected accounts for the modal
  const selectedAccounts = useMemo(
    () => availablePlatforms.filter((p) => selectedPlatformIds.includes(p.id)),
    [availablePlatforms, selectedPlatformIds]
  )

  // Modal navigation handlers
  const handleViewCalendar = useCallback(() => {
    setShowProgressModal(false)
    navigate(`/${lang}/dashboard/scheduler`)
  }, [navigate, lang, setShowProgressModal])

  const handleViewPosts = useCallback(() => {
    setShowProgressModal(false)
    navigate(`/${lang}/dashboard/posts`)
  }, [navigate, lang, setShowProgressModal])

  const handleCreateAnother = useCallback(() => {
    setShowProgressModal(false)
    resetFlow()
  }, [setShowProgressModal, resetFlow])

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

  // Handle navigation state (preselected media or editing a post)
  const hasProcessedLocationState = useRef(false)
  useEffect(() => {
    const state = location.state as LocationState | null
    if (hasProcessedLocationState.current) return

    if (state?.preselectedMedia) {
      hasProcessedLocationState.current = true
      media.addPreloadedMedia(state.preselectedMedia)
      // Clear the state to prevent re-adding on navigation
      navigate(location.pathname, { replace: true, state: {} })
    } else if (state?.editPost) {
      hasProcessedLocationState.current = true
      loadDraft(state.editPost)
      // Clear the state to prevent re-loading on navigation
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + Enter: Submit post
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        if (canContinue && !isSubmitting) {
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

      // Escape: Go back to posts
      if (e.key === 'Escape') {
        e.preventDefault()
        navigate(`/${lang}/dashboard/posts`)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [canContinue, isSubmitting, submitPost, saveDraft, isSavingDraft, navigate, lang])

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

  // Filter recent media to exclude already added
  const filteredRecentMedia = useMemo(
    () => recentMedia.filter((m) => !addedMediaIds.includes(m.id)),
    [recentMedia, addedMediaIds]
  )

  // Loading state
  if (isLoadingConnections) {
    return (
      <div className="flex h-full flex-col">
        <PageHeader
          titleKey="dashboard.create.text.title"
          descriptionKey="dashboard.create.text.description"
        />
        <div className="mt-6 flex flex-1 gap-5">
          <div className="flex flex-1 flex-col gap-4">
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-[400px] w-full rounded-2xl" />
          </div>
          <Skeleton className="hidden h-[500px] w-[380px] rounded-2xl lg:block" />
        </div>
      </div>
    )
  }

  // No text-first accounts - show empty state
  if (!hasTextFirstAccounts) {
    return (
      <div className="flex h-full flex-col">
        <PageHeader
          titleKey="dashboard.create.text.title"
          descriptionKey="dashboard.create.text.description"
        />
        <EmptyState
          icon={<UserPlus className="h-6 w-6" />}
          titleKey="dashboard.create.text.step2.empty.title"
          descriptionKey="dashboard.create.text.step2.empty.description"
          ctaKey="dashboard.accounts.connect"
          onCtaClick={() => navigate(localizedHref('/dashboard/accounts'))}
          className="mt-6"
        />
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        titleKey="dashboard.create.text.title"
        descriptionKey="dashboard.create.text.description"
      />

      {/* Main content */}
      <div className="mt-6 flex min-h-0 flex-1">
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
          unconnectedPlatforms={unconnectedPlatforms}
          onConnectPlatform={connectPlatform}
          recentMedia={filteredRecentMedia}
          isLoadingRecentMedia={isLoadingMedia}
          recentDrafts={recentDrafts}
          isLoadingDrafts={isLoadingDrafts}
          onSelectDraft={loadDraft}
          onOpenMediaLibrary={() => setIsMediaLibraryOpen(true)}
          scheduleType={scheduleType}
          onScheduleTypeChange={setScheduleType}
          scheduledDate={scheduledDate}
          onScheduledDateChange={setScheduledDate}
          onSubmit={submitPost}
          isSubmitting={isSubmitting}
          canSubmit={canContinue}
        />
      </div>

      {/* Media library modal */}
      <MediaLibraryModal
        open={isMediaLibraryOpen}
        onOpenChange={setIsMediaLibraryOpen}
        onSelect={handleSelectLibraryMedia}
        excludeIds={addedMediaIds}
      />

      {/* Posting progress modal */}
      <PostingProgressModal
        isOpen={showProgressModal}
        onClose={() => setShowProgressModal(false)}
        postId={createdPost?.id ?? null}
        selectedAccounts={selectedAccounts}
        platformPosts={platformPosts}
        overallStatus={createdPost?.status ?? 'pending'}
        scheduleType={scheduleType === 'scheduled' ? 'scheduled' : 'now'}
        scheduledAt={scheduledDate}
        onViewCalendar={handleViewCalendar}
        onViewPosts={handleViewPosts}
        onCreateAnother={handleCreateAnother}
      />
    </div>
  )
}
