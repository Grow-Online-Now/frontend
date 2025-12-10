import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { X, Sparkles, Zap } from 'lucide-react'
import { Section, SectionContent } from '@/components/common/Section'
import { SectionHeading, SectionSubtitle } from '@/components/common/Typography'
import { Card, CardContent } from '@/components/common/Card'
import { CardWrapper } from '@/components/common/CardWrapper'
import type { CompetitorData } from '@/data/competitors'

interface KillTableProps {
  competitor: CompetitorData
}

const featureKeys = [
  'contentCreation',
  'analytics',
  'workflow',
  'platformStrategy',
  'brandVoice',
  'hashtagStrategy',
  'bestTimePosting',
  'contentRepurposing',
  'pricing',
]

export function KillTable({ competitor }: KillTableProps) {
  const { t } = useTranslation()

  return (
    <Section>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
      >
        <SectionHeading wrap>{t('alternatives.killTable.title')}</SectionHeading>
        <SectionSubtitle>{t('alternatives.killTable.subtitle')}</SectionSubtitle>
      </motion.div>

      <SectionContent>
        <CardWrapper padding="xs-2" rounded="sm">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card variant="extra-rounding" className="overflow-hidden">
              {/* Table Header */}
              <div className="border-border/50 bg-muted/30 grid grid-cols-1 gap-2 border-b p-4 md:grid-cols-3 md:gap-4 md:p-6">
                <div className="text-foreground hidden font-semibold md:block">
                  {t('alternatives.killTable.headers.feature')}
                </div>
                <div className="text-destructive text-center font-semibold">
                  {t('alternatives.killTable.headers.oldWay', { competitor: competitor.name })}
                </div>
                <div className="text-primary text-center font-semibold">
                  {t('alternatives.killTable.headers.newWay')}
                </div>
              </div>

              {/* Table Body */}
              <CardContent className="p-0">
                <div className="divide-border/50 divide-y">
                  {featureKeys.map((featureKey, index) => (
                    <motion.div
                      key={featureKey}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-muted/5 grid grid-cols-1 gap-4 p-4 transition-colors md:grid-cols-3 md:p-6"
                    >
                      {/* Feature Name */}
                      <div className="text-foreground text-center font-medium md:text-left">
                        {t(`alternatives.killTable.features.${featureKey}.name`)}
                      </div>

                      {/* Competitor (Old Way) */}
                      <div className="flex items-center justify-center gap-2">
                        <X className="text-destructive/70 h-5 w-5 shrink-0" />
                        <span className="text-muted-foreground text-sm">
                          {featureKey === 'pricing'
                            ? competitor.priceDisplay
                            : t(`alternatives.killTable.features.${featureKey}.old`)}
                        </span>
                      </div>

                      {/* Grow Online (New Way) */}
                      <div className="flex items-center justify-center gap-2">
                        {featureKey === 'workflow' ? (
                          <Zap className="text-primary h-5 w-5 shrink-0" />
                        ) : (
                          <Sparkles className="text-primary h-5 w-5 shrink-0" />
                        )}
                        <span className="text-foreground text-sm font-medium">
                          {featureKey === 'pricing'
                            ? competitor.ourPriceDisplay
                            : t(`alternatives.killTable.features.${featureKey}.new`)}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </CardWrapper>
      </SectionContent>
    </Section>
  )
}
