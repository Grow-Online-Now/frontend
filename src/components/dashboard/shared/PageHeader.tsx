import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  titleKey: string
  descriptionKey?: string
  actions?: React.ReactNode
  className?: string
}

export function PageHeader({ titleKey, descriptionKey, actions, className }: PageHeaderProps) {
  const { t } = useTranslation()

  return (
    <div
      className={cn(
        'mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between',
        className
      )}
    >
      <div>
        <h1 className="text-foreground text-xl font-semibold tracking-tight sm:text-2xl">
          {t(titleKey)}
        </h1>
        {descriptionKey && (
          <p className="text-muted-foreground mt-1 text-sm">{t(descriptionKey)}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  )
}
