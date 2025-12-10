import { HelmetProvider } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Link } from '@/components/common/LocalizedLink'
import { ArrowRight } from 'lucide-react'
import { SEOHead } from '@/lib/seo/SEOHead'
import { Navbar } from '@/components/layouts/Navbar'
import { WaitlistFooter } from '@/components/waitlist/WaitlistFooter'
import { cn } from '@/lib/utils'
import { platforms, getAllPlatformSlugs } from '@/config/platforms'

export function Platforms() {
  const { t, i18n } = useTranslation()
  const platformSlugs = getAllPlatformSlugs()

  return (
    <HelmetProvider>
      <div className="min-h-screen">
        {/* SEO Meta Tags */}
        <SEOHead
          title={t('platforms.hub.seo.title')}
          description={t('platforms.hub.seo.description')}
          canonicalUrl="https://growonline.now/platforms"
          lang={i18n.language}
        />

        {/* Navigation */}
        <Navbar />

        {/* Page Content */}
        <main>
          {/* Hero Section */}
          <section className="relative overflow-hidden px-4 pt-32 pb-16 sm:px-6 lg:px-8 lg:pt-40">
            <div className="mx-auto max-w-4xl text-center">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-foreground mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
              >
                {t('platforms.hub.hero.title')}{' '}
                <span className="text-primary">{t('platforms.hub.hero.highlight')}</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed sm:text-xl"
              >
                {t('platforms.hub.hero.subtitle')}
              </motion.p>
            </div>
          </section>

          {/* Platforms Grid */}
          <section className="px-4 pb-24 sm:px-6 lg:px-8 lg:pb-32">
            <div className="mx-auto max-w-6xl">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {platformSlugs.map((slug, index) => {
                  const config = platforms[slug]
                  const Icon = config.icon
                  const { theme } = config

                  const isDarkPlatform = slug === 'tiktok' || slug === 'x'

                  return (
                    <motion.div
                      key={slug}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-50px' }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <Link
                        to={`/platforms/${slug}`}
                        className={cn(
                          'group relative flex flex-col rounded-2xl border p-6 transition-all duration-300',
                          'bg-white hover:shadow-xl',
                          'border-border/50 hover:border-border'
                        )}
                      >
                        {/* Platform gradient accent */}
                        <div
                          className={cn(
                            'absolute inset-x-0 top-0 h-1 rounded-t-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100',
                            slug === 'instagram'
                              ? 'bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737]'
                              : isDarkPlatform
                                ? 'bg-black'
                                : theme.primary
                          )}
                        />

                        {/* Icon */}
                        <div
                          className={cn(
                            'mb-4 flex h-14 w-14 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110',
                            slug === 'instagram'
                              ? 'bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737]'
                              : isDarkPlatform
                                ? 'bg-black'
                                : theme.primary
                          )}
                        >
                          <Icon className="h-7 w-7 text-white" />
                        </div>

                        {/* Content */}
                        <h2 className="text-foreground mb-2 text-xl font-semibold">
                          {t(config.nameKey)}
                        </h2>

                        <p className="text-muted-foreground mb-4 flex-1 text-sm leading-relaxed">
                          {t(config.hero.subtitleKey)}
                        </p>

                        {/* Link indicator */}
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 text-sm font-medium transition-colors',
                            slug === 'tiktok'
                              ? 'text-[#FF0050] group-hover:text-[#FF0050]/80'
                              : slug === 'x'
                                ? 'text-black group-hover:text-zinc-700'
                                : slug === 'instagram'
                                  ? 'text-[#E1306C] group-hover:text-[#E1306C]/80'
                                  : `${theme.accent} group-hover:opacity-80`
                          )}
                        >
                          {t('platforms.hub.exploreButton')}
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </span>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-muted/30 px-4 py-24 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-foreground mb-4 text-3xl font-bold sm:text-4xl"
              >
                {t('platforms.hub.cta.title')}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-muted-foreground mb-8 text-lg"
              >
                {t('platforms.hub.cta.subtitle')}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Link
                  to="/signup"
                  className={cn(
                    'inline-flex items-center gap-2 rounded-xl px-8 py-3',
                    'bg-primary font-semibold text-white',
                    'shadow-primary/25 hover:shadow-primary/30 shadow-lg hover:shadow-xl',
                    'transition-all duration-200 hover:-translate-y-0.5'
                  )}
                >
                  {t('platforms.hub.cta.button')}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <WaitlistFooter />
      </div>
    </HelmetProvider>
  )
}
