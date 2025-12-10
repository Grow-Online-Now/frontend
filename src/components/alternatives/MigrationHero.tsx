import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Section, SectionContent } from '@/components/common/Section'
import { SectionHeading, SectionSubtitle } from '@/components/common/Typography'
import type { CompetitorData } from '@/data/competitors'

interface MigrationHeroProps {
  competitor: CompetitorData
}

export function MigrationHero({ competitor }: MigrationHeroProps) {
  const { t } = useTranslation()

  return (
    <Section className="relative overflow-hidden pt-24 pb-12 md:pt-32 md:pb-20">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="bg-primary/10 absolute top-0 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full blur-[150px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6 flex justify-center"
        >
          <span className="bg-primary/10 text-primary inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium">
            {t('alternatives.hero.badge', { competitor: competitor.name })}
          </span>
        </motion.div>

        {/* Title */}
        <SectionHeading wrap>
          <span className="text-foreground">{t('alternatives.hero.titlePrefix')}</span>
          <br />
          <span className="text-primary">{t('alternatives.hero.titleSuffix')}</span>
        </SectionHeading>

        {/* Subtitle */}
        <SectionSubtitle className="mx-auto mt-6 max-w-3xl">
          {t('alternatives.hero.subtitleTemplate', { competitor: competitor.name })}
        </SectionSubtitle>

        {/* Attack Tagline */}
        <SectionContent>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-muted-foreground mx-auto max-w-2xl text-lg italic"
          >
            "{t(competitor.taglineKey)}"
          </motion.p>
        </SectionContent>
      </motion.div>
    </Section>
  )
}
