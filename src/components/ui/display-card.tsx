import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'

interface DisplayCardProps {
  titleKey: string
  descriptionKey: string
  icon: React.ReactNode
  children: React.ReactNode
  centerContent?: boolean
  className?: string
  cardHeaderClassName?: string
}

export function DisplayCard({
  titleKey,
  descriptionKey,
  icon,
  children,
  centerContent = false,
  className,
  cardHeaderClassName,
}: DisplayCardProps) {
  const { t } = useTranslation()

  return (
    <Card
      title={t(titleKey)}
      description={t(descriptionKey)}
      icon={icon}
      className={cn('h-full overflow-hidden', className)}
      variant="extra-rounding"
      cardHeaderClassName={cardHeaderClassName}
    >
      <div
        className={cn(
          'border-border-subtle bg-surface-muted flex h-full min-h-40 border-t',
          centerContent ? 'items-center justify-center' : 'items-end'
        )}
      >
        {children}
      </div>
    </Card>
  )
}
