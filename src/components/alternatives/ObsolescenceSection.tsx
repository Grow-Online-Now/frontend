import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { AlertTriangle } from 'lucide-react'
import { Section, SectionContent } from '@/components/common/Section'
import { SectionHeading, SectionSubtitle, Paragraph } from '@/components/common/Typography'
import { Card, CardContent } from '@/components/common/Card'
import { CardWrapper } from '@/components/common/CardWrapper'
import type { CompetitorData } from '@/data/competitors'

interface ObsolescenceSectionProps {
  competitor: CompetitorData
}

export function ObsolescenceSection({ competitor }: ObsolescenceSectionProps) {
  const { t } = useTranslation()

  return (
    <Section>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
      >
        <SectionHeading wrap>
          {t('alternatives.obsolescence.title', { legacyYear: competitor.legacyYear })}
        </SectionHeading>
        <SectionSubtitle>{t('alternatives.obsolescence.subtitle')}</SectionSubtitle>
      </motion.div>

      <SectionContent>
        <CardWrapper padding="md" rounded="md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card variant="extra-rounding">
              <CardContent className="space-y-6">
                {/* Main narrative - competitor specific */}
                <Paragraph size="lg" color="gray-700" className="leading-relaxed">
                  {t(competitor.obsolescenceKey, { competitor: competitor.name })}
                </Paragraph>

                {/* Continued narrative */}
                <Paragraph color="gray-500" className="leading-relaxed">
                  {t('alternatives.obsolescence.narrativeContinued', {
                    competitor: competitor.name,
                  })}
                </Paragraph>

                {/* Callout */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  className="bg-primary/5 border-primary/20 mt-8 flex items-start gap-4 rounded-xl border p-6"
                >
                  <AlertTriangle className="text-primary mt-0.5 h-6 w-6 shrink-0" />
                  <Paragraph color="gray-900" className="font-semibold">
                    {t('alternatives.obsolescence.callout')}
                  </Paragraph>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </CardWrapper>
      </SectionContent>
    </Section>
  )
}
