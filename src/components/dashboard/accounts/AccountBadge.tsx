import { useTranslation } from 'react-i18next'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Chip } from '@/components/ui/chip'
import { cn } from '@/lib/utils'
import type { Connection } from '@/types/connections'

interface AccountBadgeProps {
  connection: Connection
  avatarClassName?: string
  onRemove?: (connection: Connection) => void
  onReconnect?: (connection: Connection) => void
  showStatus?: boolean
}

export function AccountBadge({
  connection,
  avatarClassName,
  onRemove,
  onReconnect,
  showStatus = true,
}: AccountBadgeProps) {
  const { t } = useTranslation()

  const displayName = connection.displayName || connection.platformUsername
  const initials = displayName.slice(0, 2).toUpperCase()
  const hasError = connection.isExpired || connection.needsRefresh || !connection.isActive

  return (
    <Chip
      variant={hasError ? 'error' : 'default'}
      onRemove={onRemove ? () => onRemove(connection) : undefined}
      removeAriaLabel={t('dashboard.accounts.actions.disconnect')}
      className={cn(
        'max-w-[200px]', // Consistent max width for all badges
        hasError && 'pr-2'
      )}
    >
      {/* Status dot */}
      {showStatus && (
        <span
          className={cn(
            'h-[6px] w-[6px] shrink-0 rounded-full',
            hasError ? 'bg-destructive animate-pulse' : 'bg-success'
          )}
        />
      )}
      <Avatar className={cn('size-5 shrink-0', avatarClassName)}>
        <AvatarFallback className="text-[10px] font-medium">{initials}</AvatarFallback>
      </Avatar>
      <span className="min-w-0 truncate text-[13px]">@{connection.platformUsername}</span>
      {/* Reconnect button for error state */}
      {hasError && onReconnect && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onReconnect(connection)
          }}
          className="text-destructive hover:bg-destructive/20 shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors"
        >
          {t('dashboard.accounts.actions.reconnect')}
        </button>
      )}
    </Chip>
  )
}
