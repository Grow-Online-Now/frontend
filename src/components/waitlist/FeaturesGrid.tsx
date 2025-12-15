import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Bot, Calendar, LineChart } from 'lucide-react'
import { Card } from '@/components/ui/card'

const features = [
  {
    icon: Bot,
    titleKey: 'landing.features.ai.title',
    descriptionKey: 'landing.features.ai.description',
    bgClass: 'bg-primary',
  },
  {
    icon: Calendar,
    titleKey: 'landing.features.scheduling.title',
    descriptionKey: 'landing.features.scheduling.description',
    bgClass: 'bg-info',
  },
  {
    icon: LineChart,
    titleKey: 'landing.features.analytics.title',
    descriptionKey: 'landing.features.analytics.description',
    bgClass: 'bg-success',
  },
]

export function FeaturesGrid() {
  const { t } = useTranslation()

  return (
    <section id="features" className="relative px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="font-display text-foreground mb-4 text-4xl font-bold sm:text-5xl">
            {t('landing.features.title')}
          </h2>
          <p className="text-muted-foreground text-lg">{t('landing.features.subtitle')}</p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.titleKey}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                <Card className="group hover:bg-accent/5 relative overflow-hidden p-6 transition-colors">
                  {/* Content */}
                  <div className="relative">
                    {/* Icon */}
                    <div
                      className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl ${feature.bgClass} p-2.5`}
                    >
                      <Icon className="text-primary-foreground h-full w-full" />
                    </div>

                    {/* Title */}
                    <h3 className="text-foreground mb-3 text-xl font-semibold">
                      {t(feature.titleKey)}
                    </h3>

                    {/* Description */}
                    <p className="text-muted-foreground leading-relaxed">
                      {t(feature.descriptionKey)}
                    </p>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
