import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

interface ArticleSectionProps {
  titleKey?: string
  contentKeys: string[]
  listKeys?: string[]
  highlightKey?: string
  className?: string
}

export function ArticleSection({
  titleKey,
  contentKeys,
  listKeys,
  highlightKey,
  className,
}: ArticleSectionProps) {
  const { t } = useTranslation()

  return (
    <section className={cn('mt-10', className)}>
      {titleKey && (
        <h2 className="text-foreground text-2xl font-semibold sm:text-3xl">{t(titleKey)}</h2>
      )}

      {contentKeys.map((key, index) => (
        <p
          key={key}
          className={cn(
            'text-muted-foreground leading-relaxed',
            titleKey && index === 0 ? 'mt-4' : 'mt-4',
            'text-base sm:text-lg'
          )}
        >
          {t(key)}
        </p>
      ))}

      {listKeys && listKeys.length > 0 && (
        <ul className="mt-6 space-y-3">
          {listKeys.map((key) => (
            <li key={key} className="flex items-start gap-3">
              <span className="bg-primary mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full" />
              <span className="text-muted-foreground leading-relaxed">{t(key)}</span>
            </li>
          ))}
        </ul>
      )}

      {highlightKey && (
        <div className={cn('border-primary mt-6 rounded-xl border-l-4', 'bg-primary/5 p-6')}>
          <p className="text-foreground font-medium italic">{t(highlightKey)}</p>
        </div>
      )}
    </section>
  )
}
