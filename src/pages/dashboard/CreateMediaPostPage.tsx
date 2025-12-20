/**
 * CreateMediaPostPage
 * Media-first post creation for Instagram, TikTok, YouTube, and Pinterest
 * Media is required - caption is secondary
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { UserPlus } from 'lucide-react'
import { PageHeader } from '@/components/dashboard/shared/PageHeader'
import { EmptyState } from '@/components/dashboard/shared/EmptyState'
import { Step1Media } from '@/components/create/media'
import { MediaLibraryModal } from '@/components/create/text'
import { PostingProgressModal } from '@/components/dashboard/create-post/PostingProgressModal'
import { useMediaFlow } from '@/hooks/create/useMediaFlow'
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

export default function CreateMediaPostPage() {
  useTranslation() // Initialize i18n
  const navigate = useNavigate()
  const location = useLocation()
  const { lang } = useParams<{ lang: string }>()
  const localizedHref = useLocalizedHref()
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false)

  const {
    canSubmit,
    caption,
    setCaption,
    media,
    availablePlatforms,
    selectedPlatformIds,
    togglePlatform,
    validations,
    platformConfigs,
    updateInstagramConfig,
    updateTikTokConfig,
    updateYouTubeConfig,
    updatePinterestConfig,
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
    hasMediaFirstAccounts,
    unconnectedPlatforms,
    connectPlatform,
    // Progress modal state
    showProgressModal,
    setShowProgressModal,
    platformPosts,
    createdPost,
    resetFlow,
  } = useMediaFlow()

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
        if (canSubmit && !isSubmitting) {
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
  }, [canSubmit, isSubmitting, submitPost, saveDraft, isSavingDraft, navigate, lang])

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
          titleKey="dashboard.create.media.title"
          descriptionKey="dashboard.create.media.description"
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

  // No media-first accounts - show empty state
  if (!hasMediaFirstAccounts) {
    return (
      <div className="flex h-full flex-col">
        <PageHeader
          titleKey="dashboard.create.media.title"
          descriptionKey="dashboard.create.media.description"
        />
        <EmptyState
          icon={<UserPlus className="h-6 w-6" />}
          titleKey="dashboard.create.media.empty.title"
          descriptionKey="dashboard.create.media.empty.description"
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
        titleKey="dashboard.create.media.title"
        descriptionKey="dashboard.create.media.description"
      />

      {/* Main content */}
      <div className="mt-6 flex min-h-0 flex-1">
        <Step1Media
          // Media props
          media={media.uploadsArray}
          onMediaUpload={handleMediaUpload}
          onMediaRemove={media.removeFile}
          onMediaRetry={media.retryUpload}
          onAddLibraryMedia={handleAddLibraryMedia}
          isUploading={media.isUploading}
          // Caption props
          caption={caption}
          onCaptionChange={setCaption}
          // Account props
          availableAccounts={availablePlatforms}
          selectedAccountIds={selectedPlatformIds}
          onToggleAccount={togglePlatform}
          validations={validations}
          unconnectedPlatforms={unconnectedPlatforms}
          onConnectPlatform={connectPlatform}
          // Platform config props
          platformConfigs={platformConfigs}
          onInstagramConfigChange={updateInstagramConfig}
          onTikTokConfigChange={updateTikTokConfig}
          onYouTubeConfigChange={updateYouTubeConfig}
          onPinterestConfigChange={updatePinterestConfig}
          // Library props
          recentMedia={filteredRecentMedia}
          isLoadingRecentMedia={isLoadingMedia}
          recentDrafts={recentDrafts}
          isLoadingDrafts={isLoadingDrafts}
          onSelectDraft={loadDraft}
          onOpenMediaLibrary={() => setIsMediaLibraryOpen(true)}
          // Schedule props
          scheduleType={scheduleType}
          onScheduleTypeChange={setScheduleType}
          scheduledDate={scheduledDate}
          onScheduledDateChange={setScheduledDate}
          // Submit props
          onSubmit={submitPost}
          isSubmitting={isSubmitting}
          canSubmit={canSubmit}
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
