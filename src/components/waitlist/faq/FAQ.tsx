import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/components/common/Card'
import { CardWrapper } from '@/components/common/CardWrapper'
import { Section, SectionContent } from '@/components/common/Section'
import { Paragraph, SectionHeading } from '@/components/common/Typography'

const faqKeys = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6']

export function FAQ() {
  const { t } = useTranslation()

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8" id="faq">
      <Section>
        <SectionHeading>{t('landing.faq.title')}</SectionHeading>
        <SectionContent>
          <CardWrapper>
            <dl className="grid gap-6 md:grid-cols-2">
              {faqKeys.map((key) => (
                <Card variant="extra-rounding" className="gap-4" key={key}>
                  <CardContent>
                    <Paragraph
                      as="dt"
                      color="gray-900"
                      className="mb-4 font-semibold tracking-tight"
                    >
                      {t(`landing.faq.${key}.question`)}
                    </Paragraph>
                    <dd>
                      <Paragraph>{t(`landing.faq.${key}.answer`)}</Paragraph>
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
