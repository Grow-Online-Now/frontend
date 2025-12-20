/**
 * useTextFlow Hook
 * Manages the complete state for the text-first post creation flow (2 steps)
 * Step 1: Write content + Select accounts
 * Step 2: Schedule & Publish
 * Orchestrates existing hooks (useConnections, useMediaUpload, useCreatePost)
 */

import { useState, useCallback, useMemo, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { useConnections } from '@/hooks/useConnections'
import { useMediaUpload, type UseMediaUploadReturn } from '@/hooks/useMediaUpload'
import { useCreatePost } from '@/hooks/useCreatePost'
import { TEXT_FIRST_PLATFORMS, PLATFORM_CONFIG } from '@/config/text-flow'
import type {
  TextFlowStep,
  TextFlowScheduleType,
  TextFlowState,
  PlatformWithValidation,
  ValidationWarning,
} from '@/types/create'
import type { CreatePostRequest, PostResponse } from '@/types/posts'
import type { SocialPlatform } from '@/types/connections'

/**
 * Hook return type
 */
export interface UseTextFlowReturn {
  // Flow state
  state: TextFlowState
  currentStep: TextFlowStep

  // Step navigation
  canContinue: boolean
  goToStep: (step: TextFlowStep) => void
  goNext: () => void
  goBack: () => void

  // Content
  content: string
  setContent: (content: string) => void

  // Media (delegated from useMediaUpload)
  media: UseMediaUploadReturn

  // Platforms
  availablePlatforms: PlatformWithValidation[]
  selectedPlatformIds: string[]
  togglePlatform: (id: string) => void
  selectAll: () => void
  deselectAll: () => void

  // Validation
  validations: ValidationWarning[]
  hasValidationErrors: boolean

  // Schedule
  scheduleType: TextFlowScheduleType
  setScheduleType: (type: TextFlowScheduleType) => void
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
  hasTextFirstAccounts: boolean

  // Unconnected platforms
  unconnectedPlatforms: SocialPlatform[]

  // Connect a platform (opens OAuth popup)
  connectPlatform: (platform: SocialPlatform) => void

  // Progress modal state
  showProgressModal: boolean
  setShowProgressModal: (show: boolean) => void
  platformPosts: import('@/types/posts').PlatformPost[]
  createdPost: PostResponse | null
  resetFlow: () => void
}

export function useTextFlow(): UseTextFlowReturn {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { lang } = useParams<{ lang: string }>()

  // Compose existing hooks
  const { connections, isLoading: isLoadingConnections, connect } = useConnections()
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
  const [step, setStep] = useState<TextFlowStep>(1)
  const [content, setContent] = useState('')
  const [selectedPlatformIds, setSelectedPlatformIds] = useState<string[]>([])
  const [scheduleType, setScheduleType] = useState<TextFlowScheduleType>('now')
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null)
  const [isSavingDraft, setIsSavingDraft] = useState(false)

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

  // Filter to text-first capable platforms
  const textFirstConnections = useMemo(
    () => connections.filter((c) => TEXT_FIRST_PLATFORMS.includes(c.platform)),
    [connections]
  )

  const hasTextFirstAccounts = textFirstConnections.length > 0

  // Calculate unconnected text-first platforms
  const unconnectedPlatforms = useMemo(() => {
    const connectedPlatformTypes = new Set(textFirstConnections.map((c) => c.platform))
    return TEXT_FIRST_PLATFORMS.filter((p) => !connectedPlatformTypes.has(p))
  }, [textFirstConnections])

  // Build platform validation state
  const availablePlatforms: PlatformWithValidation[] = useMemo(
    () =>
      textFirstConnections.map((conn) => {
        const config = PLATFORM_CONFIG[conn.platform]
        const charCount = content.length
        const limit = config.characterLimit
        const isOverLimit = charCount > limit
        const isNearLimit = charCount >= limit * 0.9 && charCount <= limit

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
          isValid: !isOverLimit,
        }
      }),
    [textFirstConnections, content]
  )

  // Validation warnings for selected platforms
  const validations: ValidationWarning[] = useMemo(() => {
    const warnings: ValidationWarning[] = []

    selectedPlatformIds.forEach((id) => {
      const platform = availablePlatforms.find((p) => p.id === id)
      if (!platform) return

      if (platform.isOverLimit) {
        warnings.push({
          platform: platform.platform,
          platformId: platform.id,
          type: 'over_limit',
          messageKey: 'dashboard.create.text.validation.overLimit',
          messageParams: {
            platform: platform.platform,
            excess: platform.characterCount - platform.characterLimit,
          },
          excessCharacters: platform.characterCount - platform.characterLimit,
        })
      }
    })

    return warnings
  }, [selectedPlatformIds, availablePlatforms])

  const hasValidationErrors = validations.some((v) => v.type === 'over_limit')

  // Can continue logic per step
  const canContinue = useMemo(() => {
    switch (step) {
      case 1:
        // Step 1: Need content, at least one platform, no validation errors, and no uploads in progress
        return (
          content.trim().length > 0 &&
          selectedPlatformIds.length > 0 &&
          !hasValidationErrors &&
          !mediaUpload.isUploading
        )
      case 2:
        // Step 2: If scheduled, need a date
        return scheduleType !== 'scheduled' || scheduledDate !== null
      default:
        return false
    }
  }, [
    step,
    content,
    mediaUpload.isUploading,
    selectedPlatformIds,
    hasValidationErrors,
    scheduleType,
    scheduledDate,
  ])

  // Navigation
  const goToStep = useCallback((newStep: TextFlowStep) => {
    setStep(newStep)
  }, [])

  const goNext = useCallback(() => {
    if (step < 2 && canContinue) {
      setStep((s) => (s + 1) as TextFlowStep)
    }
  }, [step, canContinue])

  const goBack = useCallback(() => {
    if (step > 1) {
      setStep((s) => (s - 1) as TextFlowStep)
    } else {
      // Step 1: Navigate back to posts page
      navigate(`/${lang}/dashboard/posts`)
    }
  }, [step, navigate, lang])

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

  // Schedule type change handler
  const handleScheduleTypeChange = useCallback(
    (type: TextFlowScheduleType) => {
      setScheduleType(type)
      // Show "coming soon" toast for best time
      if (type === 'best') {
        toast.info(t('dashboard.create.text.schedule.best.comingSoon'))
        // Fall back to 'now' since best time isn't implemented
        setScheduleType('now')
      }
    },
    [t]
  )

  // Submission
  const handleSubmit = useCallback(async (): Promise<boolean> => {
    if (!canContinue || hasValidationErrors) return false

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
      caption: content,
      social_accounts: selectedPlatformIds,
      is_draft: false,
    }

    // Add media if any
    if (mediaUpload.completedUploads.length > 0) {
      request.media_ids = mediaUpload.getMediaIds()
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
    canContinue,
    hasValidationErrors,
    mediaUpload,
    content,
    selectedPlatformIds,
    scheduleType,
    scheduledDate,
    createPost,
    startPolling,
    setShowProgressModal,
    t,
  ])

  // Save as draft
  const handleSaveDraft = useCallback(async (): Promise<boolean> => {
    // Need at least some content to save as draft
    if (!content.trim()) {
      toast.error(t('dashboard.create.text.draft.emptyContent'))
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
        caption: content,
        social_accounts: selectedPlatformIds.length > 0 ? selectedPlatformIds : [],
        is_draft: true,
      }

      // Add media if any
      if (mediaUpload.completedUploads.length > 0) {
        request.media_ids = mediaUpload.getMediaIds()
      }

      const result = await createPost(request)

      if (result) {
        toast.success(t('dashboard.create.text.draft.saved'))
        navigate(`/${lang}/dashboard/posts`)
        return true
      }

      return false
    } finally {
      setIsSavingDraft(false)
    }
  }, [content, mediaUpload, selectedPlatformIds, createPost, navigate, lang, t])

  // Load draft into composer
  const loadDraft = useCallback(
    (draft: PostResponse) => {
      // Set the content from the draft
      setContent(draft.caption)

      // Set selected platforms from the draft's social accounts
      // Only select accounts that are still connected (exist in availablePlatforms)
      const draftAccountIds = draft.social_accounts.map((a) => a.id)
      const validAccountIds = draftAccountIds.filter((id) =>
        availablePlatforms.some((p) => p.id === id)
      )
      setSelectedPlatformIds(validAccountIds)

      // Reset to step 1 if not already there
      if (step !== 1) {
        setStep(1)
      }

      toast.success(t('dashboard.create.text.draft.loaded'))
    },
    [availablePlatforms, step, t]
  )

  // Reset entire flow (for "Create Another" action)
  const resetFlow = useCallback(() => {
    setStep(1)
    setContent('')
    setSelectedPlatformIds([])
    setScheduleType('now')
    setScheduledDate(null)
    mediaUpload.reset()
    resetCreatePost()
  }, [mediaUpload, resetCreatePost])

  // Build state object
  const state: TextFlowState = {
    step,
    content,
    media: mediaUpload.uploadsArray,
    selectedPlatformIds,
    scheduleType,
    scheduledDate,
  }

  return {
    state,
    currentStep: step,
    canContinue,
    goToStep,
    goNext,
    goBack,
    content,
    setContent,
    media: mediaUpload,
    availablePlatforms,
    selectedPlatformIds,
    togglePlatform,
    selectAll,
    deselectAll,
    validations,
    hasValidationErrors,
    scheduleType,
    setScheduleType: handleScheduleTypeChange,
    scheduledDate,
    setScheduledDate,
    isSubmitting,
    submitPost: handleSubmit,
    saveDraft: handleSaveDraft,
    isSavingDraft,
    loadDraft,
    isLoadingConnections,
    hasTextFirstAccounts,
    unconnectedPlatforms,
    connectPlatform: connect,
    // Progress modal state
    showProgressModal,
    setShowProgressModal,
    platformPosts,
    createdPost,
    resetFlow,
  }
}
