/**
 * AccountSelector Component
 * Horizontal row of toggleable account cards with validation warnings
 * For Step 1 of the text-first post creation flow
 */

import { useTranslation } from 'react-i18next'
import { Check, Eye, FolderOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
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
      <div className={cn('border-border bg-surface-subtle rounded-xl border p-4', className)}>
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
      {/* Header with title and mobile preview button */}
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

      {/* Horizontal scrollable account cards */}
      <div className="scrollbar-none flex gap-3 overflow-x-auto pb-1">
        {accounts.map((account) => {
          const isSelected = selectedIds.includes(account.id)

          return (
            <button
              key={account.id}
              type="button"
              onClick={() => onToggle(account.id)}
              className={cn(
                'group relative flex shrink-0 flex-col items-center gap-2 rounded-xl p-3',
                'min-w-[100px] border transition-all duration-150',
                // Selected state
                isSelected && 'border-foreground bg-surface-elevated',
                // Unselected state
                !isSelected &&
                  'border-border bg-surface-subtle hover:border-border-emphasis hover:bg-surface-hover'
              )}
            >
              {/* Avatar with platform badge */}
              <div className="relative">
                <AccountAvatar
                  src={null}
                  platform={account.platform}
                  name={account.platformUsername}
                  size="lg"
                />
                {/* Selection checkmark overlay */}
                {isSelected && (
                  <div className="bg-foreground ring-surface-elevated absolute -right-1 -bottom-1 flex h-5 w-5 items-center justify-center rounded-full ring-2">
                    <Check className="text-background h-3 w-3" />
                  </div>
                )}
              </div>

              {/* Account info */}
              <div className="w-full text-center">
                <div className="text-foreground truncate text-xs font-medium">
                  {account.displayName || account.platformUsername}
                </div>
                <div className="text-muted-foreground truncate text-[11px]">
                  @{account.platformUsername}
                </div>
              </div>

              {/* Character count indicator - only when selected */}
              {isSelected && (
                <div
                  className={cn(
                    'absolute -top-1 -right-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium',
                    account.isOverLimit && 'bg-error/10 text-error',
                    account.isNearLimit && !account.isOverLimit && 'bg-warning/10 text-warning',
                    !account.isOverLimit && !account.isNearLimit && 'bg-success/10 text-success'
                  )}
                >
                  {account.characterCount > account.characterLimit && (
                    <span>+{account.characterCount - account.characterLimit}</span>
                  )}
                </div>
              )}
            </button>
          )
        })}
      </div>

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
