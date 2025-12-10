/**
 * CreatePostPage
 * Redesigned three-column layout for creating social media posts
 */

import { useState, useMemo, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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
  type MediaFile,
} from '@/components/dashboard/create-post'

import { useConnections } from '@/hooks/useConnections'
import { useCreatePost } from '@/hooks/useCreatePost'
import { useMediaUpload } from '@/hooks/useMediaUpload'
import type { CreatePostRequest, ScheduleType, PlatformConfigurations } from '@/types/posts'
import type { SocialPlatform } from '@/types/connections'

// Platforms that require media
const MEDIA_REQUIRED_PLATFORMS: SocialPlatform[] = ['instagram', 'tiktok', 'youtube', 'pinterest']

export default function CreatePostPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { lang = 'en' } = useParams<{ lang: string }>()

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
    removeFile,
    retryUpload,
    cancelUpload,
    getMediaIds,
    isUploading,
    hasErrors,
  } = useMediaUpload()

  // Form state
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([])
  const [caption, setCaption] = useState('')
  const [scheduleType, setScheduleType] = useState<ScheduleType>('now')
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>()
  const [scheduledTime, setScheduledTime] = useState('12:00')
  const [previewPlatform, setPreviewPlatform] = useState<SocialPlatform>('instagram')
  const [platformConfigs, setPlatformConfigs] = useState<PlatformConfigurations>({})

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
      return { platform, status: 'ready' as const }
    })
  }, [selectedPlatforms, media, t])

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

    if (scheduleType === 'scheduled' && !scheduledDate) {
      toast.error(t('dashboard.createPost.validation.dateRequired'))
      return
    }

    // Build request
    const mediaIds = getMediaIds()
    const request: CreatePostRequest = {
      caption,
      social_accounts: selectedAccountIds,
      is_draft: scheduleType === 'draft',
      ...(mediaIds.length > 0 && { media_ids: mediaIds }),
      platform_configurations: platformConfigs,
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
