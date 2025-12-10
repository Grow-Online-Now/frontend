/**
 * PlatformFilterDropdown Component
 * Dropdown filter for selecting platforms
 */

import { useTranslation } from 'react-i18next'
import { Filter, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { PlatformIcon } from './PlatformIcon'
import { cn } from '@/lib/utils'
import type { SocialPlatform } from '@/types/connections'

interface PlatformFilterDropdownProps {
  selectedPlatform: SocialPlatform | undefined
  onPlatformChange: (platform: SocialPlatform | undefined) => void
  className?: string
}

const PLATFORMS: SocialPlatform[] = [
  'youtube',
  'instagram',
  'tiktok',
  'twitter',
  'linkedin',
  'facebook',
  'pinterest',
]

export function PlatformFilterDropdown({
  selectedPlatform,
  onPlatformChange,
  className,
}: PlatformFilterDropdownProps) {
  const { t } = useTranslation()

  const hasFilter = selectedPlatform !== undefined

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={hasFilter ? 'secondary' : 'outline'}
          size="sm"
          className={cn('gap-2', className)}
        >
          <Filter className="size-4" />
          {hasFilter ? (
            <>
              <PlatformIcon platform={selectedPlatform} size="xs" />
              <span>{t(`dashboard.accounts.platforms.${selectedPlatform}`)}</span>
            </>
          ) : (
            <span>{t('dashboard.posts.filters.platform')}</span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {PLATFORMS.map((platform) => (
          <DropdownMenuItem
            key={platform}
            onClick={() => onPlatformChange(platform === selectedPlatform ? undefined : platform)}
            className="gap-2"
          >
            <PlatformIcon platform={platform} size="xs" />
            <span className="flex-1">{t(`dashboard.accounts.platforms.${platform}`)}</span>
            {selectedPlatform === platform && <Check className="text-primary size-4" />}
          </DropdownMenuItem>
        ))}
        {hasFilter && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onPlatformChange(undefined)}
              className="text-muted-foreground gap-2"
            >
              <X className="size-4" />
              <span>{t('dashboard.posts.filters.clearFilters')}</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
