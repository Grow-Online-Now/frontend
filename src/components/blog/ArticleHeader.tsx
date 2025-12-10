import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
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
    <header className="from-secondary/50 to-background relative overflow-hidden bg-gradient-to-b pt-24 pb-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
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
        </motion.div>

        {/* Category Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mt-6"
        >
          <span
            className={cn(
              'inline-flex items-center rounded-full px-3 py-1',
              'text-xs font-medium tracking-wide',
              categoryColors[article.category]
            )}
          >
            {t(`blog.categories.${article.category}`)}
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={cn(
            'text-foreground mt-4 text-3xl font-bold tracking-tight',
            'sm:text-4xl md:text-5xl',
            'leading-tight'
          )}
        >
          {t(article.titleKey)}
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-muted-foreground mt-6 text-lg sm:text-xl"
        >
          {t(article.descriptionKey)}
        </motion.p>

        {/* Meta Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 flex flex-wrap items-center gap-6"
        >
          {/* Author */}
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'h-10 w-10 rounded-full',
                'from-primary/20 to-primary/5 bg-gradient-to-br',
                'flex items-center justify-center',
                'text-primary text-sm font-medium'
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
        </motion.div>
      </div>
    </header>
  )
}
