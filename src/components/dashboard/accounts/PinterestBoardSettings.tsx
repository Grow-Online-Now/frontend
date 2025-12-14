/**
 * PinterestBoardSettings
 * Inline board management for Pinterest connections on Accounts page
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RefreshCw, Check, Globe, Users, Lock, ChevronDown, ChevronUp, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { usePinterestBoards } from '@/hooks/usePinterestBoards'
import type { PinterestBoardPrivacy } from '@/types/connections'

interface PinterestBoardSettingsProps {
  connectionId: string
  className?: string
}

const PRIVACY_ICONS: Record<PinterestBoardPrivacy, typeof Globe> = {
  PUBLIC: Globe,
  PROTECTED: Users,
  SECRET: Lock,
}

export function PinterestBoardSettings({ connectionId, className }: PinterestBoardSettingsProps) {
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)
  const {
    boards,
    defaultBoardId,
    isLoading,
    isRefreshing,
    isSettingDefault,
    error,
    setDefaultBoard,
    refresh,
  } = usePinterestBoards(connectionId)

  const handleSetDefault = async (boardId: string) => {
    await setDefaultBoard(boardId)
  }

  if (isLoading) {
    return (
      <div className={cn('py-2', className)}>
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          {t('dashboard.pinterest.boards.loading')}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={cn('py-2', className)}>
        <div className="text-destructive text-sm">{error}</div>
        <Button variant="ghost" size="sm" onClick={refresh} className="mt-1">
          {t('dashboard.pinterest.boards.retry')}
        </Button>
      </div>
    )
  }

  if (boards.length === 0) {
    return (
      <div className={cn('py-2', className)}>
        <p className="text-muted-foreground text-sm">{t('dashboard.pinterest.boards.noBoards')}</p>
      </div>
    )
  }

  const defaultBoard = boards.find((b) => b.id === defaultBoardId)

  return (
    <div className={cn('', className)}>
      {/* Header: toggle + refresh */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-foreground flex items-center gap-2 text-sm font-medium"
        >
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          {t('dashboard.pinterest.boards.title')}
        </button>

        <Button
          variant="ghost"
          size="sm"
          onClick={refresh}
          disabled={isRefreshing}
          className="h-8 gap-1.5 px-2"
        >
          <RefreshCw className={cn('h-3.5 w-3.5', isRefreshing && 'animate-spin')} />
          {t('dashboard.pinterest.boards.refresh')}
        </Button>
      </div>

      {/* Current default */}
      <p className="text-muted-foreground mt-1 text-xs">
        {defaultBoard
          ? t('dashboard.pinterest.boards.currentDefault', { name: defaultBoard.name })
          : t('dashboard.pinterest.boards.noDefault')}
      </p>

      {/* Expanded board list */}
      {isExpanded && (
        <div className="mt-3 max-h-48 space-y-1.5 overflow-y-auto">
          {boards.map((board) => {
            const PrivacyIcon = PRIVACY_ICONS[board.privacy]
            const isDefault = board.id === defaultBoardId

            return (
              <button
                key={board.id}
                type="button"
                onClick={() => !isDefault && handleSetDefault(board.id)}
                disabled={isSettingDefault}
                className={cn(
                  'flex w-full items-center gap-2 rounded-lg border p-2 text-left transition-colors',
                  isDefault
                    ? 'border-primary/40 bg-primary/5'
                    : 'border-border-subtle hover:border-border hover:bg-surface-elevated'
                )}
              >
                <PrivacyIcon className="text-muted-foreground h-4 w-4 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-foreground truncate text-sm font-medium">{board.name}</p>
                  <p className="text-muted-foreground text-xs">
                    {t(`dashboard.pinterest.boards.privacy.${board.privacy}`)}
                  </p>
                </div>
                {isDefault && <Check className="text-primary h-4 w-4 shrink-0" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
