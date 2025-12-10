/**
 * PlatformSelector Component
 * Platform selection for Create Post page with checkbox-style selection
 */

import { useTranslation } from 'react-i18next'
import { Check } from 'lucide-react'
import { PlatformIcon } from '@/components/dashboard/posts/PlatformIcon'
import { cn } from '@/lib/utils'
import type { Connection } from '@/types/connections'

interface PlatformSelectorProps {
  accounts: Connection[]
  selectedIds: string[]
  onChange: (ids: string[]) => void
  isLoading?: boolean
  className?: string
}

export function PlatformSelector({
  accounts,
  selectedIds,
  onChange,
  isLoading,
  className,
}: PlatformSelectorProps) {
  const { t } = useTranslation()

  const handleToggle = (accountId: string) => {
    if (selectedIds.includes(accountId)) {
      onChange(selectedIds.filter((id) => id !== accountId))
    } else {
      onChange([...selectedIds, accountId])
    }
  }

  const selectedCount = selectedIds.length

  if (isLoading) {
    return (
      <div className={cn('space-y-3', className)}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 rounded-lg p-2.5">
            <div className="bg-muted h-5 w-5 animate-pulse rounded-md" />
            <div className="bg-muted h-9 w-9 animate-pulse rounded-xl" />
            <div className="flex-1 space-y-1.5">
              <div className="bg-muted h-4 w-24 animate-pulse rounded" />
              <div className="bg-muted h-3 w-16 animate-pulse rounded" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-muted-foreground text-[11px] font-medium tracking-wide uppercase">
          {t('dashboard.createPost.platforms.title')}
        </h3>
        <span className="text-muted-foreground/60 text-xs">
          {t('dashboard.createPost.platforms.selected', { count: selectedCount })}
        </span>
      </div>

      <div className="space-y-1">
        {accounts.map((account) => {
          const isSelected = selectedIds.includes(account.id)
          const isDisabled = !account.isActive || account.isExpired || account.needsRefresh

          return (
            <div
              key={account.id}
              className={cn(
                'group flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-150',
                isSelected && !isDisabled && 'bg-primary/8',
                !isSelected && !isDisabled && 'hover:bg-surface-elevated',
                isDisabled && 'cursor-not-allowed opacity-50'
              )}
              onClick={() => !isDisabled && handleToggle(account.id)}
            >
              {/* Checkbox */}
              <div
                className={cn(
                  'flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all duration-150',
                  isSelected ? 'border-primary bg-primary' : 'border-border-muted'
                )}
              >
                <Check
                  className={cn(
                    'h-3 w-3 text-white transition-all duration-150',
                    isSelected ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
                  )}
                  strokeWidth={3}
                />
              </div>

              {/* Platform icon */}
              <PlatformIcon platform={account.platform} size="sm" showBackground />

              {/* Account info */}
              <div className="min-w-0 flex-1">
                <p className="text-foreground truncate text-sm font-medium">
                  {account.displayName || account.platformUsername}
                </p>
                <p className="text-muted-foreground truncate text-xs">
                  @{account.platformUsername}
                </p>
              </div>

              {/* Reconnect badge */}
              {isDisabled && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    // TODO: Handle reconnect
                  }}
                  className="bg-destructive/10 text-destructive hover:bg-destructive/20 rounded-md px-2 py-1 text-[11px] font-medium transition-colors"
                >
                  {t('dashboard.createPost.platforms.reconnect')}
                </button>
              )}
            </div>
          )
        })}

        {accounts.length === 0 && (
          <p className="text-muted-foreground py-4 text-center text-sm">
            {t('dashboard.createPost.platforms.noAccounts')}
          </p>
        )}
      </div>
    </div>
  )
}
