/**
 * MediaAccountSelector Component
 * Horizontal row of toggleable account avatars for media-first platforms
 * Shows media validation indicators (media required, wrong type, etc.)
 */

import { useTranslation } from 'react-i18next'
import { Check, Eye, FolderOpen, ImageOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { AccountAvatar } from '@/components/common/AccountAvatar'
import type { MediaPlatformWithValidation, MediaFlowValidationWarning } from '@/types/create'
import type { SocialPlatform } from '@/types/connections'

// Platform display names for tooltips
const PLATFORM_NAMES: Record<SocialPlatform, string> = {
  twitter: 'X (Twitter)',
  linkedin: 'LinkedIn',
  facebook: 'Facebook',
  instagram: 'Instagram',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  pinterest: 'Pinterest',
  bluesky: 'Bluesky',
  threads: 'Threads',
}

interface MediaAccountSelectorProps {
  accounts: MediaPlatformWithValidation[]
  selectedIds: string[]
  onToggle: (id: string) => void
  validations?: MediaFlowValidationWarning[]
  onOpenPreview?: () => void
  onOpenLibrary?: () => void
  unconnectedPlatforms?: SocialPlatform[]
  onConnectPlatform?: () => void
  className?: string
}

export function MediaAccountSelector({
  accounts,
  selectedIds,
  onToggle,
  validations = [],
  onOpenPreview,
  onOpenLibrary,
  unconnectedPlatforms = [],
  onConnectPlatform,
  className,
}: MediaAccountSelectorProps) {
  const { t } = useTranslation()

  if (accounts.length === 0 && unconnectedPlatforms.length === 0) {
    return (
      <div className={cn('rounded-xl py-4', className)}>
        <div className="text-center">
          <p className="text-text-muted text-sm">
            {t('dashboard.create.media.accountSelector.noAccounts')}
          </p>
        </div>
      </div>
    )
  }

  // Get validation warnings for a specific account
  const getAccountWarnings = (accountId: string) => {
    return validations.filter((v) => v.platformId === accountId)
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* Header with title and mobile action buttons */}
      <div className="flex items-center justify-between">
        <span className="text-text-muted text-xs font-medium tracking-wider uppercase">
          {t('dashboard.create.media.accountSelector.title')}
        </span>
        {/* Mobile action buttons */}
        <div className="flex items-center gap-1 lg:hidden">
          {onOpenLibrary && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onOpenLibrary}
              className="text-text-muted hover:text-text-primary h-8 gap-1.5"
            >
              <FolderOpen className="h-4 w-4" />
              {t('dashboard.create.media.mediaPanel.browse')}
            </Button>
          )}
          {onOpenPreview && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onOpenPreview}
              className="text-text-muted hover:text-text-primary h-8 gap-1.5"
            >
              <Eye className="h-4 w-4" />
              {t('dashboard.create.media.preview.openPreview')}
            </Button>
          )}
        </div>
      </div>

      {/* Horizontal scrollable account avatars */}
      <TooltipProvider delayDuration={300}>
        <div className="scrollbar-none flex gap-4 overflow-x-auto py-1">
          {/* Connected accounts */}
          {accounts.map((account) => {
            const isSelected = selectedIds.includes(account.id)
            const displayName = account.displayName || account.platformUsername
            const accountWarnings = getAccountWarnings(account.id)
            const hasMediaWarning = accountWarnings.some(
              (w) => w.type === 'media_required' || w.type === 'wrong_media_type'
            )

            return (
              <Tooltip key={account.id}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => onToggle(account.id)}
                    className="group relative shrink-0 focus-visible:outline-none"
                  >
                    {/* Avatar */}
                    <div
                      className={cn(
                        'transition-opacity duration-150',
                        isSelected ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'
                      )}
                    >
                      <AccountAvatar
                        src={account.avatarUrl}
                        platform={account.platform}
                        name={account.platformUsername}
                        size="lg"
                      />
                    </div>

                    {/* Selection checkmark */}
                    {isSelected && !hasMediaWarning && (
                      <div className="bg-text-primary absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full">
                        <Check className="text-bg-base size-2.5" strokeWidth={3} />
                      </div>
                    )}

                    {/* Media warning indicator */}
                    {isSelected && hasMediaWarning && (
                      <div className="bg-warning absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full">
                        <ImageOff className="text-bg-base size-2.5" strokeWidth={3} />
                      </div>
                    )}

                    {/* Character over limit indicator */}
                    {isSelected && account.isOverLimit && (
                      <div className="bg-error/10 text-error absolute -top-1 -left-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium">
                        +{account.characterCount - account.characterLimit}
                      </div>
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-center">
                  <p className="font-medium">{displayName}</p>
                  <p className="text-text-muted text-xs">@{account.platformUsername}</p>
                  {isSelected && hasMediaWarning && (
                    <p className="text-warning mt-1 text-xs">
                      {t('dashboard.create.media.accountSelector.mediaRequired')}
                    </p>
                  )}
                </TooltipContent>
              </Tooltip>
            )
          })}

          {/* Unconnected platforms */}
          {unconnectedPlatforms.map((platform) => (
            <Tooltip key={platform}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={onConnectPlatform}
                  className="group relative shrink-0 focus-visible:outline-none"
                >
                  <div className="opacity-50 transition-opacity duration-150 group-hover:opacity-80">
                    <AccountAvatar platform={platform} size="lg" isUnconnected />
                  </div>
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-center">
                <p className="font-medium">
                  {t('dashboard.create.media.accountSelector.connect')} {PLATFORM_NAMES[platform]}
                </p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>

      {/* Validation warnings summary */}
      {validations.length > 0 && selectedIds.length > 0 && (
        <div className="bg-warning/10 text-warning rounded-lg px-3 py-2 text-sm">
          {validations.map((warning, idx) => (
            <p key={`${warning.platformId}-${warning.type}-${idx}`}>
              {t(warning.messageKey, warning.messageParams)}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}
