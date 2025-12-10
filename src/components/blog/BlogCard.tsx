import { useTranslation } from 'react-i18next'
import { Link } from '@/components/common/LocalizedLink'
import { motion } from 'framer-motion'
import { Clock, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Article, ArticleCategory } from '@/data/articles'

interface BlogCardProps {
  article: Article
  featured?: boolean
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

export function BlogCard({ article, featured = false, className }: BlogCardProps) {
  const { t } = useTranslation()

  const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <Link
      to={`/blog/${article.slug}`}
      className={cn(featured && 'md:col-span-2 md:row-span-2', className)}
    >
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={cn(
          'group relative h-full overflow-hidden rounded-2xl bg-white',
          'border-border/50 border shadow-sm',
          'transition-all duration-500 ease-out',
          'hover:shadow-primary/5 hover:shadow-xl',
          'hover:border-primary/20'
        )}
      >
        {/* Image Container */}
        <div
          className={cn(
            'relative overflow-hidden',
            featured ? 'aspect-[16/9] md:aspect-[2/1]' : 'aspect-[16/10]'
          )}
        >
          {/* Image with gradient overlay */}
          <div className="from-primary/20 to-primary/10 absolute inset-0 bg-gradient-to-br via-transparent" />
          <div
            className={cn(
              'absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent',
              'transition-opacity duration-500',
              'group-hover:from-black/70 group-hover:via-black/30'
            )}
          />

          {/* Placeholder image - using a gradient since we don't have real images */}
          <div
            className={cn(
              'h-full w-full',
              'from-secondary via-muted to-secondary bg-gradient-to-br',
              'transition-transform duration-700 ease-out',
              'group-hover:scale-105'
            )}
          />

          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span
              className={cn(
                'inline-flex items-center rounded-full px-3 py-1',
                'text-xs font-medium tracking-wide',
                'backdrop-blur-sm',
                categoryColors[article.category]
              )}
            >
              {t(`blog.categories.${article.category}`)}
            </span>
          </div>

          {/* Featured Badge */}
          {featured && (
            <div className="absolute top-4 right-4">
              <span
                className={cn(
                  'inline-flex items-center rounded-full px-3 py-1',
                  'text-xs font-semibold tracking-wide',
                  'bg-primary text-white',
                  'shadow-primary/30 shadow-lg'
                )}
              >
                Featured
              </span>
            </div>
          )}

          {/* Bottom Content Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-5">
            <div className="flex items-center gap-3 text-xs text-white/80">
              <time dateTime={article.publishedAt}>{formattedDate}</time>
              <span className="h-1 w-1 rounded-full bg-white/50" />
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {t('blog.card.readTime', { minutes: article.readingTime })}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className={cn('p-5', featured && 'md:p-6')}>
          <h3
            className={cn(
              'text-foreground font-semibold',
              'line-clamp-2 leading-tight',
              'transition-colors duration-300',
              'group-hover:text-primary',
              featured ? 'text-xl md:text-2xl' : 'text-lg'
            )}
          >
            {t(article.titleKey)}
          </h3>

          <p
            className={cn(
              'text-muted-foreground mt-3',
              'line-clamp-2 leading-relaxed',
              featured ? 'text-base' : 'text-sm'
            )}
          >
            {t(article.descriptionKey)}
          </p>

          {/* Author & CTA Row */}
          <div className="mt-4 flex items-center justify-between">
            {/* Author */}
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'h-9 w-9 rounded-full',
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

            {/* Read More CTA */}
            <motion.span
              className={cn(
                'flex items-center gap-1.5',
                'text-primary text-sm font-medium',
                'opacity-0 transition-opacity duration-300',
                'group-hover:opacity-100'
              )}
              initial={false}
              animate={{ x: 0 }}
              whileHover={{ x: 3 }}
            >
              {t('blog.card.readMore')}
              <ArrowRight className="h-4 w-4" />
            </motion.span>
          </div>
        </div>

        {/* Hover Glow Effect */}
        <div
          className={cn(
            'pointer-events-none absolute inset-0 rounded-2xl',
            'opacity-0 transition-opacity duration-500',
            'group-hover:opacity-100',
            'ring-primary/10 ring-1'
          )}
        />
      </motion.article>
    </Link>
  )
}
