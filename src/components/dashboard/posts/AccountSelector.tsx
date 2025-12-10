/**
 * AccountSelector Component
 * Multi-select for connected social accounts
 */

import { useTranslation } from 'react-i18next'
import { Check } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { PlatformIcon } from './PlatformIcon'
import { cn } from '@/lib/utils'
import type { Connection } from '@/types/connections'

interface AccountSelectorProps {
  accounts: Connection[]
  selectedIds: string[]
  onChange: (ids: string[]) => void
  isLoading?: boolean
  error?: string
  className?: string
}

export function AccountSelector({
  accounts,
  selectedIds,
  onChange,
  isLoading,
  error,
  className,
}: AccountSelectorProps) {
  const { t } = useTranslation()

  const handleToggle = (accountId: string) => {
    if (selectedIds.includes(accountId)) {
      onChange(selectedIds.filter((id) => id !== accountId))
    } else {
      onChange([...selectedIds, accountId])
    }
  }

  const handleSelectAll = () => {
    const activeAccounts = accounts.filter((a) => a.isActive && !a.isExpired && !a.needsRefresh)
    if (selectedIds.length === activeAccounts.length) {
      onChange([])
    } else {
      onChange(activeAccounts.map((a) => a.id))
    }
  }

  const activeAccountsCount = accounts.filter(
    (a) => a.isActive && !a.isExpired && !a.needsRefresh
  ).length

  if (isLoading) {
    return (
      <div className={cn('space-y-3', className)}>
        <Label className="text-[13px] font-medium">
          {t('dashboard.createPost.accounts.label')}
        </Label>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="border-border-subtle flex items-center gap-3 rounded-xl border p-3"
            >
              <div className="bg-muted h-8 w-8 animate-pulse rounded-lg" />
              <div className="flex-1 space-y-1.5">
                <div className="bg-muted h-4 w-24 animate-pulse rounded" />
                <div className="bg-muted h-3 w-16 animate-pulse rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (accounts.length === 0) {
    return (
      <div className={cn('space-y-3', className)}>
        <Label className="text-[13px] font-medium">
          {t('dashboard.createPost.accounts.label')}
        </Label>
        <p className="text-muted-foreground text-sm">
          {t('dashboard.createPost.accounts.noAccounts')}
        </p>
      </div>
    )
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <Label className="text-[13px] font-medium">
          {t('dashboard.createPost.accounts.label')}
        </Label>
        {activeAccountsCount > 1 && (
          <button
            type="button"
            onClick={handleSelectAll}
            className="text-primary text-xs font-medium transition-opacity hover:opacity-80"
          >
            {selectedIds.length === activeAccountsCount
              ? t('dashboard.createPost.accounts.deselectAll')
              : t('dashboard.createPost.accounts.selectAll')}
          </button>
        )}
      </div>
      <div className="border-border-subtle bg-card rounded-xl border p-2">
        <div className="space-y-1">
          {accounts.map((account) => {
            const isSelected = selectedIds.includes(account.id)
            const isDisabled = !account.isActive || account.isExpired || account.needsRefresh

            return (
              <div
                key={account.id}
                className={cn(
                  'flex cursor-pointer items-center gap-3 rounded-lg p-2.5 transition-all duration-150',
                  isSelected && !isDisabled && 'bg-primary/8',
                  !isSelected && !isDisabled && 'hover:bg-surface-elevated',
                  isDisabled && 'cursor-not-allowed opacity-50'
                )}
                onClick={() => !isDisabled && handleToggle(account.id)}
              >
                {/* Custom checkbox */}
                <div
                  className={cn(
                    'flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border-2 transition-all duration-150',
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
                    {account.displayName || `@${account.platformUsername}`}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {t(`dashboard.accounts.platforms.${account.platform}`)}
                  </p>
                </div>

                {/* Disabled state message */}
                {isDisabled && (
                  <span className="text-destructive/80 text-[11px] font-medium">
                    {t('dashboard.createPost.accounts.reconnectRequired')}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>
      {error && <p className="text-destructive text-xs">{error}</p>}
    </div>
  )
}
