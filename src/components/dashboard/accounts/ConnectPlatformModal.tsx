import { useTranslation } from 'react-i18next'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Shield, CircleHelp, ExternalLink, Check } from 'lucide-react'
import { PlatformIcon } from '@/components/dashboard/posts/PlatformIcon'
import type { SocialPlatform } from '@/types/connections'

interface PlatformRequirement {
  textKey: string
}

interface PlatformConfig {
  id: SocialPlatform
  requirements: PlatformRequirement[]
}

interface ConnectPlatformModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  platform: PlatformConfig | null
  onContinue: (platform: SocialPlatform) => void
}

export function ConnectPlatformModal({
  open,
  onOpenChange,
  platform,
  onContinue,
}: ConnectPlatformModalProps) {
  const { t } = useTranslation()

  if (!platform) return null

  const handleContinue = () => {
    onOpenChange(false)
    onContinue(platform.id)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center text-center">
          {/* Platform Icon */}
          <div className="mb-2">
            <PlatformIcon platform={platform.id} size="lg" className="size-16" />
          </div>
          <DialogTitle className="text-xl">
            {t('dashboard.accounts.connectModal.title', {
              platform: t(`dashboard.accounts.platforms.${platform.id}`),
            })}
          </DialogTitle>
          <DialogDescription>{t('dashboard.accounts.connectModal.subtitle')}</DialogDescription>
        </DialogHeader>

        {/* Requirements List */}
        <div className="space-y-3 py-2">
          {platform.requirements.map((req, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="bg-primary/10 mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full">
                <Check className="text-primary h-3 w-3" />
              </div>
              <p className="text-foreground text-sm">{t(req.textKey)}</p>
            </div>
          ))}
        </div>

        {/* Continue Button */}
        <Button onClick={handleContinue} className="w-full gap-2">
          {t('dashboard.accounts.connectModal.continue', {
            platform: t(`dashboard.accounts.platforms.${platform.id}`),
          })}
          <ExternalLink className="h-4 w-4" />
        </Button>

        {/* Privacy Notice */}
        <div className="bg-muted/50 flex items-start gap-2 rounded-lg p-3">
          <Shield className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
          <p className="text-muted-foreground text-xs">
            {t('dashboard.accounts.connectModal.privacyNotice')}
          </p>
        </div>

        {/* Help Section */}
        <div className="border-border flex items-center justify-center gap-4 border-t pt-4">
          <div className="text-muted-foreground flex items-center gap-1.5 text-sm">
            <CircleHelp className="h-4 w-4" />
            <span>{t('dashboard.accounts.connectModal.havingIssues')}</span>
          </div>
          <a
            href="mailto:support@growonline.now"
            className="text-primary text-sm font-medium hover:underline"
          >
            {t('dashboard.accounts.connectModal.contactSupport')}
          </a>
        </div>
      </DialogContent>
    </Dialog>
  )
}
