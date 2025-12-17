import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { AccountBadge } from './AccountBadge'
import { PinterestBoardSettings } from './PinterestBoardSettings'
import { PlatformIcon } from '@/components/dashboard/posts/PlatformIcon'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Connection, SocialPlatform } from '@/types/connections'

interface PlatformConfig {
  id: SocialPlatform
}

interface PlatformRowProps {
  platform: PlatformConfig
  connections: Connection[]
  onConnect: (platform: SocialPlatform) => void
  onDisconnect?: (connection: Connection) => void
  onReconnect?: (connection: Connection) => void
}

export function PlatformRow({
  platform,
  connections,
  onConnect,
  onDisconnect,
  onReconnect,
}: PlatformRowProps) {
  const { t } = useTranslation()

  // Error = truly broken (expired or inactive), requires user action
  // Warning = needs refresh but will auto-refresh on next use
  const hasErrorConnection = connections.some((c) => c.isExpired || !c.isActive)
  const hasWarningConnection = !hasErrorConnection && connections.some((c) => c.needsRefresh)

  return (
    <div
      className={cn(
        'group bg-card flex items-center gap-4 rounded-xl border px-4 py-3 transition-all duration-150',
        hasErrorConnection
          ? 'border-destructive/20 bg-destructive/[0.02] hover:border-destructive/30 hover:bg-destructive/[0.04]'
          : hasWarningConnection
            ? 'border-warning/20 bg-warning/[0.02] hover:border-warning/30 hover:bg-warning/[0.04]'
            : 'border-border-subtle hover:border-border hover:bg-surface-elevated'
      )}
    >
      {/* Platform Logo */}
      <PlatformIcon
        platform={platform.id}
        size="lg"
        showBackground
        className="shrink-0 transition-transform duration-150 group-hover:scale-105"
      />

      {/* Platform Name */}
      <div className="hidden w-28 shrink-0 sm:block">
        <p className="text-foreground text-sm font-medium">
          {t(`dashboard.accounts.platforms.${platform.id}`)}
        </p>
        <p className="text-muted-foreground text-xs">
          {t('dashboard.accounts.row.accountCount', { count: connections.length })}
        </p>
      </div>

      {/* Connect Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onConnect(platform.id)}
        className="text-muted-foreground hover:border-border hover:text-foreground shrink-0 gap-1.5 rounded-lg border-dashed transition-all duration-150 hover:border-solid"
      >
        <Plus className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">{t('dashboard.accounts.row.connect')}</span>
      </Button>

      {/* Connected Accounts */}
      <div className="flex flex-1 flex-wrap items-center gap-2 py-1">
        {connections.length === 0 ? (
          <p className="text-muted-foreground/70 text-sm">
            {t('dashboard.accounts.row.noAccounts')}
          </p>
        ) : (
          connections.map((connection) => (
            <AccountBadge
              key={connection.id}
              connection={connection}
              onRemove={onDisconnect}
              onReconnect={onReconnect}
            />
          ))
        )}
      </div>

      {/* Pinterest Board Settings */}
      {platform.id === 'pinterest' && connections.length > 0 && (
        <div className="border-border-subtle w-full border-t pt-3">
          {connections.map((connection) => (
            <PinterestBoardSettings key={connection.id} connectionId={connection.id} />
          ))}
        </div>
      )}
    </div>
  )
}
