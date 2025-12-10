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

  const isDarkTheme = config.slug === 'tiktok' || config.slug === 'x'

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
    <section
      id="compare"
      className={cn(
        'relative px-4 py-24 sm:px-6 lg:px-8 lg:py-32',
        isDarkTheme ? 'bg-zinc-950' : 'bg-background'
      )}
    >
      <div className="mx-auto max-w-4xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2
            className={cn(
              'font-display mb-4 text-3xl font-semibold tracking-tight sm:text-4xl',
              isDarkTheme ? 'text-white' : 'text-foreground'
            )}
          >
            {t('platforms.common.competitor.title', { competitor: competitor.name })}
          </h2>
          <p
            className={cn(
              'mx-auto max-w-2xl text-lg leading-relaxed',
              isDarkTheme ? 'text-zinc-400' : 'text-muted-foreground'
            )}
          >
            {t(competitor.attackKey)}
          </p>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={cn(
            'overflow-hidden rounded-2xl border',
            isDarkTheme ? 'border-zinc-800 bg-zinc-900/50' : 'border-border bg-card'
          )}
        >
          {/* Header */}
          <div
            className={cn(
              'grid grid-cols-3 gap-4 border-b px-6 py-4',
              isDarkTheme ? 'border-zinc-800 bg-zinc-900' : 'border-border bg-muted/30'
            )}
          >
            <div
              className={cn(
                'text-sm font-medium',
                isDarkTheme ? 'text-zinc-400' : 'text-muted-foreground'
              )}
            >
              {t('platforms.common.competitor.feature')}
            </div>
            <div
              className={cn(
                'text-center text-sm font-semibold',
                config.slug === 'tiktok'
                  ? 'text-[#FF0050]'
                  : config.slug === 'x'
                    ? 'text-white'
                    : config.slug === 'instagram'
                      ? 'text-[#E1306C]'
                      : theme.accent
              )}
            >
              Grow Online
            </div>
            <div
              className={cn(
                'text-center text-sm font-medium',
                isDarkTheme ? 'text-zinc-500' : 'text-muted-foreground'
              )}
            >
              {competitor.name}
            </div>
          </div>

          {/* Rows */}
          {comparisonPoints.map((point, index) => (
            <div
              key={index}
              className={cn(
                'grid grid-cols-3 gap-4 px-6 py-4',
                index < comparisonPoints.length - 1 &&
                  (isDarkTheme ? 'border-b border-zinc-800' : 'border-border border-b')
              )}
            >
              <div className={cn('text-sm', isDarkTheme ? 'text-zinc-300' : 'text-foreground')}>
                {point.feature}
              </div>
              <div className="flex justify-center">
                {point.growOnline ? (
                  <div
                    className={cn(
                      'flex h-6 w-6 items-center justify-center rounded-full',
                      config.slug === 'tiktok'
                        ? 'bg-[#00F2EA]/20'
                        : config.slug === 'x'
                          ? 'bg-white/10'
                          : config.slug === 'instagram'
                            ? 'bg-[#E1306C]/20'
                            : 'bg-primary/20'
                    )}
                  >
                    <Check
                      className={cn(
                        'h-4 w-4',
                        config.slug === 'tiktok'
                          ? 'text-[#00F2EA]'
                          : config.slug === 'x'
                            ? 'text-white'
                            : config.slug === 'instagram'
                              ? 'text-[#E1306C]'
                              : 'text-primary'
                      )}
                    />
                  </div>
                ) : (
                  <div
                    className={cn(
                      'flex h-6 w-6 items-center justify-center rounded-full',
                      isDarkTheme ? 'bg-zinc-800' : 'bg-muted'
                    )}
                  >
                    <X
                      className={cn(
                        'h-4 w-4',
                        isDarkTheme ? 'text-zinc-600' : 'text-muted-foreground'
                      )}
                    />
                  </div>
                )}
              </div>
              <div className="flex justify-center">
                {point.competitor ? (
                  <div
                    className={cn(
                      'flex h-6 w-6 items-center justify-center rounded-full',
                      isDarkTheme ? 'bg-zinc-800' : 'bg-muted'
                    )}
                  >
                    <Check
                      className={cn(
                        'h-4 w-4',
                        isDarkTheme ? 'text-zinc-500' : 'text-muted-foreground'
                      )}
                    />
                  </div>
                ) : (
                  <div
                    className={cn(
                      'flex h-6 w-6 items-center justify-center rounded-full',
                      isDarkTheme ? 'bg-zinc-800' : 'bg-muted'
                    )}
                  >
                    <X
                      className={cn(
                        'h-4 w-4',
                        isDarkTheme ? 'text-zinc-600' : 'text-muted-foreground'
                      )}
                    />
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
              config.slug === 'instagram'
                ? 'bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white hover:opacity-90'
                : theme.primary,
              theme.primaryForeground,
              'shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl',
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
