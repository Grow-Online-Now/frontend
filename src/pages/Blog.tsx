import { HelmetProvider } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { SEOHead } from '@/lib/seo/SEOHead'
import { BlogListingSchema, BreadcrumbSchema, OrganizationSchema } from '@/lib/seo/StructuredData'
import { Navbar } from '@/components/layouts/Navbar'
import { WaitlistFooter } from '@/components/waitlist/WaitlistFooter'
import { BlogCard, BlogHero } from '@/components/blog'
import { articles, getFeaturedArticles } from '@/data/articles'

export function Blog() {
  const { t, i18n } = useTranslation()

  const featuredArticles = getFeaturedArticles()
  const heroArticle = featuredArticles[0]
  const remainingArticles = articles.filter((article) => article.slug !== heroArticle?.slug)

  // Prepare article data for structured data schema
  const articlesForSchema = articles.map((article) => ({
    title: t(article.titleKey),
    description: t(article.descriptionKey),
    slug: article.slug,
    publishedAt: article.publishedAt,
    authorName: article.authorName,
    imageUrl: article.imageUrl,
  }))

  // Breadcrumb data for SEO
  const breadcrumbs = [
    { name: 'Home', url: 'https://growonline.now' },
    { name: 'Blog', url: 'https://growonline.now/blog' },
  ]

  return (
    <HelmetProvider>
      <div className="bg-background min-h-screen">
        {/* SEO Meta Tags */}
        <SEOHead
          title={t('blog.meta.title')}
          description={t('blog.meta.description')}
          canonicalUrl="https://growonline.now/blog"
          lang={i18n.language}
        />

        {/* Structured Data for SEO */}
        <OrganizationSchema />
        <BlogListingSchema articles={articlesForSchema} />
        <BreadcrumbSchema items={breadcrumbs} />

        {/* Navigation */}
        <Navbar />

        {/* Page Content */}
        <main className="pt-32 pb-24">
          {/* Hero Section */}
          <header className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-foreground text-4xl font-bold tracking-tight sm:text-5xl">
                {t('blog.hero.title')}
              </h1>
              <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-lg">
                {t('blog.hero.subtitle')}
              </p>
            </div>
          </header>

          {/* Featured Article Hero */}
          {heroArticle && (
            <section
              aria-labelledby="featured-heading"
              className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8"
            >
              <h2 id="featured-heading" className="sr-only">
                Featured Article
              </h2>
              <BlogHero article={heroArticle} />
            </section>
          )}

          {/* All Articles Grid */}
          <section
            aria-labelledby="articles-heading"
            className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8"
          >
            <h2 id="articles-heading" className="sr-only">
              All Articles
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {remainingArticles.map((article) => (
                <BlogCard key={article.slug} article={article} />
              ))}
            </div>
          </section>
        </main>

        {/* Footer */}
        <WaitlistFooter />
      </div>
    </HelmetProvider>
  )
}
