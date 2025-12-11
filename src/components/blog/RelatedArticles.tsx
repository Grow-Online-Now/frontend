import { useTranslation } from 'react-i18next'
import { BlogCard } from './BlogCard'
import type { Article } from '@/data/articles'

interface RelatedArticlesProps {
  articles: Article[]
}

export function RelatedArticles({ articles }: RelatedArticlesProps) {
  const { t } = useTranslation()

  if (articles.length === 0) return null

  return (
    <section className="border-border mt-20 border-t pt-16">
      <div>
        <h2 className="text-foreground text-2xl font-bold sm:text-3xl">
          {t('blog.article.relatedTitle')}
        </h2>
        <p className="text-muted-foreground mt-2">{t('blog.article.relatedSubtitle')}</p>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.slice(0, 3).map((article) => (
          <BlogCard key={article.slug} article={article} />
        ))}
      </div>
    </section>
  )
}
