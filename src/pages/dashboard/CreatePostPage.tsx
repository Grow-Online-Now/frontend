/**
 * CreatePostPage
 * Redesigned three-column layout for creating social media posts
 */

import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Users } from 'lucide-react'

import { PageHeader } from '@/components/dashboard/shared/PageHeader'
import { EmptyState } from '@/components/dashboard/shared/EmptyState'
import {
  PlatformSelector,
  ScheduleOptions,
  MediaUploader,
  CaptionEditor,
  PlatformHints,
  PostPreview,
  PostButton,
  PlatformConfigPanel,
  PostingProgressModal,
  TwitterThreadBuilder,
  TwitterFirstComment,
  type MediaFile,
} from '@/components/dashboard/create-post'

import { useConnections } from '@/hooks/useConnections'
import { useCreatePost } from '@/hooks/useCreatePost'
import { useMediaUpload } from '@/hooks/useMediaUpload'
import { useThreadMediaUpload } from '@/hooks/useThreadMediaUpload'
import type {
  CreatePostRequest,
  ScheduleType,
  PlatformConfigurations,
  TwitterThreadTweet,
  TwitterFirstComment as TwitterFirstCommentType,
} from '@/types/posts'
import type { SocialPlatform } from '@/types/connections'
import type { MediaItem } from '@/types/media'

// Location state type for pre-selected media
interface LocationState {
  preselectedMedia?: MediaItem
}

// Platforms that require media
const MEDIA_REQUIRED_PLATFORMS: SocialPlatform[] = ['instagram', 'tiktok', 'youtube', 'pinterest']

