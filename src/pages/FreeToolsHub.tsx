import { HelmetProvider } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Link } from '@/components/common/LocalizedLink'
import { ArrowRight, Eye, Clock, Hash, Sparkles, User, BarChart3 } from 'lucide-react'
import { SEOHead } from '@/lib/seo/SEOHead'
import { OrganizationSchema, BreadcrumbSchema } from '@/lib/seo/StructuredData'
import { Navbar } from '@/components/layouts/Navbar'
import { WaitlistFooter } from '@/components/waitlist/WaitlistFooter'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface ToolCardProps {
  titleKey: string
  descriptionKey: string
  ctaKey: string
  href: string
  icon: React.ReactNode
  gradient: string
  delay: number
}

function ToolCard({
  titleKey,
  descriptionKey,
  ctaKey,
  href,
  icon,
  gradient,
  delay,
}: ToolCardProps) {
  const { t } = useTranslation()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Link to={href} className="group block h-full">
        <Card className="relative h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <div
            className={cn(
              'absolute inset-0 opacity-5 transition-opacity duration-300 group-hover:opacity-10',
              gradient
            )}
          />
          <CardHeader title={t(titleKey)} description={t(descriptionKey)} className="relative" />
          <div className="bg-primary/10 text-primary mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
            {icon}
          </div>
          <h2 className="text-xl">{t(titleKey)}</h2>
          <p className="text-base">{t(descriptionKey)}</p>
          <CardContent className="relative">
            <Button
              variant="ghost"
              className="group/btn text-primary gap-2 p-0 hover:bg-transparent"
            >
              {t(ctaKey)}
              <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </Button>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}

interface ComingSoonToolProps {
  labelKey: string
  icon: React.ReactNode
  delay: number
}

function ComingSoonTool({ labelKey, icon, delay }: ComingSoonToolProps) {
  const { t } = useTranslation()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay }}
      className="border-muted-foreground/30 bg-muted/30 flex items-center gap-3 rounded-lg border border-dashed px-4 py-3"
    >
      <div className="text-muted-foreground">{icon}</div>
      <span className="text-muted-foreground text-sm">{t(labelKey)}</span>
      <Badge variant="dark-gray">{t('tools.common.comingSoon', 'Coming Soon')}</Badge>
    </motion.div>
  )
}

export function FreeToolsHub() {
  const { t, i18n } = useTranslation()

  const breadcrumbs = [
    { name: 'Home', url: 'https://growonline.now' },
    { name: 'Free Tools', url: 'https://growonline.now/free-tools' },
  ]

  const tools = [
    {
      titleKey: 'tools.hub.tools.linkedinPreview.title',
      descriptionKey: 'tools.hub.tools.linkedinPreview.description',
      ctaKey: 'tools.hub.tools.linkedinPreview.cta',
      href: '/free-tools/linkedin-post-preview-tool',
      icon: <Eye className="h-6 w-6" />,
      gradient: 'bg-gradient-to-br from-blue-500 to-blue-700',
    },
    {
      titleKey: 'tools.hub.tools.bestTime.title',
      descriptionKey: 'tools.hub.tools.bestTime.description',
      ctaKey: 'tools.hub.tools.bestTime.cta',
      href: '/free-tools/best-time-to-post-calculator',
      icon: <Clock className="h-6 w-6" />,
      gradient: 'bg-gradient-to-br from-green-500 to-emerald-700',
    },
  ]

  const comingSoonTools = [
    { labelKey: 'tools.hub.comingSoon.tools.hashtagFinder', icon: <Hash className="h-5 w-5" /> },
    {
      labelKey: 'tools.hub.comingSoon.tools.captionGenerator',
      icon: <Sparkles className="h-5 w-5" />,
    },
    { labelKey: 'tools.hub.comingSoon.tools.bioOptimizer', icon: <User className="h-5 w-5" /> },
    {
      labelKey: 'tools.hub.comingSoon.tools.competitorAnalyzer',
      icon: <BarChart3 className="h-5 w-5" />,
    },
  ]

  return (
    <HelmetProvider>
      <div className="bg-background min-h-screen">
        <SEOHead
          title={t('tools.meta.hubTitle')}
          description={t('tools.meta.hubDescription')}
          canonicalUrl="https://growonline.now/free-tools"
          lang={i18n.language}
        />

        <OrganizationSchema />
        <BreadcrumbSchema items={breadcrumbs} />

        <Navbar />

        <main className="pt-24 pb-24">
          {/* Hero Section */}
          <header className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <Badge variant="dark-gray">{t('tools.common.freeForever')}</Badge>
              <h1 className="text-foreground text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                {t('tools.hub.title')}
              </h1>
              <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-lg sm:text-xl">
                {t('tools.hub.subtitle')}
              </p>
            </motion.div>
          </header>

          {/* Tools Grid */}
          <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 md:grid-cols-2">
              {tools.map((tool, index) => (
                <ToolCard key={tool.href} {...tool} delay={0.1 + index * 0.1} />
              ))}
            </div>
          </section>

          {/* Coming Soon Section */}
          <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="bg-card/50 rounded-2xl border p-8">
                <h2 className="text-foreground text-2xl font-semibold">
                  {t('tools.hub.comingSoon.title')}
                </h2>
                <p className="text-muted-foreground mt-2">
                  {t('tools.hub.comingSoon.description')}
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {comingSoonTools.map((tool, index) => (
                    <ComingSoonTool key={tool.labelKey} {...tool} delay={0.4 + index * 0.05} />
                  ))}
                </div>
              </div>
            </motion.div>
          </section>

          {/* CTA Section */}
          <section className="mx-auto mt-20 max-w-4xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="from-primary/10 via-primary/5 rounded-2xl bg-gradient-to-br to-transparent p-8 text-center"
            >
              <h2 className="text-foreground text-2xl font-semibold">
                {t('tools.bestTime.cta.title')}
              </h2>
              <p className="text-muted-foreground mt-2">{t('tools.bestTime.cta.description')}</p>
              <Button size="lg" className="mt-6" asChild>
                <Link to="/#hero">{t('tools.common.joinWaitlist')}</Link>
              </Button>
            </motion.div>
          </section>
        </main>

        <WaitlistFooter />
      </div>
    </HelmetProvider>
  )
}
