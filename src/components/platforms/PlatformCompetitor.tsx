import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Check, X, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { usePlatformConfig } from '@/lib/platforms'
import { useLocalizedHref } from '@/hooks/useLocalizedHref'

export function PlatformCompetitor() {
  const { t } = useTranslation()
  const localizeHref = useLocalizedHref()
  const config = usePlatformConfig()
  const { theme, competitor } = config

  // Comparison points - what Grow Online has vs competitors
  const comparisonPoints = [
    {
      feature: t('platforms.common.competitor.comparison.multiPlatform'),
      growOnline: true,
      competitor: false,
    },
    {
      feature: t('platforms.common.competitor.comparison.aiContent'),
      growOnline: true,
      competitor: false,
    },
    {
      feature: t('platforms.common.competitor.comparison.analytics'),
      growOnline: true,
      competitor: true,
    },
    {
      feature: t('platforms.common.competitor.comparison.scheduling'),
      growOnline: true,
      competitor: true,
    },
    {
      feature: t('platforms.common.competitor.comparison.repurposing'),
      growOnline: true,
      competitor: false,
    },
  ]

  return (
    <section id="compare" className="bg-background relative px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-4xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="font-display text-foreground mb-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            {t('platforms.common.competitor.title', { competitor: competitor.name })}
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed">
            {t(competitor.attackKey)}
          </p>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="border-border bg-card overflow-hidden rounded-2xl border"
        >
          {/* Header */}
          <div className="border-border bg-muted/30 grid grid-cols-3 gap-4 border-b px-6 py-4">
            <div className="text-muted-foreground text-sm font-medium">
              {t('platforms.common.competitor.feature')}
            </div>
            <div className={cn('text-center text-sm font-semibold', theme.accent)}>Grow Online</div>
            <div className="text-muted-foreground text-center text-sm font-medium">
              {competitor.name}
            </div>
          </div>

          {/* Rows */}
          {comparisonPoints.map((point, index) => (
            <div
              key={index}
              className={cn(
                'grid grid-cols-3 gap-4 px-6 py-4',
                index < comparisonPoints.length - 1 && 'border-border border-b'
              )}
            >
              <div className="text-foreground text-sm">{point.feature}</div>
              <div className="flex justify-center">
                {point.growOnline ? (
                  <div className="bg-primary/20 flex h-6 w-6 items-center justify-center rounded-full">
                    <Check className="text-primary h-4 w-4" />
                  </div>
                ) : (
                  <div className="bg-muted flex h-6 w-6 items-center justify-center rounded-full">
                    <X className="text-muted-foreground h-4 w-4" />
                  </div>
                )}
              </div>
              <div className="flex justify-center">
                {point.competitor ? (
                  <div className="bg-muted flex h-6 w-6 items-center justify-center rounded-full">
                    <Check className="text-muted-foreground h-4 w-4" />
                  </div>
                ) : (
                  <div className="bg-muted flex h-6 w-6 items-center justify-center rounded-full">
                    <X className="text-muted-foreground h-4 w-4" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 text-center"
        >
          <Button
            size="lg"
            className={cn(
              'h-12 rounded-xl px-8 text-base font-semibold',
              theme.primary,
              theme.primaryForeground,
              'shadow-lg transition-all duration-200 hover:opacity-90',
              theme.glowColor
            )}
            asChild
          >
            <a href={localizeHref('/signup')} className="inline-flex items-center gap-2">
              {t('platforms.common.competitor.cta')}
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
