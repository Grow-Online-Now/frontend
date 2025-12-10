import { BlurFade } from '@/components/ui/blur-fade'
import { CardWrapper } from '@/components/common/CardWrapper'
import { DisplayCard } from '@/components/ui/display-card'
import { Section, SectionContent } from '@/components/common/Section'
import { SectionHeading, SectionSubtitle } from '@/components/common/Typography'
import { CalendarCheck, Sparkles, TrendingUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function FeaturesSection() {
  const { t } = useTranslation()

  return (
    <Section>
      <SectionHeading>{t('landing.features.title')}</SectionHeading>
      <SectionSubtitle>{t('landing.features.subtitle')}</SectionSubtitle>
      <SectionContent
        noMarginTop
        className="mt-5 flex flex-col items-center gap-5 sm:mx-10 md:mx-40 lg:mx-0"
      >
        <CardWrapper className="grid w-full grid-cols-1 gap-5 lg:grid-cols-3">
          <BlurFade inView>
            <DisplayCard
              titleKey="landing.features.ai.title"
              descriptionKey="landing.features.ai.description"
              icon={<Sparkles />}
            >
              <div className="pt-6 pl-6">
                <img
                  src="/images/login/1.jpg"
                  alt={t('landing.getStarted.step3.imageAlt')}
                  width={1000}
                  height={400}
                  className="overflow-hidden rounded-2xl"
                />
              </div>
            </DisplayCard>
          </BlurFade>
          <BlurFade delay={0.25} inView>
            <DisplayCard
              titleKey="landing.features.scheduling.title"
              descriptionKey="landing.features.scheduling.description"
              icon={<CalendarCheck />}
            >
              <img
                src="/images/landing/integrations.webp"
                alt={t('landing.features.scheduling.imageAlt')}
                width={1000}
                height={400}
                className="pt-6"
              />
            </DisplayCard>
          </BlurFade>
          <BlurFade delay={0.25 * 2} inView>
            <DisplayCard
              titleKey="landing.features.analytics.title"
              descriptionKey="landing.features.analytics.description"
              icon={<TrendingUp />}
            >
              <div className="pt-6 pl-6">
                <img
                  src="/images/login/1.jpg"
                  alt={t('landing.getStarted.step3.imageAlt')}
                  width={1000}
                  height={400}
                  className="overflow-hidden rounded-2xl"
                />
              </div>
            </DisplayCard>
          </BlurFade>
        </CardWrapper>
      </SectionContent>
    </Section>
  )
}
