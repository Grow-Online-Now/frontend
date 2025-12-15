import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { usePlatformConfig } from '@/lib/platforms'
import { useLocalizedHref } from '@/hooks/useLocalizedHref'

export function PlatformHero() {
  const { t } = useTranslation()
  const localizeHref = useLocalizedHref()
  const config = usePlatformConfig()
  const { theme, hero } = config
  const Icon = config.icon

  return (
    <section className={cn('relative overflow-hidden px-4 pt-32 pb-20 sm:px-6 lg:px-8 lg:pt-40')}>
      {/* Background gradient based on platform */}
      <div className={cn('bg-background absolute inset-0 -z-10', theme.gradient)} />

      {/* Decorative glow */}
      <div
        className={cn(
          'absolute top-0 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 rounded-full opacity-30 blur-3xl',
          theme.primary
        )}
      />

      <div className="mx-auto max-w-4xl">
        {/* Platform badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 flex justify-center"
        >
          <div
            className={cn(
              'inline-flex items-center gap-2 rounded-full px-4 py-2',
              'bg-foreground/10 backdrop-blur-sm',
              theme.borderColor,
              'border'
            )}
          >
            <Icon className={cn('h-5 w-5', theme.accent)} />
            <span className="text-foreground text-sm font-medium">{t(config.nameKey)}</span>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-foreground mb-6 text-center text-4xl leading-[1.1] font-bold tracking-tight sm:text-5xl lg:text-6xl"
        >
          {t(hero.titleKey)}{' '}
          <span className={cn('relative', theme.accent)}>{t(hero.highlightKey)}</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-muted-foreground mx-auto mb-8 max-w-2xl text-center text-lg leading-relaxed"
        >
          {t(hero.subtitleKey)}
        </motion.p>

        {/* Agitation text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-muted-foreground/80 mx-auto mb-10 max-w-xl text-center text-base italic"
        >
          "{t(hero.agitationKey)}"
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Button
            size="lg"
            className={cn(
              'h-12 min-w-[180px] rounded-xl px-8 text-base font-semibold',
              theme.primary,
              theme.primaryForeground,
              'shadow-lg transition-all duration-200 hover:opacity-90',
              theme.glowColor
            )}
            asChild
          >
            <a href={localizeHref('/signup')} className="inline-flex items-center gap-2">
              {t('platforms.common.cta.getStarted')}
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className={cn(
              'h-12 min-w-[180px] rounded-xl px-8 text-base font-semibold',
              'bg-background border-border hover:bg-accent',
              'transition-all duration-200'
            )}
            asChild
          >
            <a href="#features">{t('platforms.common.cta.seeFeatures')}</a>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
