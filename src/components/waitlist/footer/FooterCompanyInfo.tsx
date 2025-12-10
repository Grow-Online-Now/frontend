import { useTranslation } from 'react-i18next'
import { MapPin, Mail } from 'lucide-react'
import { Logo } from '@/components/ui/logo'

export function FooterCompanyInfo() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-4">
      <Logo size="md" asLink={true} href="/" />
      <p className="text-muted-foreground max-w-xs text-sm">
        {t('waitlist.footer.company.description')}
      </p>
      <div className="flex flex-col gap-2">
        <div className="text-muted-foreground flex items-start gap-2 text-sm">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
          <span>Somewhere in Paris, France</span>
        </div>
        <a
          href="mailto:hello@growonline.now"
          className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors"
        >
          <Mail className="h-4 w-4 shrink-0" />
          <span>hello@growonline.now</span>
        </a>
      </div>
    </div>
  )
}
