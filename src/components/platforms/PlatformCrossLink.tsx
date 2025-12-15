import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ArrowRight } from 'lucide-react'
import { Link } from '@/components/common/LocalizedLink'
import { cn } from '@/lib/utils'
import { usePlatformConfig } from '@/lib/platforms'
import { platforms } from '@/config/platforms'

export function PlatformCrossLink() {
  const { t } = useTranslation()
  const config = usePlatformConfig()
  const { theme, crossLinks } = config

  return (
    <section className="bg-muted/20 relative px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-5xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="font-display text-foreground mb-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            {t('platforms.common.crossLinks.title')}
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed">
            {t('platforms.common.crossLinks.subtitle')}
          </p>
        </motion.div>

        {/* Cross-link Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {crossLinks.map((crossLink, index) => {
            const targetConfig = platforms[crossLink.targetPlatform as keyof typeof platforms]
            if (!targetConfig) return null

            const TargetIcon = targetConfig.icon
            const targetTheme = targetConfig.theme

            return (
              <motion.div
                key={crossLink.targetPlatform}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link
                  to={`/platforms/${crossLink.targetPlatform}`}
                  className="border-border hover:border-border/80 bg-card group block rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg"
                >
                  <div className="flex items-start gap-4">
                    {/* Target platform icon */}
                    <div
                      className={cn(
                        'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110',
                        targetTheme.primary
                      )}
                    >
                      <TargetIcon className="text-primary-foreground h-6 w-6" />
                    </div>

                    <div className="flex-1">
                      {/* Headline */}
                      <h3 className="text-foreground mb-2 text-lg font-semibold">
                        {t(crossLink.headlineKey)}
                      </h3>

                      {/* Body */}
                      <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                        {t(crossLink.bodyKey)}
                      </p>

                      {/* Link indicator */}
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 text-sm font-medium transition-colors group-hover:opacity-80',
                          targetTheme.accent
                        )}
                      >
                        {t('platforms.common.crossLinks.explore', {
                          platform: t(targetConfig.nameKey),
                        })}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* See all platforms link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 text-center"
        >
          <Link
            to="/platforms"
            className={cn(
              'inline-flex items-center gap-2 text-base font-medium transition-colors hover:opacity-80',
              theme.accent
            )}
          >
            {t('platforms.common.crossLinks.viewAll')}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
