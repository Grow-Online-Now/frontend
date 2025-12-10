import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Bot, Calendar, LineChart } from 'lucide-react'
import { GlassCard } from '@/components/glass/GlassCard'

const features = [
  {
    icon: Bot,
    titleKey: 'landing.features.ai.title',
    descriptionKey: 'landing.features.ai.description',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Calendar,
    titleKey: 'landing.features.scheduling.title',
    descriptionKey: 'landing.features.scheduling.description',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: LineChart,
    titleKey: 'landing.features.analytics.title',
    descriptionKey: 'landing.features.analytics.description',
    gradient: 'from-green-500 to-emerald-500',
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
              <GlassCard key={feature.titleKey} hover className="group relative overflow-hidden">
                {/* Gradient Background on Hover */}
                <div
                  className={`absolute inset-0 bg-linear-to-br ${feature.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-10`}
                />

                {/* Content */}
                <div className="relative">
                  {/* Icon */}
                  <div
                    className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br ${feature.gradient} p-2.5`}
                  >
                    <Icon className="h-full w-full text-white" />
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
              </GlassCard>
            )
          })}
        </div>
      </div>
    </section>
  )
}
