import { useTranslation } from 'react-i18next'
import { Link } from '@/components/common/LocalizedLink'
import { Clock, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Article, ArticleCategory } from '@/data/articles'

interface BlogCardProps {
  article: Article
  className?: string
}

const categoryColors: Record<ArticleCategory, string> = {
  strategy: 'bg-info/10 text-info',
  tips: 'bg-warning/10 text-warning',
  'case-study': 'bg-success/10 text-success',
  news: 'bg-primary/10 text-primary',
  tutorial: 'bg-destructive/10 text-destructive',
  growth: 'bg-accent text-accent-foreground',
}

export function BlogCard({ article, className }: BlogCardProps) {
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
          'group relative h-full overflow-hidden rounded-2xl',
          'border-border/50 bg-card border',
          'transition-all duration-300',
          'hover:border-border hover:shadow-lg'
        )}
      >
        {/* Image Container */}
        <div className="relative aspect-16/10 overflow-hidden">
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

          {/* Subtle overlay for text readability */}
          <div className="from-foreground/40 via-foreground/10 absolute inset-0 bg-linear-to-t to-transparent" />

          {/* Category Badge */}
          <div className="absolute top-4 left-4">
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

          {/* Bottom Content Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-4">
            <div className="text-primary-foreground/90 flex items-center gap-3 text-xs">
              <time dateTime={article.publishedAt}>{formattedDate}</time>
              <span className="bg-primary-foreground/50 h-1 w-1 rounded-full" />
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {t('blog.card.readTime', { minutes: article.readingTime })}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3
            className={cn(
              'text-foreground text-lg font-semibold',
              'line-clamp-2 leading-tight',
              'transition-colors duration-200',
              'group-hover:text-primary'
            )}
          >
            {t(article.titleKey)}
          </h3>

          <p className="text-muted-foreground mt-3 line-clamp-2 text-sm leading-relaxed">
            {t(article.descriptionKey)}
          </p>

          {/* Author & CTA Row */}
          <div className="mt-4 flex items-center justify-between">
            {/* Author */}
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full',
                  'bg-secondary text-foreground text-xs font-medium'
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

            {/* Read More CTA */}
            <span
              className={cn(
                'flex items-center gap-1.5',
                'text-primary text-sm font-medium',
                'opacity-0 transition-opacity duration-200',
                'group-hover:opacity-100'
              )}
            >
              {t('blog.card.readMore')}
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}