export default function CreatePostPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { lang = 'en' } = useParams<{ lang: string }>()

  // Track if we've handled preselected media
  const preselectedMediaHandledRef = useRef(false)

  // Hooks
  const { connections, isLoading: connectionsLoading } = useConnections()
  const {
    submitPost,
    isLoading: isSubmitting,
    createdPost,
    platformPosts,
    showProgressModal,
    setShowProgressModal,
    startPolling,
  } = useCreatePost()
  const {
    uploadsArray,
    addFiles,
    addPreloadedMedia,
    removeFile,
    retryUpload,
    cancelUpload,
    getMediaIds,
    isUploading,
    hasErrors,
  } = useMediaUpload()

  // Handle pre-selected media from navigation (e.g., from Media Library)
  useEffect(() => {
    const state = location.state as LocationState | null
    if (state?.preselectedMedia && !preselectedMediaHandledRef.current) {
      preselectedMediaHandledRef.current = true
      addPreloadedMedia(state.preselectedMedia)
      // Clear the location state to prevent re-adding on re-renders
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [location, addPreloadedMedia, navigate])

  // Thread media uploads (for Twitter threads and first comment)
  const threadMediaUpload = useThreadMediaUpload()
  const firstCommentMediaUpload = useThreadMediaUpload()

  // Form state
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([])
  const [caption, setCaption] = useState('')
  const [scheduleType, setScheduleType] = useState<ScheduleType>('now')
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>()
  const [scheduledTime, setScheduledTime] = useState('12:00')
  const [previewPlatform, setPreviewPlatform] = useState<SocialPlatform>('instagram')
  const [platformConfigs, setPlatformConfigs] = useState<PlatformConfigurations>({})

  // YouTube thumbnail state
  const [youtubeThumbnailPreviewUrl, setYoutubeThumbnailPreviewUrl] = useState<string | null>(null)
  const [isUploadingYoutubeThumbnail, setIsUploadingYoutubeThumbnail] = useState(false)

  // Twitter thread state
  const [twitterThread, setTwitterThread] = useState<TwitterThreadTweet[]>([])
  const [firstCommentEnabled, setFirstCommentEnabled] = useState(false)
  const [firstComment, setFirstComment] = useState<TwitterFirstCommentType | null>(null)

  // First comment context ID (constant)
  const FIRST_COMMENT_CONTEXT_ID = 'first-comment'

  // Map upload state to MediaFile format for components
  const media: MediaFile[] = useMemo(
    () =>
      uploadsArray.map((u) => ({
        id: u.id,
        file: u.file,
        url: u.localUrl,
        type: u.type,
        uploadStatus: u.status,
        uploadProgress: u.progress.percentage,
        uploadError: u.error,
        mediaId: u.mediaId,
        remoteUrl: u.mediaItem?.url ?? null,
      })),
    [uploadsArray]
  )

  // Derived state
  const selectedAccounts = useMemo(
    () => connections.filter((c) => selectedAccountIds.includes(c.id)),
    [connections, selectedAccountIds]
  )

  const selectedPlatforms = useMemo(
    (): SocialPlatform[] => selectedAccounts.map((c) => c.platform),
    [selectedAccounts]
  )

  // Update preview platform when selection changes
  const availablePlatformsForPreview = useMemo(() => {
    const unique = [...new Set(selectedPlatforms)]
    if (unique.length > 0 && !unique.includes(previewPlatform)) {
      setPreviewPlatform(unique[0])
    }
    return unique.length > 0 ? unique : ['instagram' as SocialPlatform]
  }, [selectedPlatforms, previewPlatform])

  // Check if media is required for any selected platform
  const isMediaRequired = useMemo(
    () => selectedPlatforms.some((p) => MEDIA_REQUIRED_PLATFORMS.includes(p)),
    [selectedPlatforms]
  )

  // Check if Twitter is selected
  const hasTwitter = useMemo(() => selectedPlatforms.includes('twitter'), [selectedPlatforms])

  // Reset Twitter state when Twitter is deselected
  useEffect(() => {
    if (!hasTwitter) {
      setTwitterThread([])
      setFirstCommentEnabled(false)
      setFirstComment(null)
      threadMediaUpload.reset()
      firstCommentMediaUpload.reset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Only trigger when hasTwitter changes, not on every hook reference change
  }, [hasTwitter])

  // Twitter thread validation
  const twitterThreadValidation = useMemo(() => {
    if (!hasTwitter) return { valid: true, errors: [] as string[] }

    const errors: string[] = []

    // Validate thread tweets
    twitterThread.forEach((tweet) => {
      if (tweet.text.length === 0) {
        errors.push(t('dashboard.createPost.twitter.thread.validation.textRequired'))
      }
      if (tweet.text.length > 280) {
        errors.push(t('dashboard.createPost.twitter.thread.validation.tooLong'))
      }
    })

    // Validate first comment if enabled
    if (firstCommentEnabled) {
      if (!firstComment?.text || firstComment.text.length === 0) {
        errors.push(t('dashboard.createPost.twitter.firstComment.validation.textRequired'))
      }
      if (firstComment && firstComment.text.length > 280) {
        errors.push(t('dashboard.createPost.twitter.firstComment.validation.tooLong'))
      }
    }

    return { valid: errors.length === 0, errors }
  }, [hasTwitter, twitterThread, firstCommentEnabled, firstComment, t])

  // Platform validations
  const validations = useMemo(() => {
    return selectedPlatforms.map((platform) => {
      // Check media requirement
      if (MEDIA_REQUIRED_PLATFORMS.includes(platform) && media.length === 0) {
        return {
          platform,
          status: 'error' as const,
          message: t('dashboard.createPost.hints.mediaRequired', {
            platforms: t(`dashboard.accounts.platforms.${platform}`),
          }),
        }
      }

      // Check Twitter thread validation
      if (platform === 'twitter' && !twitterThreadValidation.valid) {
        return {
          platform,
          status: 'error' as const,
          message: twitterThreadValidation.errors[0],
        }
      }

      return { platform, status: 'ready' as const }
    })
  }, [selectedPlatforms, media, t, twitterThreadValidation])

  // Handle media upload
  const handleMediaUpload = useCallback(
    (files: FileList) => {
      addFiles(files)
    },
    [addFiles]
  )

  // Handle media remove
  const handleMediaRemove = useCallback(
    (id: string) => {
      removeFile(id)
    },
    [removeFile]
  )

  // Handle retry
  const handleRetry = useCallback(
    (id: string) => {
      retryUpload(id)
    },
    [retryUpload]
  )

  // Handle cancel upload
  const handleCancelUpload = useCallback(
    (id: string) => {
      cancelUpload(id)
    },
    [cancelUpload]
  )

  // Handle YouTube thumbnail upload
  const handleYoutubeThumbnailUpload = useCallback(
    async (file: File): Promise<string | null> => {
      setIsUploadingYoutubeThumbnail(true)

      // Create preview URL immediately
      const previewUrl = URL.createObjectURL(file)
      setYoutubeThumbnailPreviewUrl(previewUrl)

      // Add the file to upload queue
      const uploadIds = addFiles([file])
      const uploadId = uploadIds[0]

      // Wait for upload to complete by polling
      return new Promise((resolve) => {
        const checkUpload = () => {
          const upload = uploadsArray.find((u) => u.id === uploadId)

          if (!upload) {
            // Upload was removed or not found
            setIsUploadingYoutubeThumbnail(false)
            URL.revokeObjectURL(previewUrl)
            setYoutubeThumbnailPreviewUrl(null)
            resolve(null)
            return
          }

          if (upload.status === 'ready' && upload.mediaId) {
            // Upload completed successfully
            setIsUploadingYoutubeThumbnail(false)
            resolve(upload.mediaId)
            return
          }

          if (upload.status === 'error') {
            // Upload failed
            setIsUploadingYoutubeThumbnail(false)
            URL.revokeObjectURL(previewUrl)
            setYoutubeThumbnailPreviewUrl(null)
            resolve(null)
            return
          }

          // Still uploading, check again
          setTimeout(checkUpload, 100)
        }

        // Start checking after a brief delay to allow state to update
        setTimeout(checkUpload, 100)
      })
    },
    [addFiles, uploadsArray]
  )

  // Handle form submission
  const handleSubmit = async () => {
    // Validation
    if (selectedAccountIds.length === 0) {
      toast.error(t('dashboard.createPost.validation.accountsRequired'))
      return
    }

    if (!caption.trim() && media.length === 0) {
      toast.error(t('dashboard.createPost.validation.captionRequired'))
      return
    }

    if (isMediaRequired && media.length === 0) {
      toast.error(
        t('dashboard.createPost.hints.mediaRequired', {
          platforms: selectedPlatforms
            .filter((p) => MEDIA_REQUIRED_PLATFORMS.includes(p))
            .map((p) => t(`dashboard.accounts.platforms.${p}`))
            .join(', '),
        })
      )
      return
    }

    // Check if uploads are still in progress
    if (isUploading) {
      toast.error(t('dashboard.createPost.media.validation.uploadsInProgress'))
      return
    }

    // Check if there are failed uploads
    if (hasErrors) {
      toast.error(t('dashboard.createPost.media.validation.uploadsFailed'))
      return
    }

    // Check if thread media uploads are in progress
    if (threadMediaUpload.isAnyUploading || firstCommentMediaUpload.isAnyUploading) {
      toast.error(t('dashboard.createPost.media.validation.uploadsInProgress'))
      return
    }

    // Check if thread media has errors
    if (threadMediaUpload.hasAnyErrors || firstCommentMediaUpload.hasAnyErrors) {
      toast.error(t('dashboard.createPost.media.validation.uploadsFailed'))
      return
    }

    // Validate Twitter thread
    if (hasTwitter && !twitterThreadValidation.valid) {
      toast.error(twitterThreadValidation.errors[0])
      return
    }

    if (scheduleType === 'scheduled' && !scheduledDate) {
      toast.error(t('dashboard.createPost.validation.dateRequired'))
      return
    }

    // Build request
    const mediaIds = getMediaIds()

    // Build platform configurations including Twitter
    const finalPlatformConfigs: PlatformConfigurations = { ...platformConfigs }

    // Add Twitter config if applicable
    if (hasTwitter && (twitterThread.length > 0 || firstCommentEnabled)) {
      finalPlatformConfigs.twitter = {}

      // Add thread tweets with their media IDs
      if (twitterThread.length > 0) {
        finalPlatformConfigs.twitter.thread = twitterThread.map((tweet) => ({
          text: tweet.text,
          mediaIds: threadMediaUpload.getMediaIds(tweet.id),
        }))
      }

      // Add first comment with its media IDs
      if (firstCommentEnabled && firstComment) {
        finalPlatformConfigs.twitter.firstComment = {
          text: firstComment.text,
          mediaIds: firstCommentMediaUpload.getMediaIds(FIRST_COMMENT_CONTEXT_ID),
        }
      }
    }

    const request: CreatePostRequest = {
      caption,
      social_accounts: selectedAccountIds,
      is_draft: scheduleType === 'draft',
      ...(mediaIds.length > 0 && { media_ids: mediaIds }),
      platform_configurations: finalPlatformConfigs,
    }

    if (scheduleType === 'scheduled' && scheduledDate) {
      const [hours, minutes] = scheduledTime.split(':').map(Number)
      const scheduledDateTime = new Date(scheduledDate)
      scheduledDateTime.setHours(hours, minutes, 0, 0)
      request.scheduled_at = scheduledDateTime.toISOString()
    }

    const result = await submitPost(request)

    if (result) {
      // For drafts, navigate immediately
      if (scheduleType === 'draft') {
        toast.success(t('dashboard.createPost.success.draft'))
        navigate(`/${lang}/dashboard/posts`)
        return
      }

      // For scheduled posts, navigate to scheduler
      if (scheduleType === 'scheduled') {
        toast.success(t('dashboard.createPost.success.scheduled'))
        navigate(`/${lang}/dashboard/scheduler`)
        return
      }

      // For immediate posts, show progress modal and start polling
      if (scheduleType === 'now') {
        setShowProgressModal(true)
        startPolling(result.id)
      }
    }
  }

  // Determine if submit should be disabled
  const isSubmitDisabled = isSubmitting || isUploading || hasErrors

  // Show empty state if no accounts connected
  if (!connectionsLoading && connections.length === 0) {
    return (
      <div>
        <PageHeader
          titleKey="dashboard.createPost.title"
          descriptionKey="dashboard.createPost.description"
        />
        <EmptyState
          icon={<Users className="h-6 w-6" />}
          titleKey="dashboard.createPost.noAccounts.title"
          descriptionKey="dashboard.createPost.noAccounts.description"
          ctaKey="dashboard.createPost.noAccounts.cta"
          onCtaClick={() => navigate(`/${lang}/dashboard/accounts`)}
          className="mt-6"
        />
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        titleKey="dashboard.createPost.title"
        descriptionKey="dashboard.createPost.description"
        actions={
          <PostButton
            scheduleType={scheduleType}
            selectedAccounts={selectedAccounts}
            validations={validations}
            isSubmitting={isSubmitDisabled}
            onSubmit={handleSubmit}
          />
        }
      />

      {/* Main Content - 3 Column Grid */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[240px_1fr_320px]">
        {/* Left Column - Platforms & Schedule */}
        <aside className="flex flex-col gap-6">
          <div className="bg-card border-border-subtle rounded-xl border p-4">
            <PlatformSelector
              accounts={connections}
              selectedIds={selectedAccountIds}
              onChange={setSelectedAccountIds}
              isLoading={connectionsLoading}
            />
          </div>

          <div className="bg-card border-border-subtle rounded-xl border p-4">
            <ScheduleOptions
              scheduleType={scheduleType}
              onScheduleTypeChange={setScheduleType}
              scheduledDate={scheduledDate}
              onDateChange={setScheduledDate}
              scheduledTime={scheduledTime}
              onTimeChange={setScheduledTime}
            />
          </div>

          {/* Platform-specific configuration */}
          {(selectedPlatforms.includes('instagram') ||
            selectedPlatforms.includes('tiktok') ||
            selectedPlatforms.includes('youtube')) && (
            <div className="bg-card border-border-subtle rounded-xl border p-4">
              <PlatformConfigPanel
                selectedPlatforms={selectedPlatforms}
                media={media}
                platformConfigs={platformConfigs}
                onConfigChange={setPlatformConfigs}
                onYouTubeThumbnailUpload={handleYoutubeThumbnailUpload}
                youTubeThumbnailPreviewUrl={youtubeThumbnailPreviewUrl}
                isUploadingYouTubeThumbnail={isUploadingYoutubeThumbnail}
              />
            </div>
          )}
        </aside>

        {/* Center Column - Composer */}
        <div className="flex min-w-0 flex-col gap-4">
          <MediaUploader
            media={media}
            onUpload={handleMediaUpload}
            onRemove={handleMediaRemove}
            onRetry={handleRetry}
            onCancelUpload={handleCancelUpload}
            isMediaRequired={isMediaRequired}
          />

          <CaptionEditor
            value={caption}
            onChange={setCaption}
            selectedPlatforms={selectedPlatforms}
          />

          {/* Twitter Thread Builder - only show when Twitter is selected */}
          {hasTwitter && (
            <TwitterThreadBuilder
              thread={twitterThread}
              onThreadChange={setTwitterThread}
              mediaUpload={threadMediaUpload}
            />
          )}

          {/* Twitter First Comment - only show when Twitter is selected */}
          {hasTwitter && (
            <TwitterFirstComment
              enabled={firstCommentEnabled}
              onEnabledChange={setFirstCommentEnabled}
              comment={firstComment}
              onCommentChange={setFirstComment}
              uploads={firstCommentMediaUpload.getUploadsArray(FIRST_COMMENT_CONTEXT_ID)}
              onAddMedia={(files) =>
                firstCommentMediaUpload.addFilesToContext(FIRST_COMMENT_CONTEXT_ID, files)
              }
              onRemoveMedia={(uploadId) =>
                firstCommentMediaUpload.removeFileFromContext(FIRST_COMMENT_CONTEXT_ID, uploadId)
              }
              onRetryMedia={(uploadId) =>
                firstCommentMediaUpload.retryUpload(FIRST_COMMENT_CONTEXT_ID, uploadId)
              }
              canAddMoreMedia={firstCommentMediaUpload.canAddMore(FIRST_COMMENT_CONTEXT_ID)}
            />
          )}

          <PlatformHints selectedPlatforms={selectedPlatforms} media={media} caption={caption} />
        </div>

        {/* Right Column - Preview */}
        <aside className="hidden lg:block">
          <PostPreview
            selectedPlatform={previewPlatform}
            onPlatformChange={setPreviewPlatform}
            availablePlatforms={availablePlatformsForPreview}
            accounts={selectedAccounts}
            media={media}
            caption={caption}
            twitterThread={twitterThread}
            twitterFirstComment={firstComment}
          />
        </aside>
      </div>

      {/* Posting Progress Modal */}
      <PostingProgressModal
        isOpen={showProgressModal}
        onClose={() => {
          setShowProgressModal(false)
          navigate(`/${lang}/dashboard/posts`)
        }}
        postId={createdPost?.id || null}
        selectedAccounts={selectedAccounts}
        platformPosts={platformPosts}
        overallStatus={createdPost?.status || 'pending'}
      />
    </div>
  )
}
