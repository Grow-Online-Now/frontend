/**
 * useMediaFlow Hook
 * Manages the complete state for the media-first post creation flow
 * For Instagram, TikTok, YouTube, and Pinterest (media required)
 * Orchestrates existing hooks (useConnections, useMediaUpload, useCreatePost)
 */

import { useState, useCallback, useMemo, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { useConnections } from '@/hooks/useConnections'
import { useMediaUpload, type UseMediaUploadReturn } from '@/hooks/useMediaUpload'
import { useCreatePost } from '@/hooks/useCreatePost'
import { MEDIA_FIRST_PLATFORMS, PLATFORM_CONFIG } from '@/config/text-flow'
import type {
  MediaFlowScheduleType,
  MediaFlowState,
  MediaPlatformWithValidation,
  MediaFlowValidationWarning,
} from '@/types/create'
import type {
  CreatePostRequest,
  PostResponse,
  PlatformConfigurations,
  InstagramConfig,
  TikTokConfig,
  YouTubeConfig,
  PinterestConfig,
} from '@/types/posts'
import type { SocialPlatform } from '@/types/connections'

/**
 * Hook return type
 */
export interface UseMediaFlowReturn {
  // Flow state
  state: MediaFlowState

  // Caption
  caption: string
  setCaption: (caption: string) => void

  // Media (delegated from useMediaUpload)
  media: UseMediaUploadReturn

  // Platforms
  availablePlatforms: MediaPlatformWithValidation[]
  selectedPlatformIds: string[]
  togglePlatform: (id: string) => void
  selectAll: () => void
  deselectAll: () => void

  // Platform-specific configurations
  platformConfigs: PlatformConfigurations
  updateInstagramConfig: (config: Partial<InstagramConfig>) => void
  updateTikTokConfig: (config: Partial<TikTokConfig>) => void
  updateYouTubeConfig: (config: Partial<YouTubeConfig>) => void
  updatePinterestConfig: (config: Partial<PinterestConfig>) => void

  // Validation
  validations: MediaFlowValidationWarning[]
  hasValidationErrors: boolean
  canSubmit: boolean

  // Schedule
  scheduleType: MediaFlowScheduleType
  setScheduleType: (type: MediaFlowScheduleType) => void
  scheduledDate: Date | null
  setScheduledDate: (date: Date | null) => void

  // Submission
  isSubmitting: boolean
  submitPost: () => Promise<boolean>
  saveDraft: () => Promise<boolean>
  isSavingDraft: boolean

  // Draft loading
  loadDraft: (draft: PostResponse) => void

  // Connections state
  isLoadingConnections: boolean
  hasMediaFirstAccounts: boolean

  // Unconnected platforms
  unconnectedPlatforms: SocialPlatform[]

  // Progress modal state
  showProgressModal: boolean
  setShowProgressModal: (show: boolean) => void
  platformPosts: import('@/types/posts').PlatformPost[]
  createdPost: PostResponse | null
  resetFlow: () => void
}

export function useMediaFlow(): UseMediaFlowReturn {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { lang } = useParams<{ lang: string }>()

  // Compose existing hooks
  const { connections, isLoading: isLoadingConnections } = useConnections()
  const mediaUpload = useMediaUpload()
  const {
    submitPost: createPost,
    isLoading: isSubmitting,
    startPolling,
    setShowProgressModal,
    showProgressModal,
    platformPosts,
    createdPost,
    reset: resetCreatePost,
  } = useCreatePost()

  // Flow state
  const [caption, setCaption] = useState('')
  const [selectedPlatformIds, setSelectedPlatformIds] = useState<string[]>([])
  const [scheduleType, setScheduleType] = useState<MediaFlowScheduleType>('now')
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null)
  const [isSavingDraft, setIsSavingDraft] = useState(false)

  // Platform-specific configurations
  const [platformConfigs, setPlatformConfigs] = useState<PlatformConfigurations>({})

  // Toast error when post fails
  useEffect(() => {
    if (createdPost?.status === 'failed') {
      // Get first error from platform results
      const platformResults = createdPost.platform_results || []
      const firstError = platformResults.find(
        (p) => p.status === 'failed' && (p.error || p.errorMessage)
      )
      const errorMessage = firstError?.error || firstError?.errorMessage

      if (errorMessage) {
        toast.error(errorMessage)
      } else {
        toast.error(t('dashboard.createPost.progress.failed'))
      }
    }
  }, [createdPost?.status, createdPost?.platform_results, t])

  // Filter to media-first capable platforms
  const mediaFirstConnections = useMemo(
    () => connections.filter((c) => MEDIA_FIRST_PLATFORMS.includes(c.platform)),
    [connections]
  )

  const hasMediaFirstAccounts = mediaFirstConnections.length > 0

  // Calculate unconnected media-first platforms
  const unconnectedPlatforms = useMemo(() => {
    const connectedPlatformTypes = new Set(mediaFirstConnections.map((c) => c.platform))
    return MEDIA_FIRST_PLATFORMS.filter((p) => !connectedPlatformTypes.has(p))
  }, [mediaFirstConnections])

  // Helper to check media requirements per platform
  const getMediaValidation = useCallback(
    (platform: string) => {
      const completedUploads = mediaUpload.completedUploads
      const hasAnyMedia = completedUploads.length > 0
      const hasVideo = completedUploads.some((u) => u.type === 'video')
      const hasImage = completedUploads.some((u) => u.type === 'image')

      let hasRequiredMedia = hasAnyMedia
      let mediaValidationError: string | null = null

      switch (platform) {
        case 'youtube':
          // YouTube requires video
          hasRequiredMedia = hasVideo
          if (!hasVideo && hasAnyMedia) {
            mediaValidationError = 'dashboard.create.media.validation.youtubeRequiresVideo'
          }
          break
        case 'pinterest':
          // Pinterest requires at least one image
          hasRequiredMedia = hasImage
          if (!hasImage && hasAnyMedia) {
            mediaValidationError = 'dashboard.create.media.validation.pinterestRequiresImage'
          }
          break
        case 'instagram':
        case 'tiktok':
          // Instagram and TikTok accept both images and videos
          hasRequiredMedia = hasAnyMedia
          break
        default:
          hasRequiredMedia = hasAnyMedia
      }

      return { hasRequiredMedia, mediaValidationError }
    },
    [mediaUpload.completedUploads]
  )

  // Build platform validation state
  const availablePlatforms: MediaPlatformWithValidation[] = useMemo(
    () =>
      mediaFirstConnections.map((conn) => {
        const config = PLATFORM_CONFIG[conn.platform]
        const charCount = caption.length
        const limit = config.characterLimit
        const isOverLimit = charCount > limit
        const isNearLimit = charCount >= limit * 0.9 && charCount <= limit

        const { hasRequiredMedia, mediaValidationError } = getMediaValidation(conn.platform)

        return {
          id: conn.id,
          platform: conn.platform,
          displayName: conn.displayName,
          platformUsername: conn.platformUsername,
          avatarUrl: conn.avatarUrl,
          characterCount: charCount,
          characterLimit: limit,
          isOverLimit,
          isNearLimit,
          hasRequiredMedia,
          mediaValidationError,
          isValid: !isOverLimit && hasRequiredMedia && !mediaValidationError,
        }
      }),
    [mediaFirstConnections, caption, getMediaValidation]
  )

  // Validation warnings for selected platforms
  const validations: MediaFlowValidationWarning[] = useMemo(() => {
    const warnings: MediaFlowValidationWarning[] = []

    selectedPlatformIds.forEach((id) => {
      const platform = availablePlatforms.find((p) => p.id === id)
      if (!platform) return

      // Character limit validation
      if (platform.isOverLimit) {
        warnings.push({
          platform: platform.platform,
          platformId: platform.id,
          type: 'over_limit',
          messageKey: 'dashboard.create.media.validation.overLimit',
          messageParams: {
            platform: platform.platform,
            excess: platform.characterCount - platform.characterLimit,
          },
          excessCharacters: platform.characterCount - platform.characterLimit,
        })
      }

      // Media required validation
      if (!platform.hasRequiredMedia) {
        warnings.push({
          platform: platform.platform,
          platformId: platform.id,
          type: 'media_required',
          messageKey: 'dashboard.create.media.validation.mediaRequired',
          messageParams: { platform: platform.platform },
        })
      }

      // Platform-specific media validation
      if (platform.mediaValidationError) {
        warnings.push({
          platform: platform.platform,
          platformId: platform.id,
          type: 'wrong_media_type',
          messageKey: platform.mediaValidationError,
        })
      }
    })

    return warnings
  }, [selectedPlatformIds, availablePlatforms])

  const hasValidationErrors = validations.some(
    (v) => v.type === 'over_limit' || v.type === 'media_required' || v.type === 'wrong_media_type'
  )

  // Can submit logic - must have media
  const canSubmit = useMemo(() => {
    return (
      selectedPlatformIds.length > 0 &&
      mediaUpload.completedUploads.length > 0 &&
      !mediaUpload.isUploading &&
      !hasValidationErrors &&
      (scheduleType !== 'scheduled' || scheduledDate !== null)
    )
  }, [selectedPlatformIds, mediaUpload, hasValidationErrors, scheduleType, scheduledDate])

  // Platform selection
  const togglePlatform = useCallback((id: string) => {
    setSelectedPlatformIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }, [])

  const selectAll = useCallback(() => {
    setSelectedPlatformIds(availablePlatforms.filter((p) => p.isValid).map((p) => p.id))
  }, [availablePlatforms])

  const deselectAll = useCallback(() => {
    setSelectedPlatformIds([])
  }, [])

  // Platform configuration updaters
  const updateInstagramConfig = useCallback((config: Partial<InstagramConfig>) => {
    setPlatformConfigs((prev) => ({
      ...prev,
      instagram: { ...prev.instagram, ...config },
    }))
  }, [])

  const updateTikTokConfig = useCallback((config: Partial<TikTokConfig>) => {
    setPlatformConfigs((prev) => ({
      ...prev,
      tiktok: { ...prev.tiktok, ...config },
    }))
  }, [])

  const updateYouTubeConfig = useCallback((config: Partial<YouTubeConfig>) => {
    setPlatformConfigs((prev) => ({
      ...prev,
      youtube: { ...prev.youtube, ...config },
    }))
  }, [])

  const updatePinterestConfig = useCallback((config: Partial<PinterestConfig>) => {
    setPlatformConfigs((prev) => ({
      ...prev,
      pinterest: { ...prev.pinterest, ...config },
    }))
  }, [])

  // Submission
  const handleSubmit = useCallback(async (): Promise<boolean> => {
    if (!canSubmit || hasValidationErrors) return false

    // Check for pending uploads
    if (mediaUpload.isUploading) {
      toast.error(t('dashboard.createPost.media.validation.uploadsInProgress'))
      return false
    }

    // Check for failed uploads
    if (mediaUpload.hasErrors) {
      toast.error(t('dashboard.createPost.media.validation.uploadsFailed'))
      return false
    }

    const request: CreatePostRequest = {
      caption,
      social_accounts: selectedPlatformIds,
      is_draft: false,
      media_ids: mediaUpload.getMediaIds(),
      platform_configurations: platformConfigs,
    }

    // Add scheduled date if scheduling
    if (scheduleType === 'scheduled' && scheduledDate) {
      request.scheduled_at = scheduledDate.toISOString()
    }

    const result = await createPost(request)

    if (result) {
      // Show progress modal for both scheduled and now posts
      setShowProgressModal(true)

      // If posting now, start polling for status updates
      if (scheduleType === 'now') {
        startPolling(result.id)
      }

      // Note: Navigation is now handled by the modal CTAs, not here

      return true
    }

    return false
  }, [
    canSubmit,
    hasValidationErrors,
    mediaUpload,
    caption,
    selectedPlatformIds,
    platformConfigs,
    scheduleType,
    scheduledDate,
    createPost,
    startPolling,
    setShowProgressModal,
    t,
  ])

  // Save as draft
  const handleSaveDraft = useCallback(async (): Promise<boolean> => {
    // For media flow, we allow saving drafts with just media (no caption required)
    if (mediaUpload.completedUploads.length === 0 && !caption.trim()) {
      toast.error(t('dashboard.create.media.draft.emptyContent'))
      return false
    }

    // Check for pending uploads
    if (mediaUpload.isUploading) {
      toast.error(t('dashboard.createPost.media.validation.uploadsInProgress'))
      return false
    }

    setIsSavingDraft(true)

    try {
      const request: CreatePostRequest = {
        caption,
        social_accounts: selectedPlatformIds.length > 0 ? selectedPlatformIds : [],
        is_draft: true,
        platform_configurations: platformConfigs,
      }

      // Add media if any
      if (mediaUpload.completedUploads.length > 0) {
        request.media_ids = mediaUpload.getMediaIds()
      }

      const result = await createPost(request)

      if (result) {
        toast.success(t('dashboard.create.media.draft.saved'))
        navigate(`/${lang}/dashboard/posts`)
        return true
      }

      return false
    } finally {
      setIsSavingDraft(false)
    }
  }, [caption, mediaUpload, selectedPlatformIds, platformConfigs, createPost, navigate, lang, t])

  // Load draft into composer
  const loadDraft = useCallback(
    (draft: PostResponse) => {
      // Set the caption from the draft
      setCaption(draft.caption)

      // Set selected platforms from the draft's social accounts
      // Only select accounts that are still connected (exist in availablePlatforms)
      const draftAccountIds = draft.social_accounts.map((a) => a.id)
      const validAccountIds = draftAccountIds.filter((id) =>
        availablePlatforms.some((p) => p.id === id)
      )
      setSelectedPlatformIds(validAccountIds)

      toast.success(t('dashboard.create.media.draft.loaded'))
    },
    [availablePlatforms, t]
  )

  // Reset entire flow (for "Create Another" action)
  const resetFlow = useCallback(() => {
    setCaption('')
    setSelectedPlatformIds([])
    setScheduleType('now')
    setScheduledDate(null)
    setPlatformConfigs({})
    mediaUpload.reset()
    resetCreatePost()
  }, [mediaUpload, resetCreatePost])

  // Build state object
  const state: MediaFlowState = {
    caption,
    selectedPlatformIds,
    scheduleType,
    scheduledDate,
  }

  return {
    state,
    caption,
    setCaption,
    media: mediaUpload,
    availablePlatforms,
    selectedPlatformIds,
    togglePlatform,
    selectAll,
    deselectAll,
    platformConfigs,
    updateInstagramConfig,
    updateTikTokConfig,
    updateYouTubeConfig,
    updatePinterestConfig,
    validations,
    hasValidationErrors,
    canSubmit,
    scheduleType,
    setScheduleType,
    scheduledDate,
    setScheduledDate,
    isSubmitting,
    submitPost: handleSubmit,
    saveDraft: handleSaveDraft,
    isSavingDraft,
    loadDraft,
    isLoadingConnections,
    hasMediaFirstAccounts,
    unconnectedPlatforms,
    // Progress modal state
    showProgressModal,
    setShowProgressModal,
    platformPosts,
    createdPost,
    resetFlow,
  }
}
