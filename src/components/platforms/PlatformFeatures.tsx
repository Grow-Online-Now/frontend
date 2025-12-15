import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePlatformConfig } from '@/lib/platforms'

export function PlatformFeatures() {
  const { t } = useTranslation()
  const config = usePlatformConfig()
  const { theme, features } = config

  return (
    <section id="features" className="bg-muted/20 relative px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="font-display text-foreground mb-4 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            {t('platforms.common.features.title')}
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed">
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
                className="border-border/50 hover:border-border bg-card group relative overflow-hidden rounded-3xl border p-8 transition-all duration-300 hover:shadow-lg"
              >
                {/* Gradient accent on hover */}
                <div
                  className={cn(
                    'absolute top-0 left-0 h-1 w-full opacity-0 transition-opacity duration-300 group-hover:opacity-100',
                    theme.primary
                  )}
                />

                <div className="flex items-start gap-5">
                  {/* Icon */}
                  <div className="bg-muted/50 shrink-0 rounded-2xl p-3 transition-transform duration-300 group-hover:scale-110">
                    <Icon className={cn('h-7 w-7', theme.accent)} />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    {/* Generic name badge */}
                    <span className="bg-muted text-muted-foreground mb-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium">
                      {t(feature.genericNameKey)}
                    </span>

                    {/* Platform-specific name */}
                    <h3 className="text-foreground mb-3 text-xl font-semibold">
                      {t(feature.specificNameKey)}
                    </h3>

                    {/* Description */}
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {t(feature.descriptionKey)}
                    </p>

                    {/* Feature benefits */}
                    <ul className="space-y-2">
                      {[1, 2, 3].map((i) => (
                        <li
                          key={i}
                          className="text-muted-foreground flex items-center gap-2 text-sm"
                        >
                          <Check className={cn('h-4 w-4 shrink-0', theme.accent)} />
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
