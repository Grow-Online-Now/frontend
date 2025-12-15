import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { usePlatformConfig } from '@/lib/platforms'

export function PlatformPainPoints() {
  const { t } = useTranslation()
  const config = usePlatformConfig()
  const { theme, painPoints } = config

  return (
    <section className="bg-background relative px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="mb-16 max-w-2xl"
        >
          <h2 className="font-display text-foreground mb-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            {t('platforms.common.painPoints.title')}
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
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
                className="bg-muted/30 hover:bg-muted/50 border-border/50 group relative rounded-2xl border p-6 transition-all duration-300"
              >
                {/* Icon */}
                <div className="bg-card mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110">
                  <Icon className={cn('h-6 w-6', theme.accent)} />
                </div>

                {/* Content */}
                <h3 className="text-foreground mb-2 text-lg font-semibold">{t(point.titleKey)}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
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
