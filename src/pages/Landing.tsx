import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'sonner'
import { useTranslation } from 'react-i18next'
import { SEOHead } from '@/lib/seo/SEOHead'
import {
  OrganizationSchema,
  WebSiteSchema,
  SoftwareApplicationSchema,
  FAQSchema,
} from '@/lib/seo/StructuredData'
import { Navbar } from '@/components/layouts/Navbar'
import { HeroSection } from '@/components/landing/HeroSection'
import { FAQ } from '@/components/waitlist/faq/FAQ'
import { FinalCTA } from '@/components/waitlist/final-cta/FinalCTA'
import { WaitlistFooter } from '@/components/waitlist/WaitlistFooter'
import { TestimonialsSection } from '@/components/landing/TestimonialsSection'
import { Pricing } from '@/components/landing/PricingSection'
import { GetStartedSection } from '@/components/landing/GetStartedSection'
import { PreWrittenDraftSection } from '@/components/landing/PreWrittenDraftSection'
import { FeaturesSection } from '@/components/landing/FeaturesSection'

export function Landing() {
  const { t, i18n } = useTranslation()

  // Prepare FAQ data for structured data (all 16 questions)
  const faqData = []

  // General FAQs
  for (let i = 1; i <= 4; i++) {
    faqData.push({
      question: t(`landing.faq.q${i}.question`),
      answer: t(`landing.faq.q${i}.answer`),
    })
  }

  // Features FAQs
  for (let i = 5; i <= 8; i++) {
    faqData.push({
      question: t(`landing.faq.q${i}.question`),
      answer: t(`landing.faq.q${i}.answer`),
    })
  }

  // Pricing FAQs
  for (let i = 9; i <= 12; i++) {
    faqData.push({
      question: t(`landing.faq.q${i}.question`),
      answer: t(`landing.faq.q${i}.answer`),
    })
  }

  // Technical FAQs
  for (let i = 13; i <= 16; i++) {
    faqData.push({
      question: t(`landing.faq.q${i}.question`),
      answer: t(`landing.faq.q${i}.answer`),
    })
  }

  return (
    <HelmetProvider>
      <div className="min-h-screen">
        {/* SEO Meta Tags */}
        <SEOHead
          title="Grow Online - AI-Powered Social Media Growth | Join Waitlist"
          description="Stop wasting 15+ hours per week on social media management. Grow Online's AI handles content creation, intelligent scheduling, and analytics across all platforms. Join 1,200+ creators on the waitlist."
          canonicalUrl="https://growonline.now"
          lang={i18n.language}
        />

        {/* Structured Data */}
        <OrganizationSchema />
        <WebSiteSchema />
        <SoftwareApplicationSchema />
        <FAQSchema questions={faqData} />

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
        <Navbar />
        <main>
          <HeroSection />
          <FeaturesSection />
          <PreWrittenDraftSection
            title="Pre-written drafts based on your email history and calendar"
            subtitle="Every email you get needing a reply will have a pre-written draft."
          />
          <GetStartedSection
            titleKey="landing.getStarted.title"
            subtitleKey="landing.getStarted.subtitle"
          />
          <TestimonialsSection />
          <Pricing />
          <FinalCTA />
          <FAQ />
        </main>

        {/* Footer */}
        <WaitlistFooter />
      </div>
    </HelmetProvider>
  )
}
