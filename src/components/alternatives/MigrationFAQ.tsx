import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/components/common/Card'
import { CardWrapper } from '@/components/common/CardWrapper'
import { Section, SectionContent } from '@/components/common/Section'
import { Paragraph, SectionHeading, SectionSubtitle } from '@/components/common/Typography'
import type { CompetitorData } from '@/data/competitors'

interface MigrationFAQProps {
  competitor: CompetitorData
}

export function MigrationFAQ({ competitor }: MigrationFAQProps) {
  const { t } = useTranslation()

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      <Section>
        <SectionHeading>{t('alternatives.faq.title')}</SectionHeading>
        <SectionSubtitle>
          {t('alternatives.faq.subtitle', { competitor: competitor.name })}
        </SectionSubtitle>
        <SectionContent>
          <CardWrapper>
            <dl className="grid gap-6 md:grid-cols-2">
              {competitor.faqKeys.map((faqKey) => (
                <Card variant="extra-rounding" className="gap-4" key={faqKey}>
                  <CardContent>
                    <Paragraph
                      as="dt"
                      color="gray-900"
                      className="mb-4 font-semibold tracking-tight"
                    >
                      {t(`alternatives.faq.questions.${faqKey}.question`, {
                        competitor: competitor.name,
                      })}
                    </Paragraph>
                    <dd>
                      <Paragraph>
                        {t(`alternatives.faq.questions.${faqKey}.answer`, {
                          competitor: competitor.name,
                          competitorPrice: competitor.priceDisplay,
                          ourPrice: competitor.ourPriceDisplay,
                        })}
                      </Paragraph>
                    </dd>
                  </CardContent>
                </Card>
              ))}
            </dl>
          </CardWrapper>
        </SectionContent>
      </Section>
    </div>
  )
}
