import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePlatformConfig } from '@/lib/platforms'

export function PlatformUseCases() {
  const { t } = useTranslation()
  const config = usePlatformConfig()
  const { theme, useCases } = config

  const isDarkTheme = config.slug === 'tiktok' || config.slug === 'x'

  return (
    <section
      id="use-cases"
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
          className="mb-16 text-center"
        >
          <h2
            className={cn(
              'font-display mb-4 text-3xl font-semibold tracking-tight sm:text-4xl',
              isDarkTheme ? 'text-white' : 'text-foreground'
            )}
          >
            {t('platforms.common.useCases.title')}
          </h2>
          <p
            className={cn(
              'mx-auto max-w-2xl text-lg leading-relaxed',
              isDarkTheme ? 'text-zinc-400' : 'text-muted-foreground'
            )}
          >
            {t('platforms.common.useCases.subtitle', { platform: t(config.nameKey) })}
          </p>
        </motion.div>

        {/* Use Cases Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon
            return (
              <motion.div
                key={useCase.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={cn(
                  'group relative flex flex-col rounded-2xl p-6 transition-all duration-300',
                  isDarkTheme
                    ? 'border border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-900'
                    : 'hover:bg-muted/20 border-border/50 hover:border-border bg-card border hover:shadow-md'
                )}
              >
                {/* Icon */}
                <div
                  className={cn(
                    'mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl',
                    config.slug === 'instagram'
                      ? 'bg-linear-to-br from-[#833AB4]/10 via-[#FD1D1D]/10 to-[#F77737]/10'
                      : isDarkTheme
                        ? 'bg-zinc-800'
                        : 'bg-muted/50',
                    'transition-transform duration-300 group-hover:scale-110'
                  )}
                >
                  <Icon
                    className={cn(
                      'h-7 w-7',
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
                  {t(useCase.titleKey)}
                </h3>
                <p
                  className={cn(
                    'mb-4 flex-1 text-sm leading-relaxed',
                    isDarkTheme ? 'text-zinc-400' : 'text-muted-foreground'
                  )}
                >
                  {t(useCase.descriptionKey)}
                </p>

                {/* Learn more link */}
                <a
                  href="#features"
                  className={cn(
                    'inline-flex items-center gap-1 text-sm font-medium transition-colors',
                    config.slug === 'tiktok'
                      ? 'text-[#FF0050] hover:text-[#FF0050]/80'
                      : config.slug === 'x'
                        ? 'text-white hover:text-zinc-300'
                        : config.slug === 'instagram'
                          ? 'text-[#E1306C] hover:text-[#E1306C]/80'
                          : `${theme.accent} hover:opacity-80`
                  )}
                >
                  {t('platforms.common.useCases.learnMore')}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
