import { HelmetProvider } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { Link } from '@/components/common/LocalizedLink'
import { motion } from 'framer-motion'
import { Home, ArrowLeft, Search, HelpCircle } from 'lucide-react'
import { SEOHead } from '@/lib/seo/SEOHead'
import { Navbar } from '@/components/layouts/Navbar'
import { WaitlistFooter } from '@/components/waitlist/WaitlistFooter'
import { Button } from '@/components/ui/button'

export function NotFound() {
  const { t, i18n } = useTranslation()

  const quickLinks = [
    { labelKey: 'common.notFound.links.home', href: '/', icon: Home },
    { labelKey: 'common.notFound.links.blog', href: '/blog', icon: Search },
    { labelKey: 'common.notFound.links.tools', href: '/free-tools', icon: HelpCircle },
  ]

  return (
    <HelmetProvider>
      <SEOHead
        title={t('common.notFound.seo.title')}
        description={t('common.notFound.seo.description')}
        noIndex={true}
        lang={i18n.language}
        pagePath="/404"
      />

      <div className="bg-background flex min-h-screen flex-col">
        <Navbar />

        <main className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
          <div className="w-full max-w-md text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* 404 Number */}
              <h1 className="from-primary to-primary/60 bg-gradient-to-r bg-clip-text text-8xl font-bold tracking-tight text-transparent sm:text-9xl">
                404
              </h1>

              {/* Title */}
              <h2 className="text-foreground mt-4 text-2xl font-semibold sm:text-3xl">
                {t('common.notFound.title')}
              </h2>

              {/* Description */}
              <p className="text-muted-foreground mx-auto mt-4 max-w-sm text-base sm:text-lg">
                {t('common.notFound.description')}
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4"
            >
              <Button asChild size="lg" className="gap-2">
                <Link to="/">
                  <Home className="h-4 w-4" />
                  {t('common.notFound.actions.goHome')}
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2">
                <Link to="/" onClick={() => window.history.back()}>
                  <ArrowLeft className="h-4 w-4" />
                  {t('common.notFound.actions.goBack')}
                </Link>
              </Button>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-12"
            >
              <p className="text-muted-foreground mb-4 text-sm">
                {t('common.notFound.quickLinks.title')}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {quickLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="text-muted-foreground hover:text-primary inline-flex items-center gap-1.5 text-sm transition-colors"
                  >
                    <link.icon className="h-4 w-4" />
                    {t(link.labelKey)}
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </main>

        <WaitlistFooter />
      </div>
    </HelmetProvider>
  )
}
