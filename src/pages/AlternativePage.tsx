import { useParams } from 'react-router-dom'
import { Link } from '@/components/common/LocalizedLink'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'sonner'
import { useTranslation } from 'react-i18next'
import { ArrowLeft } from 'lucide-react'
import { SEOHead, SITE_URL } from '@/lib/seo/SEOHead'
import { FAQSchema, ProductComparisonSchema } from '@/lib/seo/StructuredData'
import { Navbar } from '@/components/layouts/Navbar'
import { WaitlistFooter } from '@/components/waitlist/WaitlistFooter'
import { Section, SectionContent } from '@/components/common/Section'
import { SectionHeading, SectionSubtitle } from '@/components/common/Typography'
import { Breadcrumbs } from '@/components/common/Breadcrumbs'
import { getAlternativesBreadcrumbs } from '@/lib/breadcrumbs'
import { Button } from '@/components/ui/button'
import { getCompetitorBySlug } from '@/data/competitors'
import {
  MigrationHero,
  ObsolescenceSection,
  KillTable,
  MigrationCTA,
  MigrationFAQ,
} from '@/components/alternatives'

export function AlternativePage() {
  const { competitor: competitorSlug } = useParams<{ competitor: string }>()
  const { t, i18n } = useTranslation()

  const competitor = competitorSlug ? getCompetitorBySlug(competitorSlug) : undefined

  // If competitor not found, show a fallback page
  if (!competitor) {
    return (
      <HelmetProvider>
        <div className="min-h-screen">
          <SEOHead
            title={t('alternatives.notFound.title')}
            description={t('alternatives.notFound.subtitle')}
            canonicalUrl={`${SITE_URL}/alternatives`}
            lang={i18n.language}
            noIndex={true}
          />
          <Navbar />
          <main>
            <Section className="pt-32">
              <SectionHeading>{t('alternatives.notFound.title')}</SectionHeading>
              <SectionSubtitle>{t('alternatives.notFound.subtitle')}</SectionSubtitle>
              <SectionContent>
                <Button asChild>
                  <Link to="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {t('alternatives.notFound.cta')}
                  </Link>
                </Button>
              </SectionContent>
            </Section>
          </main>
          <WaitlistFooter />
        </div>
      </HelmetProvider>
    )
  }

  // Prepare FAQ data for structured data
  const faqData = competitor.faqKeys.map((faqKey) => ({
    question: t(`alternatives.faq.questions.${faqKey}.question`, {
      competitor: competitor.name,
    }),
    answer: t(`alternatives.faq.questions.${faqKey}.answer`, {
      competitor: competitor.name,
      competitorPrice: competitor.priceDisplay,
      ourPrice: competitor.ourPriceDisplay,
    }),
  }))

  // Generate breadcrumb items
  const breadcrumbItems = getAlternativesBreadcrumbs(competitor.name)

  // SEO Keywords specific to this competitor
  const competitorKeywords = [
    `${competitor.name} alternative`,
    `${competitor.name} vs Grow Online`,
    `best ${competitor.name} alternative`,
    `${competitor.name} competitor`,
    `switch from ${competitor.name}`,
    `${competitor.name} replacement`,
    `better than ${competitor.name}`,
    'social media scheduler',
    'AI content creation',
    'social media management tool',
  ]

  return (
    <HelmetProvider>
      <div className="min-h-screen">
        {/* SEO Meta Tags */}
        <SEOHead
          title={t('alternatives.meta.title', { competitor: competitor.name })}
          description={t('alternatives.meta.description', { competitor: competitor.name })}
          canonicalUrl={`${SITE_URL}/alternatives/${competitor.slug}`}
          lang={i18n.language}
          pagePath={`/alternatives/${competitor.slug}`}
          keywords={competitorKeywords}
          ogType="product"
        />

        {/* Structured Data for FAQ */}
        <FAQSchema questions={faqData} />

        {/* Structured Data for Product Comparison */}
        <ProductComparisonSchema
          competitorName={competitor.name}
          competitorPrice={competitor.priceDisplay}
          ourPrice={competitor.ourPriceDisplay}
        />

        {/* Toast Notifications */}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-foreground)',
            },
          }}
        />

        {/* Navigation */}
        <Navbar />

        {/* Page Content */}
        <main>
          {/* Breadcrumbs */}
          <div className="mx-auto max-w-7xl px-4 pt-24 sm:px-6 lg:px-8">
            <Breadcrumbs items={breadcrumbItems} />
          </div>

          {/* 1. Hero - Attack the Method */}
          <MigrationHero competitor={competitor} />

          {/* 2. Pain & Obsolescence - Frame as Legacy */}
          <ObsolescenceSection competitor={competitor} />

          {/* 3. Kill Table - Asymmetric Comparison */}
          <KillTable competitor={competitor} />

          {/* 4. CTA - Contextual Switch */}
          <MigrationCTA competitor={competitor} />

          {/* 5. FAQ - SEO Trojan Horse */}
          <MigrationFAQ competitor={competitor} />
        </main>

        {/* Footer */}
        <WaitlistFooter />
      </div>
    </HelmetProvider>
  )
}
