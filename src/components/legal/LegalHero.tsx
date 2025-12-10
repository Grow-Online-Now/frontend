import { useTranslation } from 'react-i18next'
import { SectionHeading, SectionSubtitle } from '@/components/common/Typography'
import { cn } from '@/lib/utils'

interface LegalHeroProps {
  titleKey: string
  subtitleKey: string
  icon: React.ReactNode
  lastUpdated: string
  iconColorClass?: string
  className?: string
}

export function LegalHero({ titleKey, subtitleKey, lastUpdated, className }: LegalHeroProps) {
  const { t } = useTranslation()

  const formattedDate = new Date(lastUpdated).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <header className={cn('mb-10 space-y-6 text-center', className)}>
      <div className="flex flex-col items-center gap-4">
        <div className="space-y-2">
          <SectionHeading>{t(titleKey)}</SectionHeading>
          <SectionSubtitle>{t(subtitleKey)}</SectionSubtitle>
          <p className="text-muted-foreground text-sm">
            {t('legal.common.lastUpdated')}: {formattedDate}
          </p>
        </div>
      </div>
    </header>
  )
}
