import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { X, Check } from 'lucide-react'
import { GlassCard } from '@/components/glass/GlassCard'

interface ComparisonFeature {
  featureKey: string
  legacy: boolean
  growonline: boolean
}

const comparisonFeatures: ComparisonFeature[] = [
  { featureKey: 'aiContentGeneration', legacy: false, growonline: true },
  { featureKey: 'intelligentScheduling', legacy: false, growonline: true },
  { featureKey: 'unifiedAnalytics', legacy: false, growonline: true },
  { featureKey: 'brandVoiceLearning', legacy: false, growonline: true },
  { featureKey: 'multiPlatform', legacy: true, growonline: true },
  { featureKey: 'competitorAnalysis', legacy: false, growonline: true },
  { featureKey: 'autoHashtags', legacy: false, growonline: true },
  { featureKey: 'basicScheduling', legacy: true, growonline: true },
  { featureKey: 'realTimeInsights', legacy: false, growonline: true },
  { featureKey: 'affordablePricing', legacy: false, growonline: true },
]

export function AlternativesComparison() {
  const { t } = useTranslation()

  return (
    <section className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8">
      {/* Background gradient */}
      <div className="absolute inset-0">
        <motion.div
          className="bg-primary/10 absolute top-0 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full blur-[120px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="text-foreground font-display mb-6 text-4xl font-black sm:text-5xl lg:text-6xl">
            {t('landing.alternatives.title')}
          </h2>
          <p className="text-muted-foreground mx-auto max-w-3xl text-lg leading-relaxed sm:text-xl">
            {t('landing.alternatives.subtitle')}
          </p>
        </motion.div>

        {/* Comparison Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 grid gap-6 md:grid-cols-3"
        >
          {/* Problem Cards */}
          <GlassCard className="border-destructive/20 p-6 md:col-span-1">
            <div className="mb-6 text-center">
              <h3 className="text-destructive mb-2 text-2xl font-bold">
                {t('landing.alternatives.legacy.title')}
              </h3>
              <p className="text-muted-foreground text-sm">
                {t('landing.alternatives.legacy.subtitle')}
              </p>
            </div>
            <ul className="space-y-3">
              {(
                t('landing.alternatives.legacy.problems', {
                  returnObjects: true,
                }) as string[]
              ).map((problem, i) => (
                <li key={i} className="text-muted-foreground flex items-start gap-2 text-sm">
                  <X className="text-destructive mt-0.5 h-5 w-5 shrink-0" />
                  <span>{problem}</span>
                </li>
              ))}
            </ul>
          </GlassCard>

          {/* Arrow/Divider */}
          <div className="hidden items-center justify-center md:flex">
            <div className="text-primary text-6xl font-light">→</div>
          </div>

          {/* GrowOnline Card */}
          <GlassCard className="border-primary/30 bg-primary/5 p-6 md:col-span-1">
            <div className="mb-6 text-center">
              <h3 className="text-primary mb-2 text-2xl font-bold">
                {t('landing.alternatives.growonline.title')}
              </h3>
              <p className="text-muted-foreground text-sm">
                {t('landing.alternatives.growonline.subtitle')}
              </p>
            </div>
            <ul className="space-y-3">
              {(
                t('landing.alternatives.growonline.solutions', {
                  returnObjects: true,
                }) as string[]
              ).map((solution, i) => (
                <li key={i} className="text-foreground flex items-start gap-2 text-sm">
                  <Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                  <span>{solution}</span>
                </li>
              ))}
            </ul>
          </GlassCard>
        </motion.div>

        {/* Feature Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <GlassCard className="overflow-hidden">
            {/* Table Header */}
            <div className="border-border/50 bg-muted/5 grid grid-cols-3 gap-4 border-b p-6">
              <div className="text-foreground font-semibold">
                {t('landing.alternatives.table.feature')}
              </div>
              <div className="text-muted-foreground text-center font-semibold">
                {t('landing.alternatives.table.legacy')}
              </div>
              <div className="text-primary text-center font-semibold">
                {t('landing.alternatives.table.growonline')}
              </div>
            </div>

            {/* Table Rows */}
            <div className="divide-border/50 divide-y">
              {comparisonFeatures.map((feature, index) => (
                <motion.div
                  key={feature.featureKey}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="hover:bg-muted/5 grid grid-cols-3 gap-4 p-6 transition-colors"
                >
                  <div className="text-foreground text-sm">
                    {t(`landing.alternatives.features.${feature.featureKey}`)}
                  </div>
                  <div className="flex justify-center">
                    {feature.legacy ? (
                      <Check className="text-muted-foreground/50 h-5 w-5" />
                    ) : (
                      <X className="text-destructive/50 h-5 w-5" />
                    )}
                  </div>
                  <div className="flex justify-center">
                    {feature.growonline ? (
                      <Check className="text-primary h-5 w-5" />
                    ) : (
                      <X className="text-destructive/50 h-5 w-5" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <p className="text-foreground text-xl font-semibold">{t('landing.alternatives.cta')}</p>
        </motion.div>
      </div>
    </section>
  )
}
