import { Helmet } from 'react-helmet-async'
import { SITE_URL, SITE_NAME } from './SEOHead'

/**
 * Organization Schema - Establishes brand identity for Google Knowledge Graph
 */
export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/images/logo/logo-512.png`,
      width: 512,
      height: 512,
    },
    image: `${SITE_URL}/og-image.png`,
    description:
      'AI-powered social media management platform for creators and businesses. Automate content creation, scheduling, and analytics across all major platforms.',
    foundingDate: '2025',
    founder: {
      '@type': 'Person',
      name: 'Grow Online Team',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'support@growonline.now',
      availableLanguage: ['English', 'French', 'Spanish'],
    },
    sameAs: [
      'https://twitter.com/growonline',
      'https://instagram.com/growonline',
      'https://linkedin.com/company/growonline',
      'https://youtube.com/@growonline',
      'https://tiktok.com/@growonline',
    ],
  }

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  )
}

/**
 * WebSite Schema - Enables sitelinks search box in Google
 */
export function WebSiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    description:
      'AI-powered social media growth platform with intelligent scheduling, content creation, and analytics.',
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
    inLanguage: ['en', 'fr', 'es'],
  }

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  )
}

/**
 * SoftwareApplication Schema - Rich results for software/app listings
 */
export function SoftwareApplicationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${SITE_URL}/#software`,
    name: SITE_NAME,
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'Social Media Management',
    operatingSystem: 'Web, iOS, Android',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/PreOrder',
      priceValidUntil: '2030-12-31',
      description: 'Join the waitlist for early access and 3 months free',
      seller: {
        '@id': `${SITE_URL}/#organization`,
      },
    },
    description:
      'AI-powered social media management platform with content scheduling, AI content creation, analytics, and multi-platform publishing. The modern alternative to Buffer, Hootsuite, and Later.',
    featureList: [
      'AI Content Generation',
      'Multi-Platform Scheduling',
      'Advanced Analytics',
      'Hashtag Strategy',
      'Best Time to Post',
      'Content Repurposing',
      'Brand Voice AI',
      'Team Collaboration',
    ],
    screenshot: `${SITE_URL}/screenshots/dashboard.png`,
  }

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  )
}

/**
 * FAQ Schema - Enables FAQ rich results in Google
 */
interface FAQSchemaProps {
  questions: Array<{ question: string; answer: string }>
}

export function FAQSchema({ questions }: FAQSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  )
}

interface BlogArticle {
  title: string
  description: string
  slug: string
  publishedAt: string
  authorName: string
  imageUrl: string
}

interface BlogListingSchemaProps {
  articles: BlogArticle[]
}

export function BlogListingSchema({ articles }: BlogListingSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: `${SITE_NAME} Blog`,
    description:
      'Expert insights on social media marketing, content strategy, and growth tactics for creators and businesses.',
    url: `${SITE_URL}/blog`,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/images/logo/logo-512.png`,
      },
    },
    blogPost: articles.map((article) => ({
      '@type': 'BlogPosting',
      headline: article.title,
      description: article.description,
      url: `${SITE_URL}/blog/${article.slug}`,
      datePublished: article.publishedAt,
      image: article.imageUrl.startsWith('http')
        ? article.imageUrl
        : `${SITE_URL}${article.imageUrl}`,
      author: {
        '@type': 'Person',
        name: article.authorName,
      },
      publisher: {
        '@type': 'Organization',
        name: SITE_NAME,
        logo: {
          '@type': 'ImageObject',
          url: `${SITE_URL}/images/logo/logo-512.png`,
        },
      },
    })),
  }

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  )
}

interface BlogPostingSchemaProps {
  title: string
  description: string
  slug: string
  publishedAt: string
  modifiedAt?: string
  authorName: string
  imageUrl: string
  readingTime: number
  keywords?: string[]
}

export function BlogPostingSchema({
  title,
  description,
  slug,
  publishedAt,
  modifiedAt,
  authorName,
  imageUrl,
  readingTime,
  keywords = [],
}: BlogPostingSchemaProps) {
  const url = `${SITE_URL}/blog/${slug}`

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    url,
    datePublished: publishedAt,
    dateModified: modifiedAt || publishedAt,
    image: imageUrl.startsWith('http') ? imageUrl : `${SITE_URL}${imageUrl}`,
    author: {
      '@type': 'Person',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/images/logo/logo-512.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    wordCount: readingTime * 200,
    timeRequired: `PT${readingTime}M`,
    keywords: keywords.join(', '),
  }

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  )
}

/**
 * Breadcrumb Schema - Enables breadcrumb rich results
 */
export interface BreadcrumbItem {
  name: string
  url: string
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[]
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  )
}

/**
 * Article Schema - For blog posts and legal pages
 */
interface ArticleSchemaProps {
  headline: string
  description: string
  datePublished: string
  dateModified: string
  url: string
  image?: string
  authorName?: string
}

export function ArticleSchema({
  headline,
  description,
  datePublished,
  dateModified,
  url,
  image = `${SITE_URL}/og-image.png`,
  authorName = SITE_NAME,
}: ArticleSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    image,
    datePublished,
    dateModified,
    url,
    author: {
      '@type': 'Organization',
      name: authorName,
      url: SITE_URL,
    },
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  }

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  )
}

/**
 * WebPage Schema - Base schema for all pages
 */
interface WebPageSchemaProps {
  name: string
  description: string
  url: string
  dateModified?: string
}

export function WebPageSchema({
  name,
  description,
  url,
  dateModified = new Date().toISOString().split('T')[0],
}: WebPageSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    name,
    description,
    url,
    dateModified,
    isPartOf: {
      '@id': `${SITE_URL}/#website`,
    },
    about: {
      '@id': `${SITE_URL}/#organization`,
    },
    inLanguage: 'en',
  }

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  )
}

/**
 * Product Schema - For competitor comparison pages
 */
interface ProductComparisonSchemaProps {
  competitorName: string
  competitorPrice: string
  ourPrice: string
}

export function ProductComparisonSchema({
  competitorName,
  competitorPrice,
  ourPrice,
}: ProductComparisonSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${SITE_NAME} - ${competitorName} Alternative`,
    description: `Compare ${SITE_NAME} vs ${competitorName}. ${SITE_NAME} offers AI-powered content creation, advanced analytics, and multi-platform scheduling at ${ourPrice} compared to ${competitorName}'s ${competitorPrice}.`,
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
    },
    offers: {
      '@type': 'Offer',
      price: '29',
      priceCurrency: 'USD',
      priceValidUntil: '2030-12-31',
      availability: 'https://schema.org/PreOrder',
    },
  }

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  )
}
