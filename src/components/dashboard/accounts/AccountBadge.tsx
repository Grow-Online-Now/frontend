import { useTranslation } from 'react-i18next'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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

  // Error = truly broken (expired or inactive), requires user action
  // Warning = needs refresh but will auto-refresh on next use
  const hasError = connection.isExpired || !connection.isActive
  const hasWarning = !hasError && connection.needsRefresh

  // Determine chip variant
  const chipVariant = hasError ? 'error' : hasWarning ? 'warning' : 'default'

  return (
    <Chip
      variant={chipVariant}
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
            hasError ? 'bg-destructive animate-pulse' : hasWarning ? 'bg-warning' : 'bg-success'
          )}
        />
      )}
      <Avatar className={cn('size-5 shrink-0', avatarClassName)}>
        {connection.avatarUrl && <AvatarImage src={connection.avatarUrl} alt={displayName} />}
        <AvatarFallback className="text-xs font-medium">{initials}</AvatarFallback>
      </Avatar>
      <span className="min-w-0 truncate text-sm">@{connection.platformUsername}</span>
      {/* Reconnect button for error state only (not warning - those auto-refresh) */}
      {hasError && onReconnect && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onReconnect(connection)
          }}
          className="text-destructive hover:bg-destructive/20 shrink-0 rounded px-1.5 py-0.5 text-xs font-medium transition-colors"
        >
          {t('dashboard.accounts.actions.reconnect')}
        </button>
      )}
    </Chip>
  )
}
