import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePlatformConfig } from '@/lib/platforms'

export function PlatformFeatures() {
  const { t } = useTranslation()
  const config = usePlatformConfig()
  const { theme, features } = config

  const isDarkTheme = config.slug === 'tiktok' || config.slug === 'x'

  return (
    <section
      id="features"
      className={cn(
        'relative px-4 py-24 sm:px-6 lg:px-8 lg:py-32',
        isDarkTheme ? 'bg-black' : 'bg-muted/20'
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
              'font-display mb-4 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl',
              isDarkTheme ? 'text-white' : 'text-foreground'
            )}
          >
            {t('platforms.common.features.title')}
          </h2>
          <p
            className={cn(
              'mx-auto max-w-2xl text-lg leading-relaxed',
              isDarkTheme ? 'text-zinc-400' : 'text-muted-foreground'
            )}
          >
            {t('platforms.common.features.subtitle', { platform: t(config.nameKey) })}
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.id}
                id={`feature-${feature.id}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={cn(
                  'group relative overflow-hidden rounded-3xl p-8 transition-all duration-300',
                  isDarkTheme
                    ? 'border border-zinc-800 bg-zinc-900 hover:border-zinc-700'
                    : 'border-border/50 hover:border-border bg-card border hover:shadow-lg'
                )}
              >
                {/* Gradient accent on hover */}
                <div
                  className={cn(
                    'absolute top-0 left-0 h-1 w-full opacity-0 transition-opacity duration-300 group-hover:opacity-100',
                    config.slug === 'instagram'
                      ? 'bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737]'
                      : theme.primary
                  )}
                />

                <div className="flex items-start gap-5">
                  {/* Icon */}
                  <div
                    className={cn(
                      'shrink-0 rounded-2xl p-3',
                      isDarkTheme ? 'bg-zinc-800' : 'bg-muted/50',
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
                  <div className="flex-1">
                    {/* Generic name badge */}
                    <span
                      className={cn(
                        'mb-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium',
                        isDarkTheme ? 'bg-zinc-800 text-zinc-400' : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {t(feature.genericNameKey)}
                    </span>

                    {/* Platform-specific name */}
                    <h3
                      className={cn(
                        'mb-3 text-xl font-semibold',
                        isDarkTheme ? 'text-white' : 'text-foreground'
                      )}
                    >
                      {t(feature.specificNameKey)}
                    </h3>

                    {/* Description */}
                    <p
                      className={cn(
                        'mb-4 leading-relaxed',
                        isDarkTheme ? 'text-zinc-400' : 'text-muted-foreground'
                      )}
                    >
                      {t(feature.descriptionKey)}
                    </p>

                    {/* Feature benefits */}
                    <ul className="space-y-2">
                      {[1, 2, 3].map((i) => (
                        <li
                          key={i}
                          className={cn(
                            'flex items-center gap-2 text-sm',
                            isDarkTheme ? 'text-zinc-400' : 'text-muted-foreground'
                          )}
                        >
                          <Check
                            className={cn(
                              'h-4 w-4 shrink-0',
                              config.slug === 'tiktok'
                                ? 'text-[#00F2EA]'
                                : config.slug === 'x'
                                  ? 'text-white'
                                  : config.slug === 'instagram'
                                    ? 'text-[#E1306C]'
                                    : theme.accent
                            )}
                          />
                          {t(`${feature.descriptionKey}.benefit${i}`, { defaultValue: '' }) ||
                            t(`platforms.common.features.benefits.benefit${i}`)}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
