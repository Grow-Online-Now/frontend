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

  const isDarkTheme = config.slug === 'tiktok' || config.slug === 'x'

  return (
    <section
      className={cn(
        'relative px-4 py-24 sm:px-6 lg:px-8 lg:py-32',
        isDarkTheme ? 'bg-zinc-950' : 'bg-muted/20'
      )}
    >
      <div className="mx-auto max-w-5xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2
            className={cn(
              'font-display mb-4 text-3xl font-semibold tracking-tight sm:text-4xl',
              isDarkTheme ? 'text-white' : 'text-foreground'
            )}
          >
            {t('platforms.common.crossLinks.title')}
          </h2>
          <p
            className={cn(
              'mx-auto max-w-2xl text-lg leading-relaxed',
              isDarkTheme ? 'text-zinc-400' : 'text-muted-foreground'
            )}
          >
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
                  className={cn(
                    'group block rounded-2xl border p-6 transition-all duration-300',
                    isDarkTheme
                      ? 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-900'
                      : 'border-border hover:border-border/80 bg-card hover:shadow-lg'
                  )}
                >
                  <div className="flex items-start gap-4">
                    {/* Target platform icon */}
                    <div
                      className={cn(
                        'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110',
                        crossLink.targetPlatform === 'tiktok'
                          ? 'bg-black'
                          : crossLink.targetPlatform === 'x'
                            ? 'bg-black'
                            : crossLink.targetPlatform === 'instagram'
                              ? 'bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737]'
                              : targetTheme.primary
                      )}
                    >
                      <TargetIcon className="h-6 w-6 text-white" />
                    </div>

                    <div className="flex-1">
                      {/* Headline */}
                      <h3
                        className={cn(
                          'mb-2 text-lg font-semibold',
                          isDarkTheme ? 'text-white' : 'text-foreground'
                        )}
                      >
                        {t(crossLink.headlineKey)}
                      </h3>

                      {/* Body */}
                      <p
                        className={cn(
                          'mb-4 text-sm leading-relaxed',
                          isDarkTheme ? 'text-zinc-400' : 'text-muted-foreground'
                        )}
                      >
                        {t(crossLink.bodyKey)}
                      </p>

                      {/* Link indicator */}
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 text-sm font-medium transition-colors',
                          crossLink.targetPlatform === 'tiktok'
                            ? 'text-[#FF0050] group-hover:text-[#FF0050]/80'
                            : crossLink.targetPlatform === 'x'
                              ? isDarkTheme
                                ? 'text-white group-hover:text-zinc-300'
                                : 'text-black group-hover:text-zinc-700'
                              : crossLink.targetPlatform === 'instagram'
                                ? 'text-[#E1306C] group-hover:text-[#E1306C]/80'
                                : `${targetTheme.accent} group-hover:opacity-80`
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
              'inline-flex items-center gap-2 text-base font-medium transition-colors',
              config.slug === 'tiktok'
                ? 'text-[#FF0050] hover:text-[#FF0050]/80'
                : config.slug === 'x'
                  ? 'text-white hover:text-zinc-300'
                  : config.slug === 'instagram'
                    ? 'text-[#E1306C] hover:text-[#E1306C]/80'
                    : `${theme.accent} hover:opacity-80`
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
