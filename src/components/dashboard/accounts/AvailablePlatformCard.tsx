import { useTranslation } from 'react-i18next'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PlatformIcon } from '@/components/dashboard/posts/PlatformIcon'
import { TooltipIcon } from '@/components/dashboard/shared/TooltipIcon'
import type { SocialPlatform } from '@/types/connections'

interface PlatformConfig {
  id: SocialPlatform
  requirements: { textKey: string }[]
}

interface AvailablePlatformCardProps {
  platform: PlatformConfig
  onConnect: (platformId: SocialPlatform) => void
}

export function AvailablePlatformCard({ platform, onConnect }: AvailablePlatformCardProps) {
  const { t } = useTranslation()

  return (
    <div className="border-border hover:border-border-emphasis flex items-center justify-between rounded-lg border p-4 transition-colors duration-150">
      {/* Platform Info */}
      <div className="flex items-center gap-3">
        <PlatformIcon platform={platform.id} size="sm" showBackground />
        <span className="text-foreground text-sm font-medium">
          {t(`dashboard.accounts.platforms.${platform.id}`)}
        </span>
        <TooltipIcon tooltipKey={`dashboard.hints.accounts.platformTips.${platform.id}`} />
      </div>

      {/* Connect Button */}
      <Button variant="default" size="sm" className="gap-1" onClick={() => onConnect(platform.id)}>
        <Plus className="h-4 w-4" />
        <span className="hidden sm:inline">{t('dashboard.accounts.row.connect')}</span>
      </Button>
    </div>
  )
}
