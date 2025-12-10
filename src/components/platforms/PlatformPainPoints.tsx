import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { usePlatformConfig } from '@/lib/platforms'

export function PlatformPainPoints() {
  const { t } = useTranslation()
  const config = usePlatformConfig()
  const { theme, painPoints } = config

  const isDarkTheme = config.slug === 'tiktok' || config.slug === 'x'

  return (
    <section
      className={cn(
        'relative px-4 py-24 sm:px-6 lg:px-8 lg:py-32',
        isDarkTheme ? 'bg-zinc-950' : 'bg-background'
      )}
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="mb-16 max-w-2xl"
        >
          <h2
            className={cn(
              'font-display mb-4 text-3xl font-semibold tracking-tight sm:text-4xl',
              isDarkTheme ? 'text-white' : 'text-foreground'
            )}
          >
            {t('platforms.common.painPoints.title')}
          </h2>
          <p
            className={cn(
              'text-lg leading-relaxed',
              isDarkTheme ? 'text-zinc-400' : 'text-muted-foreground'
            )}
          >
            {t('platforms.common.painPoints.subtitle')}
          </p>
        </motion.div>

        {/* Pain Points Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {painPoints.map((point, index) => {
            const Icon = point.icon
            return (
              <motion.div
                key={point.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={cn(
                  'group relative rounded-2xl p-6 transition-all duration-300',
                  isDarkTheme
                    ? 'border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900'
                    : 'bg-muted/30 hover:bg-muted/50 border-border/50 border'
                )}
              >
                {/* Icon */}
                <div
                  className={cn(
                    'mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl',
                    isDarkTheme ? 'bg-zinc-800' : 'bg-card',
                    'transition-transform duration-300 group-hover:scale-110'
                  )}
                >
                  <Icon
                    className={cn(
                      'h-6 w-6',
                      config.slug === 'tiktok'
                        ? 'text-[#FF0050]'
                        : config.slug === 'x'
                          ? 'text-white'
                          : config.slug === 'instagram'
                            ? 'text-[#E1306C]'
                            : theme.accent
                    )}
                  />
                </div>

                {/* Content */}
                <h3
                  className={cn(
                    'mb-2 text-lg font-semibold',
                    isDarkTheme ? 'text-white' : 'text-foreground'
                  )}
                >
                  {t(point.titleKey)}
                </h3>
                <p
                  className={cn(
                    'text-sm leading-relaxed',
                    isDarkTheme ? 'text-zinc-400' : 'text-muted-foreground'
                  )}
                >
                  {t(point.descriptionKey)}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
