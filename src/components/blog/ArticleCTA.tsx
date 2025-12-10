import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLocalizedHref } from '@/hooks/useLocalizedHref'

export function ArticleCTA() {
  const { t } = useTranslation()
  const localizeHref = useLocalizedHref()

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn(
        'mt-16 rounded-2xl',
        'from-primary/10 via-primary/5 bg-gradient-to-br to-transparent',
        'border-primary/20 border',
        'p-8 sm:p-10'
      )}
    >
      <div className="mx-auto max-w-2xl text-center">
        <h3 className="text-foreground text-2xl font-bold sm:text-3xl">
          {t('blog.article.cta.title')}
        </h3>
        <p className="text-muted-foreground mt-4 text-lg">{t('blog.article.cta.description')}</p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href={localizeHref('/#waitlist')}
            className={cn(
              'glass-button inline-flex items-center gap-2',
              'rounded-full px-8 py-3',
              'text-base font-semibold'
            )}
          >
            {t('blog.article.cta.button')}
            <ArrowRight className="h-4 w-4" />
          </a>
          <p className="text-muted-foreground text-sm">{t('blog.article.cta.note')}</p>
        </div>
      </div>
    </motion.section>
  )
}
