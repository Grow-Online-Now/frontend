import { useTranslation } from 'react-i18next'
import { Clock, Calendar, ArrowLeft } from 'lucide-react'
import { Link } from '@/components/common/LocalizedLink'
import { cn } from '@/lib/utils'
import type { Article, ArticleCategory } from '@/data/articles'

interface ArticleHeaderProps {
  article: Article
}

const categoryColors: Record<ArticleCategory, string> = {
  strategy: 'bg-sky-100 text-sky-700',
  tips: 'bg-amber-100 text-amber-700',
  'case-study': 'bg-emerald-100 text-emerald-700',
  news: 'bg-violet-100 text-violet-700',
  tutorial: 'bg-rose-100 text-rose-700',
  growth: 'bg-cyan-100 text-cyan-700',
}

export function ArticleHeader({ article }: ArticleHeaderProps) {
  const { t } = useTranslation()

  const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <header className="from-secondary/50 to-background relative overflow-hidden bg-gradient-to-b pt-32 pb-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div>
          <Link
            to="/blog"
            className={cn(
              'inline-flex items-center gap-2 text-sm font-medium',
              'text-muted-foreground hover:text-primary',
              'transition-colors duration-200'
            )}
          >
            <ArrowLeft className="h-4 w-4" />
            {t('blog.article.backToBlog')}
          </Link>
        </div>

        {/* Category Badge */}
        <div className="mt-6">
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
        <h1
          className={cn(
            'text-foreground mt-4 text-3xl font-bold tracking-tight',
            'sm:text-4xl md:text-5xl',
            'leading-tight'
          )}
        >
          {t(article.titleKey)}
        </h1>

        {/* Description */}
        <p className="text-muted-foreground mt-6 text-lg sm:text-xl">{t(article.descriptionKey)}</p>

        {/* Meta Info */}
        <div className="mt-8 flex flex-wrap items-center gap-6">
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

          {/* Divider */}
          <div className="bg-border hidden h-6 w-px sm:block" />

          {/* Date */}
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4" />
            <time dateTime={article.publishedAt}>{formattedDate}</time>
          </div>

          {/* Reading Time */}
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4" />
            <span>{t('blog.card.readTime', { minutes: article.readingTime })}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
