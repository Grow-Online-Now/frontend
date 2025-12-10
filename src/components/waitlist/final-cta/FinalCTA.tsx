import { useTranslation } from 'react-i18next'
import { CallToAction } from '@/components/waitlist/final-cta/CallToAction'
import { Section, SectionContent } from '@/components/common/Section'
import { SectionHeading, SectionSubtitle } from '@/components/common/Typography'

export function FinalCTA() {
  const { t } = useTranslation()

  return (
    <div
      className="bg-[url('/images/landing/dots.webp')] bg-cover bg-center bg-no-repeat"
      style={{ backgroundPosition: 'center 44%' }}
    >
      <Section>
        <SectionHeading>
          {t('landing.finalCta.titleLine1')}
          <br />
          {t('landing.finalCta.titleLine2')}
        </SectionHeading>
        <SectionSubtitle>{t('landing.finalCta.subtitle')}</SectionSubtitle>
        <SectionContent>
          <CallToAction
            primaryTextKey="landing.finalCta.ctaPrimary"
            secondaryTextKey="landing.finalCta.ctaSecondary"
            buttonSize="lg"
            className="mt-6"
          />
        </SectionContent>
      </Section>
    </div>
  )
}
