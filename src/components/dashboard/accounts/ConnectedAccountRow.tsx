import { useTranslation } from 'react-i18next'
import { RotateCcw, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { PlatformIcon } from '@/components/dashboard/posts/PlatformIcon'
import type { Connection } from '@/types/connections'

interface ConnectedAccountRowProps {
  connection: Connection
  onDisconnect: (connection: Connection) => void
  onReconnect?: (connection: Connection) => void
}

export function ConnectedAccountRow({
  connection,
  onDisconnect,
  onReconnect,
}: ConnectedAccountRowProps) {
  const { t } = useTranslation()

  const hasError = connection.isExpired || !connection.isActive
  const hasWarning = !hasError && connection.needsRefresh
  const hasIssue = hasError || hasWarning

  // Get initials from display name or username
  const getInitials = () => {
    const name = connection.displayName || connection.platformUsername
    if (!name) return '?'
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="border-border flex items-center gap-3 rounded-lg border p-4 transition-colors duration-150">
      {/* Platform Icon */}
      <PlatformIcon platform={connection.platform} size="sm" showBackground />

      {/* Avatar */}
      <Avatar className="h-8 w-8">
        <AvatarImage src={connection.avatarUrl || undefined} alt={connection.platformUsername} />
        <AvatarFallback className="bg-bg-subtle text-text-secondary text-xs">
          {getInitials()}
        </AvatarFallback>
      </Avatar>

      {/* Username + Status */}
      <div className="flex flex-1 items-center gap-2 truncate">
        <span className="text-foreground truncate text-sm font-medium">
          {connection.platformUsername}
        </span>
        {hasIssue && (
          <Tooltip>
            <TooltipTrigger asChild>
              <span
                className={`h-2 w-2 flex-shrink-0 rounded-full ${
                  hasError ? 'bg-error' : 'bg-warning'
                }`}
              />
            </TooltipTrigger>
            <TooltipContent>
              {hasError
                ? t('dashboard.accounts.status.expired')
                : t('dashboard.accounts.status.needsRefresh')}
            </TooltipContent>
          </Tooltip>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1">
        {/* Reconnect Button - only show when there's an issue */}
        {hasIssue && onReconnect && (
          <Button
            variant="ghost"
            size="icon"
            className="text-warning hover:bg-warning-muted h-8 w-8"
            onClick={() => onReconnect(connection)}
            title={t('dashboard.accounts.actions.reconnect')}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        )}

        {/* Disconnect Button with Confirmation */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-error hover:bg-destructive/20 h-8 w-8 rounded-full transition-colors duration-150"
              title={t('dashboard.accounts.actions.disconnect')}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('dashboard.accounts.disconnect.title')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('dashboard.accounts.disconnect.description', {
                  platform: t(`dashboard.accounts.platforms.${connection.platform}`),
                  username: connection.platformUsername,
                })}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('common.actions.cancel')}</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDisconnect(connection)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {t('dashboard.accounts.actions.disconnect')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
