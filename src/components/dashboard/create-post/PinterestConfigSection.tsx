/**
 * PinterestConfigSection
 * Pinterest-specific configuration for post creation (board selection)
 */

import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Globe, Users, Lock, Loader2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PlatformIcon } from '@/components/dashboard/posts/PlatformIcon'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { usePinterestBoards } from '@/hooks/usePinterestBoards'
import type { PinterestConfig } from '@/types/posts'
import type { PinterestBoardPrivacy } from '@/types/connections'

interface PinterestConfigSectionProps {
  connectionId: string | null
  config: PinterestConfig
  onChange: (config: PinterestConfig) => void
  className?: string
}

const PRIVACY_ICONS: Record<PinterestBoardPrivacy, typeof Globe> = {
  PUBLIC: Globe,
  PROTECTED: Users,
  SECRET: Lock,
}

export function PinterestConfigSection({
  connectionId,
  config,
  onChange,
  className,
}: PinterestConfigSectionProps) {
  const { t } = useTranslation()
  const { boards, defaultBoardId, defaultBoard, isLoading, error } =
    usePinterestBoards(connectionId)

  // Current selected board (explicit or default)
  const selectedBoardId = config.boardId || 'default'

  // Build options list with default option first
  const options = useMemo(() => {
    const items: {
      value: string
      label: string
      privacy: PinterestBoardPrivacy
    }[] = []

    // Add "Use default" option if there is a default board
    if (defaultBoard) {
      items.push({
        value: 'default',
        label: t('dashboard.createPost.platformConfig.pinterest.useDefault', {
          name: defaultBoard.name,
        }),
        privacy: defaultBoard.privacy,
      })
    }

    // Add all boards
    boards.forEach((board) => {
      // Skip the default board from regular list (it's in "Use default")
      if (board.id === defaultBoardId) return

      items.push({
        value: board.id,
        label: board.name,
        privacy: board.privacy,
      })
    })

    return items
  }, [boards, defaultBoard, defaultBoardId, t])

  const handleBoardChange = (value: string) => {
    if (value === 'default') {
      // Remove override, use default
      onChange({})
    } else {
      onChange({ ...config, boardId: value })
    }
  }

  if (isLoading) {
    return (
      <div className={cn('space-y-3', className)}>
        <div className="flex items-center gap-2">
          <PlatformIcon platform="pinterest" size="xs" />
          <h4 className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            {t('dashboard.createPost.platformConfig.pinterest.title')}
          </h4>
        </div>
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          {t('dashboard.pinterest.boards.loading')}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={cn('space-y-3', className)}>
        <div className="flex items-center gap-2">
          <PlatformIcon platform="pinterest" size="xs" />
          <h4 className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            {t('dashboard.createPost.platformConfig.pinterest.title')}
          </h4>
        </div>
        <div className="text-destructive flex items-center gap-2 text-sm">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      </div>
    )
  }

  if (boards.length === 0) {
    return (
      <div className={cn('space-y-3', className)}>
        <div className="flex items-center gap-2">
          <PlatformIcon platform="pinterest" size="xs" />
          <h4 className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            {t('dashboard.createPost.platformConfig.pinterest.title')}
          </h4>
        </div>
        <p className="text-muted-foreground text-sm">{t('dashboard.pinterest.boards.noBoards')}</p>
      </div>
    )
  }

  // No default board set - show warning and require selection
  if (!defaultBoard && !config.boardId) {
    return (
      <div className={cn('space-y-3', className)}>
        <div className="flex items-center gap-2">
          <PlatformIcon platform="pinterest" size="xs" />
          <h4 className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            {t('dashboard.createPost.platformConfig.pinterest.title')}
          </h4>
        </div>
        <div className="space-y-1.5">
          <div className="border-warning/50 bg-warning/10 text-warning rounded-lg border p-2 text-xs">
            {t('dashboard.createPost.platformConfig.pinterest.noDefaultWarning')}
          </div>
          <Select value={config.boardId || ''} onValueChange={handleBoardChange}>
            <SelectTrigger className="h-9">
              <SelectValue
                placeholder={t('dashboard.createPost.platformConfig.pinterest.selectBoard')}
              />
            </SelectTrigger>
            <SelectContent>
              {boards.map((board) => {
                const PrivacyIcon = PRIVACY_ICONS[board.privacy]
                return (
                  <SelectItem key={board.id} value={board.id}>
                    <div className="flex items-center gap-2">
                      <PrivacyIcon className="text-muted-foreground h-3.5 w-3.5" />
                      <span>{board.name}</span>
                    </div>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center gap-2">
        <PlatformIcon platform="pinterest" size="xs" />
        <h4 className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          {t('dashboard.createPost.platformConfig.pinterest.title')}
        </h4>
      </div>

      {/* Board selector */}
      <div className="space-y-1.5">
        <label className="text-muted-foreground text-xs font-medium">
          {t('dashboard.createPost.platformConfig.pinterest.board')}
        </label>
        <Select value={selectedBoardId} onValueChange={handleBoardChange}>
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => {
              const PrivacyIcon = PRIVACY_ICONS[option.privacy]
              return (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <PrivacyIcon className="text-muted-foreground h-3.5 w-3.5" />
                    <span>{option.label}</span>
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
