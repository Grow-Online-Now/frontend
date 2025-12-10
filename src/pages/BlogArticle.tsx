import { useParams } from 'react-router-dom'
import { Navigate } from '@/components/common/LocalizedLink'
import { HelmetProvider } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { SEOHead } from '@/lib/seo/SEOHead'
import { BlogPostingSchema, BreadcrumbSchema, OrganizationSchema } from '@/lib/seo/StructuredData'
import { Navbar } from '@/components/layouts/Navbar'
import { WaitlistFooter } from '@/components/waitlist/WaitlistFooter'
import { ArticleHeader, ArticleSection, ArticleCTA, RelatedArticles } from '@/components/blog'
import { getArticleBySlug, getRelatedArticles } from '@/data/articles'

export function BlogArticle() {
  const { slug } = useParams<{ slug: string }>()
  const { t, i18n } = useTranslation()

  const article = slug ? getArticleBySlug(slug) : undefined

  if (!article) {
    return <Navigate to="/blog" replace />
  }

  const relatedArticles = getRelatedArticles(article.slug, 3)
  const contentKey = article.contentKey

  // Breadcrumb data for SEO
  const breadcrumbs = [
    { name: 'Home', url: 'https://growonline.now' },
    { name: 'Blog', url: 'https://growonline.now/blog' },
    { name: t(article.titleKey), url: `https://growonline.now/blog/${article.slug}` },
  ]

  return (
    <HelmetProvider>
      <div className="bg-background min-h-screen">
        {/* SEO Meta Tags */}
        <SEOHead
          title={`${t(article.titleKey)} | Grow Online Blog`}
          description={t(article.descriptionKey)}
          canonicalUrl={`https://growonline.now/blog/${article.slug}`}
          lang={i18n.language}
        />

        {/* Structured Data for SEO */}
        <OrganizationSchema />
        <BlogPostingSchema
          title={t(article.titleKey)}
          description={t(article.descriptionKey)}
          slug={article.slug}
          publishedAt={article.publishedAt}
          authorName={article.authorName}
          imageUrl={article.imageUrl}
          readingTime={article.readingTime}
          keywords={article.keywords}
        />
        <BreadcrumbSchema items={breadcrumbs} />

        {/* Navigation */}
        <Navbar />

        {/* Article Header */}
        <ArticleHeader article={article} />

        {/* Article Content */}
        <main className="mx-auto max-w-3xl px-4 pb-24 sm:px-6 lg:px-8">
          <article className="prose prose-lg max-w-none">
            {/* Introduction */}
            <ArticleSection contentKeys={[`${contentKey}.intro.p1`, `${contentKey}.intro.p2`]} />

            {/* Section 1 */}
            <ArticleSection
              titleKey={`${contentKey}.section1.title`}
              contentKeys={[`${contentKey}.section1.p1`, `${contentKey}.section1.p2`]}
              listKeys={[
                `${contentKey}.section1.list.item1`,
                `${contentKey}.section1.list.item2`,
                `${contentKey}.section1.list.item3`,
                `${contentKey}.section1.list.item4`,
              ]}
            />

            {/* Section 2 */}
            <ArticleSection
              titleKey={`${contentKey}.section2.title`}
              contentKeys={[`${contentKey}.section2.p1`, `${contentKey}.section2.p2`]}
              highlightKey={`${contentKey}.section2.highlight`}
            />

            {/* Section 3 */}
            <ArticleSection
              titleKey={`${contentKey}.section3.title`}
              contentKeys={[`${contentKey}.section3.p1`, `${contentKey}.section3.p2`]}
              listKeys={[
                `${contentKey}.section3.list.item1`,
                `${contentKey}.section3.list.item2`,
                `${contentKey}.section3.list.item3`,
              ]}
            />

            {/* Section 4 - Tool/Solution section */}
            <ArticleSection
              titleKey={`${contentKey}.section4.title`}
              contentKeys={[`${contentKey}.section4.p1`, `${contentKey}.section4.p2`]}
              listKeys={[
                `${contentKey}.section4.list.item1`,
                `${contentKey}.section4.list.item2`,
                `${contentKey}.section4.list.item3`,
              ]}
            />

            {/* Conclusion */}
            <ArticleSection
              titleKey={`${contentKey}.conclusion.title`}
              contentKeys={[`${contentKey}.conclusion.p1`, `${contentKey}.conclusion.p2`]}
              highlightKey={`${contentKey}.conclusion.highlight`}
            />
          </article>

          {/* CTA Section */}
          <ArticleCTA />

          {/* Related Articles */}
          <RelatedArticles articles={relatedArticles} />
        </main>

        {/* Footer */}
        <WaitlistFooter />
      </div>
    </HelmetProvider>
  )
}
