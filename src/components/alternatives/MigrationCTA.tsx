import { Link } from '@/components/common/LocalizedLink'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Section, SectionContent } from '@/components/common/Section'
import { SectionHeading, SectionSubtitle } from '@/components/common/Typography'
import { Button } from '@/components/ui/button'
import type { CompetitorData } from '@/data/competitors'

interface MigrationCTAProps {
  competitor: CompetitorData
}

export function MigrationCTA({ competitor }: MigrationCTAProps) {
  const { t } = useTranslation()

  return (
    <div
      className="bg-[url('/images/landing/dots.webp')] bg-cover bg-center bg-no-repeat"
      style={{ backgroundPosition: 'center 44%' }}
    >
      <Section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <SectionHeading wrap>{t('alternatives.cta.title')}</SectionHeading>
          <SectionSubtitle>{t('alternatives.cta.subtitle')}</SectionSubtitle>
        </motion.div>

        <SectionContent>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-center gap-4"
          >
            {/* Primary CTA Button */}
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link to="/login">
                  <Sparkles className="mr-2 h-5 w-5" />
                  {t('alternatives.cta.buttonText', { competitor: competitor.name })}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button variant="secondary" size="lg" asChild>
                <Link to="/login">{t('alternatives.cta.buttonTextAlt')}</Link>
              </Button>
            </div>

            {/* Microcopy */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-muted-foreground mt-2 text-sm"
            >
              {t('alternatives.cta.microcopy')}
            </motion.p>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-4 flex items-center gap-2"
            >
              {/* Avatar stack */}
              <div className="flex -space-x-2">
                {['Marcus', 'Sophia', 'David', 'Emily'].map((seed) => (
                  <img
                    key={seed}
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`}
                    alt="Grow Online user"
                    width={32}
                    height={32}
                    className="border-background bg-muted h-8 w-8 rounded-full border-2"
                  />
                ))}
              </div>
              <span className="text-muted-foreground text-sm">
                {t('alternatives.cta.socialProof', { count: 2500 })}
              </span>
            </motion.div>
          </motion.div>
        </SectionContent>
      </Section>
    </div>
  )
}
