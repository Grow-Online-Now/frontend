import { HelmetProvider } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { Link } from '@/components/common/LocalizedLink'
import { ArrowRight, Eye, Clock } from 'lucide-react'
import { SEOHead } from '@/lib/seo/SEOHead'
import { OrganizationSchema, BreadcrumbSchema } from '@/lib/seo/StructuredData'
import { Navbar } from '@/components/layouts/Navbar'
import { WaitlistFooter } from '@/components/waitlist/WaitlistFooter'
import { Button } from '@/components/ui/button'

interface ToolCardProps {
  titleKey: string
  descriptionKey: string
  ctaKey: string
  href: string
  icon: React.ReactNode
}

function ToolCard({ titleKey, descriptionKey, ctaKey, href, icon }: ToolCardProps) {
  const { t } = useTranslation()

  return (
    <Link to={href} className="group block h-full">
      <div className="border-border/50 bg-card/50 hover:border-border hover:bg-card flex h-full flex-col rounded-2xl border p-6 transition-colors duration-200">
        <div className="bg-primary/10 text-primary mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
          {icon}
        </div>

        <h2 className="text-foreground text-xl font-semibold">{t(titleKey)}</h2>

        <p className="text-muted-foreground mt-2 flex-1">{t(descriptionKey)}</p>

        <div className="text-primary mt-4 flex items-center gap-1 text-sm font-medium">
          {t(ctaKey)}
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  )
}

export function FreeToolsHub() {
  const { t, i18n } = useTranslation()

  // Breadcrumb data for SEO - include language prefix
  const breadcrumbs = [
    { name: 'Home', url: `https://growonline.now/${i18n.language}` },
    { name: 'Free Tools', url: `https://growonline.now/${i18n.language}/free-tools` },
  ]

  const tools = [
    {
      titleKey: 'tools.hub.tools.linkedinPreview.title',
      descriptionKey: 'tools.hub.tools.linkedinPreview.description',
      ctaKey: 'tools.hub.tools.linkedinPreview.cta',
      href: '/free-tools/linkedin-post-preview-tool',
      icon: <Eye className="h-6 w-6" />,
    },
    {
      titleKey: 'tools.hub.tools.bestTime.title',
      descriptionKey: 'tools.hub.tools.bestTime.description',
      ctaKey: 'tools.hub.tools.bestTime.cta',
      href: '/free-tools/best-time-to-post-calculator',
      icon: <Clock className="h-6 w-6" />,
    },
  ]

  return (
    <HelmetProvider>
      <div className="bg-background min-h-screen">
        <SEOHead
          title={t('tools.meta.hubTitle')}
          description={t('tools.meta.hubDescription')}
          pagePath="/free-tools"
          lang={i18n.language}
        />

        <OrganizationSchema />
        <BreadcrumbSchema items={breadcrumbs} />

        <Navbar />

        <main className="pt-24 pb-24">
          {/* Hero Section */}
          <header className="mx-auto max-w-4xl px-4 pt-8 pb-12 text-center sm:px-6 lg:px-8">
            <h1 className="text-foreground mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              {t('tools.hub.title')}
            </h1>
            <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-lg">
              {t('tools.hub.subtitle')}
            </p>
          </header>

          {/* Tools Grid */}
          <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 sm:grid-cols-2">
              {tools.map((tool) => (
                <ToolCard key={tool.href} {...tool} />
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="mx-auto mt-20 max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="from-primary/10 via-primary/5 rounded-2xl bg-gradient-to-br to-transparent p-8 text-center sm:p-12">
              <h2 className="text-foreground text-2xl font-semibold">
                {t('tools.bestTime.cta.title')}
              </h2>
              <p className="text-muted-foreground mt-2">{t('tools.bestTime.cta.description')}</p>
              <Button size="lg" className="mt-6" asChild>
                <Link to="/#hero">{t('tools.common.joinWaitlist')}</Link>
              </Button>
            </div>
          </section>
        </main>

        <WaitlistFooter />
      </div>
    </HelmetProvider>
  )
}
