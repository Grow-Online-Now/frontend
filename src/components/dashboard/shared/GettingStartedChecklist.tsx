import { useTranslation } from 'react-i18next'
import { Check, ChevronRight, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ChecklistItem {
  id: string
  titleKey: string
  descriptionKey: string
  completed: boolean
  action: () => void
}

interface GettingStartedChecklistProps {
  items: ChecklistItem[]
  onDismiss?: () => void
  className?: string
}

export function GettingStartedChecklist({
  items,
  onDismiss,
  className,
}: GettingStartedChecklistProps) {
  const { t } = useTranslation()
  const completedCount = items.filter((item) => item.completed).length
  const allCompleted = completedCount === items.length

  if (allCompleted) return null

  return (
    <div className={cn('border-border-subtle bg-card rounded-2xl border p-6', className)}>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-foreground text-base font-semibold">
            {t('dashboard.gettingStarted.title')}
          </h3>
          <p className="text-muted-foreground mt-1 text-sm">
            {t('dashboard.hints.overview.gettingStarted')}
          </p>
        </div>
        {onDismiss && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="text-muted-foreground hover:text-foreground -mt-2 -mr-2"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">{t('dashboard.gettingStarted.dismiss')}</span>
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={item.action}
            disabled={item.completed}
            className={cn(
              'flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-colors',
              item.completed
                ? 'border-success/20 bg-success/5 cursor-default'
                : 'border-border-subtle bg-surface hover:bg-accent'
            )}
          >
            <div
              className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                item.completed
                  ? 'bg-success text-success-foreground'
                  : 'bg-surface-muted text-muted-foreground'
              )}
            >
              {item.completed ? (
                <Check className="h-4 w-4" />
              ) : (
                <span className="text-sm font-medium">{items.indexOf(item) + 1}</span>
              )}
            </div>
            <div className="flex-1">
              <p
                className={cn(
                  'text-sm font-medium',
                  item.completed ? 'text-success' : 'text-foreground'
                )}
              >
                {t(item.titleKey)}
              </p>
              <p className="text-muted-foreground text-xs">{t(item.descriptionKey)}</p>
            </div>
            {!item.completed && <ChevronRight className="text-muted-foreground h-5 w-5 shrink-0" />}
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <div className="bg-surface-muted h-1.5 flex-1 overflow-hidden rounded-full">
          <div
            className="bg-success h-full rounded-full transition-all duration-300"
            style={{ width: `${(completedCount / items.length) * 100}%` }}
          />
        </div>
        <span className="text-muted-foreground text-xs">
          {completedCount}/{items.length}
        </span>
      </div>
    </div>
  )
}
