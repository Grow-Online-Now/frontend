/**
 * TikTokConfigSection
 * TikTok-specific configuration options for post creation
 * Compliant with TikTok UX Guidelines requirements
 */

import { useEffect, useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Film, Image, Loader2, AlertCircle, Info, ExternalLink, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useTikTokCreatorInfo } from '@/hooks/useTikTokCreatorInfo'
import type { TikTokConfig, TikTokContentType, TikTokPrivacyLevel } from '@/types/posts'

interface MediaFile {
  id: string
  file: File
  url: string
  type: 'image' | 'video'
  duration?: number // Video duration in seconds
}

interface TikTokConfigSectionProps {
  connectionId?: string | null
  config: TikTokConfig
  onChange: (config: TikTokConfig) => void
  media: MediaFile[]
  className?: string
  /** Callback to report validation state to parent */
  onValidationChange?: (isValid: boolean, errors: string[]) => void
}

const CONTENT_TYPE_OPTIONS: {
  value: TikTokContentType
  labelKey: string
  descriptionKey: string
  icon: typeof Film
}[] = [
  {
    value: 'video',
    labelKey: 'dashboard.createPost.platformConfig.tiktok.types.video',
    descriptionKey: 'dashboard.createPost.platformConfig.tiktok.types.videoDesc',
    icon: Film,
  },
  {
    value: 'photo',
    labelKey: 'dashboard.createPost.platformConfig.tiktok.types.photo',
    descriptionKey: 'dashboard.createPost.platformConfig.tiktok.types.photoDesc',
    icon: Image,
  },
]

const PRIVACY_LEVEL_LABELS: Record<TikTokPrivacyLevel, string> = {
  PUBLIC_TO_EVERYONE: 'dashboard.createPost.platformConfig.tiktok.privacyLevels.PUBLIC_TO_EVERYONE',
  MUTUAL_FOLLOW_FRIENDS:
    'dashboard.createPost.platformConfig.tiktok.privacyLevels.MUTUAL_FOLLOW_FRIENDS',
  FOLLOWER_OF_CREATOR:
    'dashboard.createPost.platformConfig.tiktok.privacyLevels.FOLLOWER_OF_CREATOR',
  SELF_ONLY: 'dashboard.createPost.platformConfig.tiktok.privacyLevels.SELF_ONLY',
}

