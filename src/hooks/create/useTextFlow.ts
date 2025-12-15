/**
 * useTextFlow Hook
 * Manages the complete state for the text-first post creation flow
 * Orchestrates existing hooks (useConnections, useMediaUpload, useCreatePost)
 */

import { useState, useCallback, useMemo } from 'react'
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
import type { CreatePostRequest } from '@/types/posts'

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

  // Connections state
  isLoadingConnections: boolean
  hasTextFirstAccounts: boolean
}

export function useTextFlow(): UseTextFlowReturn {
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
  } = useCreatePost()

  // Flow state
  const [step, setStep] = useState<TextFlowStep>(1)
  const [content, setContent] = useState('')
  const [selectedPlatformIds, setSelectedPlatformIds] = useState<string[]>([])
  const [scheduleType, setScheduleType] = useState<TextFlowScheduleType>('now')
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null)

  // Filter to text-first capable platforms
  const textFirstConnections = useMemo(
    () => connections.filter((c) => TEXT_FIRST_PLATFORMS.includes(c.platform)),
    [connections]
  )

  const hasTextFirstAccounts = textFirstConnections.length > 0

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
        // Step 1: Need content and no uploads in progress
        return content.trim().length > 0 && !mediaUpload.isUploading
      case 2:
        // Step 2: Need at least one platform selected and no validation errors
        return selectedPlatformIds.length > 0 && !hasValidationErrors
      case 3:
        // Step 3: If scheduled, need a date
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
    if (step < 3 && canContinue) {
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
      // If posting now, show progress modal and start polling
      if (scheduleType === 'now') {
        setShowProgressModal(true)
        startPolling(result.id)
      }

      // Show success toast
      const toastKey =
        scheduleType === 'scheduled'
          ? 'dashboard.create.text.success.scheduled'
          : 'dashboard.create.text.success.published'
      toast.success(t(toastKey))

      // Navigate based on schedule type
      if (scheduleType === 'scheduled') {
        navigate(`/${lang}/dashboard/scheduler`)
      } else {
        navigate(`/${lang}/dashboard/posts`)
      }

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
    navigate,
    lang,
    t,
  ])

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
    isLoadingConnections,
    hasTextFirstAccounts,
  }
}
