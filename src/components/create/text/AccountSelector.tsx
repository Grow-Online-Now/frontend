/**
 * AccountSelector Component
 * Horizontal row of toggleable account avatars with animated selection ring
 * For Step 1 of the text-first post creation flow
 */

import { useTranslation } from 'react-i18next'
import { Check, Eye, FolderOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { AccountAvatar } from '@/components/common/AccountAvatar'
import { ValidationWarnings } from './ValidationWarnings'
import type { PlatformWithValidation, ValidationWarning } from '@/types/create'

interface AccountSelectorProps {
  accounts: PlatformWithValidation[]
  selectedIds: string[]
  onToggle: (id: string) => void
  validations?: ValidationWarning[]
  onShortenWithAI?: (platformId: string) => void
  onOpenPreview?: () => void
  onOpenLibrary?: () => void
  className?: string
}

export function AccountSelector({
  accounts,
  selectedIds,
  onToggle,
  validations = [],
  onShortenWithAI,
  onOpenPreview,
  onOpenLibrary,
  className,
}: AccountSelectorProps) {
  const { t } = useTranslation()

  if (accounts.length === 0) {
    return (
      <div className={cn('rounded-xl py-4', className)}>
        <div className="text-center">
          <p className="text-muted-foreground text-sm">
            {t('dashboard.create.text.accountSelector.noAccounts')}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* Header with title and mobile action buttons */}
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
          {t('dashboard.create.text.accountSelector.title')}
        </span>
        {/* Mobile action buttons */}
        <div className="flex items-center gap-1 lg:hidden">
          {onOpenLibrary && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onOpenLibrary}
              className="text-muted-foreground hover:text-foreground h-8 gap-1.5"
            >
              <FolderOpen className="h-4 w-4" />
              {t('dashboard.create.text.mediaPanel.browse')}
            </Button>
          )}
          {onOpenPreview && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onOpenPreview}
              className="text-muted-foreground hover:text-foreground h-8 gap-1.5"
            >
              <Eye className="h-4 w-4" />
              {t('dashboard.create.text.preview.openPreview')}
            </Button>
          )}
        </div>
      </div>

      {/* Horizontal scrollable account avatars */}
      <TooltipProvider delayDuration={300}>
        <div className="scrollbar-none flex gap-4 overflow-x-auto py-1">
          {accounts.map((account) => {
            const isSelected = selectedIds.includes(account.id)
            const displayName = account.displayName || account.platformUsername

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
                    {isSelected && (
                      <div className="bg-foreground absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full">
                        <Check className="text-background size-2.5" strokeWidth={3} />
                      </div>
                    )}

                    {/* Character count indicator */}
                    {isSelected && account.isOverLimit && (
                      <div className="bg-error/10 text-error absolute -top-1 -left-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium">
                        +{account.characterCount - account.characterLimit}
                      </div>
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-center">
                  <p className="font-medium">{displayName}</p>
                  <p className="text-muted-foreground text-xs">@{account.platformUsername}</p>
                </TooltipContent>
              </Tooltip>
            )
          })}
        </div>
      </TooltipProvider>

      {/* Validation warnings */}
      {validations.length > 0 && (
        <ValidationWarnings
          warnings={validations}
          onShortenWithAI={onShortenWithAI}
          className="mt-2"
        />
      )}
    </div>
  )
}
