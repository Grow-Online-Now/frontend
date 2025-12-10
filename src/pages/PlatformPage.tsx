import { HelmetProvider } from 'react-helmet-async'
import { useParams } from 'react-router-dom'
import { Navigate } from '@/components/common/LocalizedLink'
import { useTranslation } from 'react-i18next'
import { SEOHead } from '@/lib/seo/SEOHead'
import { FAQSchema } from '@/lib/seo/StructuredData'
import { Navbar } from '@/components/layouts/Navbar'
import { WaitlistFooter } from '@/components/waitlist/WaitlistFooter'
import { cn } from '@/lib/utils'
import { getPlatformConfig, isValidPlatformSlug } from '@/config/platforms'
import {
  PlatformThemeProvider,
  PlatformHero,
  PlatformFeatureAnchors,
  PlatformPainPoints,
  PlatformFeatures,
  PlatformUseCases,
  PlatformFAQ,
  PlatformCompetitor,
  PlatformCrossLink,
} from '@/components/platforms'

export function PlatformPage() {
  const { platform } = useParams<{ platform: string }>()
  const { t, i18n } = useTranslation()

  // Validate platform slug
  if (!platform || !isValidPlatformSlug(platform)) {
    return <Navigate to="/platforms" replace />
  }

  const config = getPlatformConfig(platform)
  if (!config) {
    return <Navigate to="/platforms" replace />
  }

  // Prepare FAQ data for structured data
  const faqData = config.faqs.map((faq) => ({
    question: t(faq.questionKey),
    answer: t(faq.answerKey),
  }))

  const isDarkTheme = platform === 'tiktok' || platform === 'x'

  return (
    <HelmetProvider>
      <PlatformThemeProvider config={config}>
        <div className={cn('min-h-screen', isDarkTheme ? 'bg-zinc-950' : 'bg-background')}>
          {/* SEO Meta Tags */}
          <SEOHead
            title={t(config.seo.titleKey)}
            description={t(config.seo.descriptionKey)}
            canonicalUrl={`https://growonline.now/platforms/${platform}`}
            lang={i18n.language}
          />

          {/* Structured Data */}
          <FAQSchema questions={faqData} />

          {/* Navigation */}
          <Navbar variant={isDarkTheme ? 'dark' : 'default'} />

          {/* Page Content */}
          <main>
            {/* Hero Section */}
            <PlatformHero />

            {/* Feature Anchors (Sticky navigation) */}
            <PlatformFeatureAnchors />

            {/* Pain Points Section */}
            <PlatformPainPoints />

            {/* Features Section */}
            <PlatformFeatures />

            {/* Use Cases Section ("Who is this for?") */}
            <PlatformUseCases />

            {/* Competitor Comparison Section */}
            <PlatformCompetitor />

            {/* Platform-Specific FAQ */}
            <PlatformFAQ />

            {/* Cross-Platform Links */}
            <PlatformCrossLink />
          </main>

          {/* Footer */}
          <WaitlistFooter variant={isDarkTheme ? 'dark' : 'default'} />
        </div>
      </PlatformThemeProvider>
    </HelmetProvider>
  )
}