export function TikTokConfigSection({
  connectionId,
  config,
  onChange,
  media,
  className,
  onValidationChange,
}: TikTokConfigSectionProps) {
  const { t } = useTranslation()

  // Fetch creator info for compliance
  const {
    isLoading: isLoadingCreatorInfo,
    error: creatorInfoError,
    privacyOptions,
    commentDisabled,
    duetDisabled,
    stitchDisabled,
    maxVideoDuration,
    creatorNickname,
  } = useTikTokCreatorInfo(connectionId ?? null)

  // Auto-detect content type based on media
  const hasVideo = media.some((m) => m.type === 'video')
  const detectedType: TikTokContentType = hasVideo ? 'video' : 'photo'
  const currentType = config.contentType || detectedType

  // Check video duration against max allowed
  const videoMedia = media.find((m) => m.type === 'video')
  const videoDurationExceedsMax = useMemo(() => {
    if (!videoMedia?.duration || !maxVideoDuration) return false
    return videoMedia.duration > maxVideoDuration
  }, [videoMedia?.duration, maxVideoDuration])

  // Use available privacy options from creator info, or fallback to all options
  const availablePrivacyOptions = useMemo(() => {
    if (privacyOptions.length > 0) {
      return privacyOptions
    }
    // Fallback when creator info not loaded
    return [
      'PUBLIC_TO_EVERYONE',
      'MUTUAL_FOLLOW_FRIENDS',
      'FOLLOWER_OF_CREATOR',
      'SELF_ONLY',
    ] as TikTokPrivacyLevel[]
  }, [privacyOptions])

  // Check if branded content blocks private visibility
  const brandedContentSelected = config.brandContentToggle
  const filteredPrivacyOptions = useMemo(() => {
    if (brandedContentSelected) {
      return availablePrivacyOptions.filter((opt) => opt !== 'SELF_ONLY')
    }
    return availablePrivacyOptions
  }, [availablePrivacyOptions, brandedContentSelected])

  // Is commercial disclosure toggle on? (either brand option selected)
  const commercialDisclosureEnabled = config.brandContentToggle || config.brandOrganicToggle

  // Validation: commercial toggle on but no option selected
  const commercialSelectionMissing =
    commercialDisclosureEnabled && !config.brandContentToggle && !config.brandOrganicToggle

  // Calculate validation state
  const validationErrors = useMemo(() => {
    const errors: string[] = []

    if (!config.privacyLevel) {
      errors.push(t('dashboard.createPost.platformConfig.tiktok.privacyRequired'))
    }

    if (commercialSelectionMissing) {
      errors.push(t('dashboard.createPost.platformConfig.tiktok.commercialContent.selectionRequired'))
    }

    if (videoDurationExceedsMax) {
      errors.push(
        t('dashboard.createPost.platformConfig.tiktok.errors.videoDurationExceeded', {
          max: maxVideoDuration,
        })
      )
    }

    return errors
  }, [config.privacyLevel, commercialSelectionMissing, videoDurationExceedsMax, maxVideoDuration, t])

  const isValid = validationErrors.length === 0

  // Report validation state to parent
  useEffect(() => {
    onValidationChange?.(isValid, validationErrors)
  }, [isValid, validationErrors, onValidationChange])

  // Reset privacy if branded content selected and current is SELF_ONLY
  useEffect(() => {
    if (brandedContentSelected && config.privacyLevel === 'SELF_ONLY') {
      onChange({ ...config, privacyLevel: undefined })
    }
  }, [brandedContentSelected, config, onChange])

  const handleTypeChange = useCallback(
    (type: TikTokContentType) => {
      onChange({ ...config, contentType: type })
    },
    [config, onChange]
  )

  const handlePrivacyChange = useCallback(
    (privacy: string) => {
      if (privacy === '') {
        onChange({ ...config, privacyLevel: undefined })
      } else {
        onChange({ ...config, privacyLevel: privacy as TikTokPrivacyLevel })
      }
    },
    [config, onChange]
  )

  const handleTitleChange = useCallback(
    (title: string) => {
      // Limit to 90 characters
      const truncated = title.slice(0, 90)
      onChange({ ...config, title: truncated || undefined })
    },
    [config, onChange]
  )

  const handleInteractionToggle = useCallback(
    (field: 'disableComment' | 'disableDuet' | 'disableStitch', checked: boolean) => {
      // When checked = true (allow), set disable to false
      // When checked = false (disallow), set disable to true
      onChange({ ...config, [field]: !checked })
    },
    [config, onChange]
  )

  const handleToggle = useCallback(
    (field: keyof TikTokConfig, value: boolean) => {
      onChange({ ...config, [field]: value })
    },
    [config, onChange]
  )

  const handleCommercialToggleChange = useCallback(
    (enabled: boolean) => {
      if (!enabled) {
        // When turning off, clear both brand options
        onChange({
          ...config,
          brandContentToggle: false,
          brandOrganicToggle: false,
        })
      }
    },
    [config, onChange]
  )

  // Determine which label prompt to show for commercial content
  const getLabelPrompt = () => {
    // Per TikTok guidelines:
    // - If only "Your Brand" is checked: "Promotional content"
    // - If "Branded Content" is checked (regardless of Your Brand): "Paid partnership"
    if (config.brandContentToggle) {
      return t('dashboard.createPost.platformConfig.tiktok.commercialContent.brandedContent.labelPrompt')
    }
    if (config.brandOrganicToggle) {
      return t('dashboard.createPost.platformConfig.tiktok.commercialContent.yourBrand.labelPrompt')
    }
    return null
  }

  // Loading state
  if (isLoadingCreatorInfo) {
    return (
      <div className={cn('space-y-3', className)}>
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          {t('dashboard.common.loading')}
        </div>
      </div>
    )
  }

  // Error state - still render form with defaults
  if (creatorInfoError) {
    return (
      <div className={cn('space-y-3', className)}>
        <div className="text-warning flex items-center gap-2 text-sm">
          <AlertCircle className="h-4 w-4" />
          {t('dashboard.createPost.platformConfig.tiktok.errors.creatorInfoFailed')}
        </div>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className={cn('space-y-4', className)}>
        {/* Creator Account Info (Requirement 1a) */}
        {creatorNickname && (
          <div className="bg-bg-subtle flex items-center gap-2 rounded-lg p-3">
            <User className="text-muted-foreground h-4 w-4" />
            <span className="text-muted-foreground text-xs">
              {t('dashboard.createPost.platformConfig.tiktok.postingAs')}
            </span>
            <span className="text-foreground text-sm font-medium">{creatorNickname}</span>
          </div>
        )}

        {/* Video Duration Warning (Requirement 1c) */}
        {videoDurationExceedsMax && (
          <div className="border-error/50 bg-error/10 flex items-start gap-2 rounded-lg border p-3">
            <AlertCircle className="text-error mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p className="text-error text-sm font-medium">
                {t('dashboard.createPost.platformConfig.tiktok.errors.videoDurationExceeded', {
                  max: maxVideoDuration,
                })}
              </p>
              <p className="text-error/80 text-xs">
                {t('dashboard.createPost.platformConfig.tiktok.errors.videoDurationHint', {
                  current: Math.round(videoMedia?.duration || 0),
                  max: maxVideoDuration,
                })}
              </p>
            </div>
          </div>
        )}

        {/* Content Type */}
        <div className="space-y-2">
          {CONTENT_TYPE_OPTIONS.map((option) => {
            const Icon = option.icon
            const isSelected = currentType === option.value

            return (
              <div
                key={option.value}
                className={cn(
                  'flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-all duration-150',
                  isSelected
                    ? 'border-primary/40 bg-primary/5'
                    : 'border-border-subtle hover:border-border hover:bg-surface-elevated'
                )}
                onClick={() => handleTypeChange(option.value)}
              >
                <div
                  className={cn(
                    'mt-0.5 flex size-5 items-center justify-center rounded-full border-2 transition-colors duration-150',
                    isSelected ? 'border-primary' : 'border-border-muted'
                  )}
                >
                  {isSelected && <div className="bg-primary size-2 rounded-full" />}
                </div>

                <Icon
                  className={cn(
                    'mt-0.5 h-4 w-4 shrink-0 transition-colors',
                    isSelected ? 'text-primary' : 'text-muted-foreground'
                  )}
                />

                <div className="flex-1">
                  <p className="text-foreground text-sm font-medium">{t(option.labelKey)}</p>
                  <p className="text-muted-foreground text-xs">{t(option.descriptionKey)}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Title Field (Requirement 2a) */}
        <div className="space-y-1.5">
          <label className="text-muted-foreground text-xs font-medium">
            {t('dashboard.createPost.platformConfig.tiktok.titleField.label')}
          </label>
          <input
            type="text"
            value={config.title || ''}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder={t('dashboard.createPost.platformConfig.tiktok.titleField.placeholder')}
            className="border-border bg-bg-base text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 h-9 w-full rounded-lg border px-3 text-sm outline-none focus:ring-2"
            maxLength={90}
          />
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-xs">
              {t('dashboard.createPost.platformConfig.tiktok.titleField.hint')}
            </p>
            <p className="text-muted-foreground text-xs">
              {t('dashboard.createPost.platformConfig.tiktok.titleField.charCount', {
                count: config.title?.length || 0,
              })}
            </p>
          </div>
        </div>

        {/* Privacy - NO DEFAULT VALUE (Requirement 2b) */}
        <div className="space-y-1.5">
          <label className="text-muted-foreground text-xs font-medium">
            {t('dashboard.createPost.platformConfig.tiktok.privacy')}
          </label>
          <Select value={config.privacyLevel || ''} onValueChange={handlePrivacyChange}>
            <SelectTrigger className={cn('h-9', !config.privacyLevel && 'text-muted-foreground')}>
              <SelectValue
                placeholder={t('dashboard.createPost.platformConfig.tiktok.privacyPlaceholder')}
              />
            </SelectTrigger>
            <SelectContent>
              {filteredPrivacyOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {t(PRIVACY_LEVEL_LABELS[option])}
                </SelectItem>
              ))}
              {/* Show disabled SELF_ONLY with tooltip when branded content selected */}
              {brandedContentSelected && availablePrivacyOptions.includes('SELF_ONLY') && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-muted-foreground relative flex cursor-not-allowed select-none items-center rounded-sm px-2 py-1.5 text-sm opacity-50 outline-none">
                      {t(PRIVACY_LEVEL_LABELS.SELF_ONLY)}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {t(
                        'dashboard.createPost.platformConfig.tiktok.commercialContent.brandedContent.privateDisabledTooltip'
                      )}
                    </p>
                  </TooltipContent>
                </Tooltip>
              )}
            </SelectContent>
          </Select>
          {!config.privacyLevel && (
            <p className="text-warning text-xs">
              {t('dashboard.createPost.platformConfig.tiktok.privacyRequired')}
            </p>
          )}
        </div>

        {/* Interactions - UNCHECKED BY DEFAULT (Requirement 2c) */}
        <div className="space-y-2">
          <label className="text-muted-foreground text-xs font-medium">
            {t('dashboard.createPost.platformConfig.tiktok.interactions.title')}
          </label>

          {/* Comment */}
          <label
            className={cn(
              'border-border-subtle flex items-center gap-3 rounded-xl border p-3 transition-colors',
              commentDisabled
                ? 'cursor-not-allowed opacity-50'
                : 'hover:bg-surface-elevated cursor-pointer'
            )}
          >
            <input
              type="checkbox"
              // UNCHECKED by default: only checked if disableComment is explicitly false
              checked={config.disableComment === false && !commentDisabled}
              onChange={(e) => handleInteractionToggle('disableComment', e.target.checked)}
              disabled={commentDisabled}
              className="border-input text-primary focus:ring-primary h-4 w-4 rounded accent-[var(--color-primary)]"
            />
            <div className="flex-1">
              <span className="text-foreground text-sm">
                {t('dashboard.createPost.platformConfig.tiktok.interactions.comment')}
              </span>
              {commentDisabled && (
                <p className="text-muted-foreground text-xs">
                  {t('dashboard.createPost.platformConfig.tiktok.interactions.disabledByCreator')}
                </p>
              )}
            </div>
          </label>

          {/* Duet (video only) */}
          {currentType === 'video' && (
            <label
              className={cn(
                'border-border-subtle flex items-center gap-3 rounded-xl border p-3 transition-colors',
                duetDisabled
                  ? 'cursor-not-allowed opacity-50'
                  : 'hover:bg-surface-elevated cursor-pointer'
              )}
            >
              <input
                type="checkbox"
                // UNCHECKED by default: only checked if disableDuet is explicitly false
                checked={config.disableDuet === false && !duetDisabled}
                onChange={(e) => handleInteractionToggle('disableDuet', e.target.checked)}
                disabled={duetDisabled}
                className="border-input text-primary focus:ring-primary h-4 w-4 rounded accent-[var(--color-primary)]"
              />
              <div className="flex-1">
                <span className="text-foreground text-sm">
                  {t('dashboard.createPost.platformConfig.tiktok.interactions.duet')}
                </span>
                {duetDisabled && (
                  <p className="text-muted-foreground text-xs">
                    {t('dashboard.createPost.platformConfig.tiktok.interactions.disabledByCreator')}
                  </p>
                )}
              </div>
            </label>
          )}

          {/* Stitch (video only) */}
          {currentType === 'video' && (
            <label
              className={cn(
                'border-border-subtle flex items-center gap-3 rounded-xl border p-3 transition-colors',
                stitchDisabled
                  ? 'cursor-not-allowed opacity-50'
                  : 'hover:bg-surface-elevated cursor-pointer'
              )}
            >
              <input
                type="checkbox"
                // UNCHECKED by default: only checked if disableStitch is explicitly false
                checked={config.disableStitch === false && !stitchDisabled}
                onChange={(e) => handleInteractionToggle('disableStitch', e.target.checked)}
                disabled={stitchDisabled}
                className="border-input text-primary focus:ring-primary h-4 w-4 rounded accent-[var(--color-primary)]"
              />
              <div className="flex-1">
                <span className="text-foreground text-sm">
                  {t('dashboard.createPost.platformConfig.tiktok.interactions.stitch')}
                </span>
                {stitchDisabled && (
                  <p className="text-muted-foreground text-xs">
                    {t('dashboard.createPost.platformConfig.tiktok.interactions.disabledByCreator')}
                  </p>
                )}
              </div>
            </label>
          )}
        </div>

        {/* Auto-add music (photo only) */}
        {currentType === 'photo' && (
          <label className="border-border-subtle hover:bg-surface-elevated flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors">
            <input
              type="checkbox"
              checked={config.autoAddMusic ?? false}
              onChange={(e) => handleToggle('autoAddMusic', e.target.checked)}
              className="border-input text-primary focus:ring-primary h-4 w-4 rounded accent-[var(--color-primary)]"
            />
            <span className="text-foreground text-sm">
              {t('dashboard.createPost.platformConfig.tiktok.autoAddMusic')}
            </span>
          </label>
        )}

        {/* Commercial Content Disclosure (Requirement 3) */}
        <div className="border-border-subtle space-y-3 rounded-xl border p-3">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={commercialDisclosureEnabled}
              onChange={(e) => handleCommercialToggleChange(e.target.checked)}
              className="border-input text-primary focus:ring-primary mt-0.5 h-4 w-4 rounded accent-[var(--color-primary)]"
            />
            <div className="flex-1">
              <p className="text-foreground text-sm font-medium">
                {t('dashboard.createPost.platformConfig.tiktok.commercialContent.title')}
              </p>
              <p className="text-muted-foreground text-xs">
                {t('dashboard.createPost.platformConfig.tiktok.commercialContent.toggle')}
              </p>
            </div>
          </div>

          {commercialDisclosureEnabled && (
            <div className="ml-7 space-y-2">
              {/* Your Brand option */}
              <label className="border-border-subtle hover:bg-surface-elevated flex cursor-pointer items-start gap-3 rounded-lg border p-2.5 transition-colors">
                <input
                  type="checkbox"
                  checked={config.brandOrganicToggle ?? false}
                  onChange={(e) => handleToggle('brandOrganicToggle', e.target.checked)}
                  className="border-input text-primary focus:ring-primary mt-0.5 h-4 w-4 rounded accent-[var(--color-primary)]"
                />
                <div className="flex-1">
                  <p className="text-foreground text-sm">
                    {t('dashboard.createPost.platformConfig.tiktok.commercialContent.yourBrand.label')}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {t(
                      'dashboard.createPost.platformConfig.tiktok.commercialContent.yourBrand.description'
                    )}
                  </p>
                </div>
              </label>

              {/* Branded Content option */}
              <label className="border-border-subtle hover:bg-surface-elevated flex cursor-pointer items-start gap-3 rounded-lg border p-2.5 transition-colors">
                <input
                  type="checkbox"
                  checked={config.brandContentToggle ?? false}
                  onChange={(e) => handleToggle('brandContentToggle', e.target.checked)}
                  className="border-input text-primary focus:ring-primary mt-0.5 h-4 w-4 rounded accent-[var(--color-primary)]"
                />
                <div className="flex-1">
                  <p className="text-foreground text-sm">
                    {t(
                      'dashboard.createPost.platformConfig.tiktok.commercialContent.brandedContent.label'
                    )}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {t(
                      'dashboard.createPost.platformConfig.tiktok.commercialContent.brandedContent.description'
                    )}
                  </p>
                  {config.brandContentToggle && (
                    <p className="text-warning mt-1 text-xs">
                      {t(
                        'dashboard.createPost.platformConfig.tiktok.commercialContent.brandedContent.privateWarning'
                      )}
                    </p>
                  )}
                </div>
              </label>

              {/* Show label prompt based on selection */}
              {(config.brandOrganicToggle || config.brandContentToggle) && (
                <p className="text-info text-xs">{getLabelPrompt()}</p>
              )}

              {/* Warning if toggle on but no selection (with tooltip on hover) */}
              {!config.brandOrganicToggle && !config.brandContentToggle && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="text-warning cursor-help text-xs">
                      {t(
                        'dashboard.createPost.platformConfig.tiktok.commercialContent.selectionRequired'
                      )}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {t(
                        'dashboard.createPost.platformConfig.tiktok.commercialContent.selectionRequiredTooltip'
                      )}
                    </p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          )}
        </div>

        {/* Consent Declaration (Requirement 4) */}
        <div className="border-border-subtle bg-bg-subtle rounded-lg border p-3">
          <div className="flex items-start gap-2">
            <Info className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
            <div className="space-y-1">
              {/* Show appropriate consent based on commercial content selection */}
              {config.brandContentToggle ? (
                // Branded Content selected (alone or with Your Brand): show both policies
                <p className="text-muted-foreground text-xs">
                  {t('dashboard.createPost.platformConfig.tiktok.consent.brandedContentAndMusic')}
                </p>
              ) : (
                // No branded content OR only Your Brand: show only Music Usage
                <p className="text-muted-foreground text-xs">
                  {t('dashboard.createPost.platformConfig.tiktok.consent.musicUsage')}
                </p>
              )}
              <a
                href="https://www.tiktok.com/legal/terms-of-use"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 inline-flex items-center gap-1 text-xs"
              >
                {t('dashboard.createPost.platformConfig.tiktok.consent.learnMore')}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Processing Notice (Requirement 5d) */}
        <p className="text-muted-foreground text-xs">
          {t('dashboard.createPost.platformConfig.tiktok.processingNotice')}
        </p>
      </div>
    </TooltipProvider>
  )
}

/**
 * Helper to validate TikTok config for publish button
 * Can be used by parent components
 */
export function validateTikTokConfig(
  config: TikTokConfig,
  hasVideo: boolean,
  videoDuration?: number,
  maxVideoDuration?: number
): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!config.privacyLevel) {
    errors.push('Privacy level is required')
  }

  const commercialEnabled = config.brandContentToggle || config.brandOrganicToggle
  if (commercialEnabled && !config.brandContentToggle && !config.brandOrganicToggle) {
    errors.push('Commercial content selection is required')
  }

  if (hasVideo && videoDuration && maxVideoDuration && videoDuration > maxVideoDuration) {
    errors.push(`Video duration exceeds maximum of ${maxVideoDuration} seconds`)
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}
