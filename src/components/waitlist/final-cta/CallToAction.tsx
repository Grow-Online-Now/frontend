import { Link } from '@/components/common/LocalizedLink'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CallToActionProps {
  primaryTextKey?: string
  secondaryTextKey?: string
  className?: string
  buttonSize?: 'lg' | 'default' | 'sm' | 'icon' | 'icon-sm' | 'icon-lg'
}

export function CallToAction({
  primaryTextKey = 'landing.hero.ctaPrimary',
  secondaryTextKey = 'landing.hero.ctaSecondary',
  buttonSize = 'lg',
  className,
}: CallToActionProps) {
  const { t } = useTranslation()

  return (
    <div className={cn('flex items-center justify-center gap-4', className)}>
      <Button size={buttonSize} asChild>
        <Link to="/login">
          <span className="relative z-10">{t(primaryTextKey)}</span>
        </Link>
      </Button>
      <Button variant="secondary" size={buttonSize} asChild>
        <Link to="/sales" target="_blank">
          <MessageCircle />
          {t(secondaryTextKey)}
        </Link>
      </Button>
    </div>
  )
}
