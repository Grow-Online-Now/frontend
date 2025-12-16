/**
 * AccountSelector Component
 * Horizontal row of toggleable account avatars with animated selection ring
 * For Step 1 of the text-first post creation flow
 */

import { useTranslation } from 'react-i18next'
import { Eye, FolderOpen } from 'lucide-react'
import { motion } from 'framer-motion'
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
        <div className="scrollbar-none flex gap-4 overflow-x-auto pb-1">
          {accounts.map((account) => {
            const isSelected = selectedIds.includes(account.id)
            const displayName = account.displayName || account.platformUsername

            return (
              <Tooltip key={account.id}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => onToggle(account.id)}
                    className={cn(
                      'group relative shrink-0 rounded-full p-1',
                      'transition-transform duration-150',
                      'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
                    )}
                  >
                    {/* Selection ring - animated */}
                    <motion.div
                      className="border-foreground pointer-events-none absolute inset-0 rounded-full border-2"
                      initial={false}
                      animate={{
                        scale: isSelected ? 1 : 0.85,
                        opacity: isSelected ? 1 : 0,
                      }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                    />

                    {/* Avatar */}
                    <div
                      className={cn(
                        'transition-opacity duration-150',
                        !isSelected && 'opacity-60 group-hover:opacity-100'
                      )}
                    >
                      <AccountAvatar
                        src={null}
                        platform={account.platform}
                        name={account.platformUsername}
                        size="lg"
                      />
                    </div>

                    {/* Character count indicator - only when over limit */}
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
