import { useTranslation } from 'react-i18next'
import { Link } from '@/components/common/LocalizedLink'
import { Clock, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Article, ArticleCategory } from '@/data/articles'

interface BlogHeroProps {
  article: Article
  className?: string
}

const categoryColors: Record<ArticleCategory, string> = {
  strategy: 'bg-sky-100 text-sky-700',
  tips: 'bg-amber-100 text-amber-700',
  'case-study': 'bg-emerald-100 text-emerald-700',
  news: 'bg-violet-100 text-violet-700',
  tutorial: 'bg-rose-100 text-rose-700',
  growth: 'bg-cyan-100 text-cyan-700',
}

export function BlogHero({ article, className }: BlogHeroProps) {
  const { t } = useTranslation()

  const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <Link to={`/blog/${article.slug}`} className={cn('block', className)}>
      <article
        className={cn(
          'group relative overflow-hidden rounded-2xl',
          'border-border/50 bg-card border',
          'transition-all duration-300',
          'hover:border-border hover:shadow-lg'
        )}
      >
        <div className="flex flex-col md:flex-row">
          {/* Image Container */}
          <div className="relative md:w-1/2 lg:w-[45%]">
            <div className="aspect-16/10 md:aspect-auto md:h-full md:min-h-[320px]">
              {/* Placeholder gradient (fallback) */}
              <div
                className={cn(
                  'absolute inset-0',
                  'from-secondary via-muted to-secondary/80 bg-linear-to-br'
                )}
              />

              {/* Article Image */}
              <img
                src={article.imageUrl}
                alt={t(article.titleKey)}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-300"
              />

              {/* Subtle overlay for contrast */}
              <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent md:bg-linear-to-r md:from-transparent md:to-black/10" />
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col justify-center p-6 md:p-8 lg:p-10">
            {/* Category Badge */}
            <div className="mb-4">
              <span
                className={cn(
                  'inline-flex items-center rounded-full px-3 py-1',
                  'text-xs font-medium tracking-wide',
                  categoryColors[article.category]
                )}
              >
                {t(`blog.categories.${article.category}`)}
              </span>
            </div>

            {/* Title */}
            <h2
              className={cn(
                'text-foreground text-2xl leading-tight font-semibold md:text-3xl lg:text-4xl',
                'transition-colors duration-200',
                'group-hover:text-primary'
              )}
            >
              {t(article.titleKey)}
            </h2>

            {/* Description */}
            <p className="text-muted-foreground mt-4 line-clamp-3 text-base leading-relaxed md:text-lg">
              {t(article.descriptionKey)}
            </p>

            {/* Meta Row */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full',
                    'bg-secondary text-foreground text-sm font-medium'
                  )}
                >
                  {article.authorName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <div className="flex flex-col">
                  <span className="text-foreground text-sm font-medium">{article.authorName}</span>
                  <span className="text-muted-foreground text-xs">{article.authorRole}</span>
                </div>
              </div>

              <span className="text-border hidden h-4 w-px bg-current md:block" />

              {/* Date & Read Time */}
              <div className="text-muted-foreground flex items-center gap-3 text-sm">
                <time dateTime={article.publishedAt}>{formattedDate}</time>
                <span className="bg-muted-foreground/30 h-1 w-1 rounded-full" />
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {t('blog.card.readTime', { minutes: article.readingTime })}
                </span>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-6">
              <span
                className={cn('inline-flex items-center gap-2', 'text-primary text-sm font-medium')}
              >
                {t('blog.card.readMore')}
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
