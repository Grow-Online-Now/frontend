import { Helmet } from 'react-helmet-async'

export const SITE_URL = 'https://growonline.now'
export const SITE_NAME = 'Grow Online'
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`
export const TWITTER_HANDLE = '@growonline'

interface SEOHeadProps {
  /** Page title - will be appended with site name */
  title?: string
  /** Meta description - critical for SERP CTR */
  description?: string
  /** OpenGraph image URL */
  ogImage?: string
  /** Canonical URL for this page */
  canonicalUrl?: string
  /** Current language code */
  lang?: string
  /** Keywords for meta tag (still used by some engines) */
  keywords?: string[]
  /** Page type for OpenGraph */
  ogType?: 'website' | 'article' | 'product'
  /** Article published date (for article type) */
  publishedTime?: string
  /** Article modified date (for article type) */
  modifiedTime?: string
  /** Prevent indexing (for staging/dev) */
  noIndex?: boolean
  /** Prevent following links */
  noFollow?: boolean
  /** Page-specific path for hreflang generation */
  pagePath?: string
}

export function SEOHead({
  title = 'AI-Powered Social Media Growth | Join Waitlist',
  description = 'AI-powered content scheduling and analytics for creators who mean business. Join the waitlist and get 3 months free at launch.',
  ogImage = DEFAULT_OG_IMAGE,
  canonicalUrl,
  lang = 'en',
  keywords = [],
  ogType = 'website',
  publishedTime,
  modifiedTime,
  noIndex = false,
  noFollow = false,
  pagePath = '',
}: SEOHeadProps) {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`

  // Build canonical URL with language prefix
  // If canonicalUrl is provided, use it; otherwise build from pagePath
  // Always include language prefix for proper international SEO
  const canonical = canonicalUrl || `${SITE_URL}/${lang}${pagePath}`
  const robotsContent = [
    noIndex ? 'noindex' : 'index',
    noFollow ? 'nofollow' : 'follow',
    'max-snippet:-1',
    'max-image-preview:large',
    'max-video-preview:-1',
  ].join(', ')

  // Default keywords that apply to all pages
  const defaultKeywords = [
    'social media management',
    'AI content creation',
    'social media scheduler',
    'content scheduling',
    'social media analytics',
    'Instagram scheduler',
    'TikTok scheduler',
    'multi-platform posting',
  ]

  const allKeywords = [...new Set([...keywords, ...defaultKeywords])]

  // Generate hreflang URLs based on page path
  const generateHreflangUrl = (locale: string) => {
    if (pagePath) {
      return `${SITE_URL}/${locale}${pagePath}`
    }
    return `${SITE_URL}/${locale}`
  }

  return (
    <Helmet>
      {/* Essential Meta Tags */}
      <html lang={lang} />
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={allKeywords.join(', ')} />

      {/* Canonical URL - Critical for duplicate content */}
      <link rel="canonical" href={canonical} />

      {/* Robots Directives */}
      <meta name="robots" content={robotsContent} />
      <meta name="googlebot" content={robotsContent} />
      <meta name="bingbot" content={robotsContent} />

      {/* Open Graph / Facebook - Essential for social sharing */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content={lang} />
      <meta property="og:locale:alternate" content="en" />
      <meta property="og:locale:alternate" content="fr" />
      <meta property="og:locale:alternate" content="es" />

      {/* Article-specific OG tags */}
      {ogType === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {ogType === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}

      {/* Twitter Card - Essential for Twitter/X sharing */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={TWITTER_HANDLE} />
      <meta name="twitter:creator" content={TWITTER_HANDLE} />
      <meta name="twitter:url" content={canonical} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={fullTitle} />

      {/* Additional SEO Meta Tags */}
      <meta name="language" content={lang} />
      <meta name="author" content={SITE_NAME} />
      <meta name="publisher" content={SITE_NAME} />
      <meta name="copyright" content={`© ${new Date().getFullYear()} ${SITE_NAME}`} />
      <meta name="application-name" content={SITE_NAME} />

      {/* Geo Tags - Helps with local SEO */}
      <meta name="geo.region" content="US" />
      <meta name="geo.placename" content="United States" />

      {/* Mobile & App Tags */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content={SITE_NAME} />
      <meta name="format-detection" content="telephone=no" />

      {/* Refresh/Revisit Tags */}
      <meta name="revisit-after" content="3 days" />
      <meta name="rating" content="general" />

      {/* Alternate Language Links - Critical for international SEO */}
      <link rel="alternate" hrefLang="en" href={generateHreflangUrl('en')} />
      <link rel="alternate" hrefLang="fr" href={generateHreflangUrl('fr')} />
      <link rel="alternate" hrefLang="es" href={generateHreflangUrl('es')} />
      {/* x-default points to English as the fallback for unmatched languages */}
      <link rel="alternate" hrefLang="x-default" href={generateHreflangUrl('en')} />

      {/* DNS Prefetch for performance */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      <link rel="dns-prefetch" href="//api.fontshare.com" />
    </Helmet>
  )
}
