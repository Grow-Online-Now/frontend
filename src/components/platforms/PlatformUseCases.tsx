import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePlatformConfig } from '@/lib/platforms'

export function PlatformUseCases() {
  const { t } = useTranslation()
  const config = usePlatformConfig()
  const { theme, useCases } = config

  return (
    <section id="use-cases" className="bg-background relative px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="font-display text-foreground mb-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            {t('platforms.common.useCases.title')}
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed">
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
                className="hover:bg-muted/20 border-border/50 hover:border-border bg-card group relative flex flex-col rounded-2xl border p-6 transition-all duration-300 hover:shadow-md"
              >
                {/* Icon */}
                <div className="bg-muted/50 mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110">
                  <Icon className={cn('h-7 w-7', theme.accent)} />
                </div>

                {/* Content */}
                <h3 className="text-foreground mb-2 text-lg font-semibold">
                  {t(useCase.titleKey)}
                </h3>
                <p className="text-muted-foreground mb-4 flex-1 text-sm leading-relaxed">
                  {t(useCase.descriptionKey)}
                </p>

                {/* Learn more link */}
                <a
                  href="#features"
                  className={cn(
                    'inline-flex items-center gap-1 text-sm font-medium transition-colors hover:opacity-80',
                    theme.accent
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
