import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { Check, ChevronRight, ChevronDown, ChevronUp, X, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const STORAGE_KEY = 'growonline_onboarding_dismissed'

interface ChecklistItem {
  id: string
  titleKey: string
  descriptionKey: string
  completed: boolean
  route: string
}

interface GettingStartedModalProps {
  hasConnectedAccounts: boolean
  hasCreatedPost: boolean
  hasScheduledPost: boolean
}

export function GettingStartedModal({
  hasConnectedAccounts,
  hasCreatedPost,
  hasScheduledPost,
}: GettingStartedModalProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { lang = 'en' } = useParams<{ lang: string }>()

  const [isDismissed, setIsDismissed] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) === 'true'
  })
  const [isCollapsed, setIsCollapsed] = useState(false)

  const items: ChecklistItem[] = [
    {
      id: 'connect-account',
      titleKey: 'dashboard.gettingStarted.steps.connectAccount.title',
      descriptionKey: 'dashboard.gettingStarted.steps.connectAccount.description',
      completed: hasConnectedAccounts,
      route: `/${lang}/dashboard/accounts`,
    },
    {
      id: 'create-post',
      titleKey: 'dashboard.gettingStarted.steps.createPost.title',
      descriptionKey: 'dashboard.gettingStarted.steps.createPost.description',
      completed: hasCreatedPost,
      route: `/${lang}/dashboard/create`,
    },
    {
      id: 'schedule-post',
      titleKey: 'dashboard.gettingStarted.steps.setupSchedule.title',
      descriptionKey: 'dashboard.gettingStarted.steps.setupSchedule.description',
      completed: hasScheduledPost,
      route: `/${lang}/dashboard/scheduler`,
    },
  ]

  const completedCount = items.filter((item) => item.completed).length
  const allCompleted = completedCount === items.length
  const progress = (completedCount / items.length) * 100

  // Auto-dismiss when all steps are completed
  useEffect(() => {
    if (allCompleted && !isDismissed) {
      const timer = setTimeout(() => {
        handleDismiss()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [allCompleted, isDismissed])

  const handleDismiss = () => {
    setIsDismissed(true)
    localStorage.setItem(STORAGE_KEY, 'true')
  }

  const handleItemClick = (route: string) => {
    navigate(route)
  }

  // Don't render if dismissed or all completed
  if (isDismissed) return null

  return (
    <div
      className={cn(
        'fixed right-6 bottom-6 z-50 w-80 overflow-hidden rounded-2xl border shadow-lg transition-all duration-300',
        'border-border-subtle bg-card',
        'md:right-8 md:bottom-8'
      )}
    >
      {/* Header */}
      <div
        className={cn(
          'flex cursor-pointer items-center justify-between gap-3 p-4',
          'from-primary/10 to-primary/5 bg-gradient-to-r'
        )}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 text-primary flex h-8 w-8 items-center justify-center rounded-full">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-foreground text-sm font-semibold">
              {t('dashboard.gettingStarted.title')}
            </h3>
            <p className="text-muted-foreground text-xs">
              {completedCount}/{items.length} {t('dashboard.gettingStarted.completed')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground h-7 w-7 p-0"
            onClick={(e) => {
              e.stopPropagation()
              handleDismiss()
            }}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">{t('dashboard.gettingStarted.dismiss')}</span>
          </Button>
          {isCollapsed ? (
            <ChevronUp className="text-muted-foreground h-4 w-4" />
          ) : (
            <ChevronDown className="text-muted-foreground h-4 w-4" />
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-surface-muted h-1">
        <div
          className="bg-primary h-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Content */}
      {!isCollapsed && (
        <div className="p-3">
          <div className="space-y-2">
            {items.map((item, index) => (
              <button
                key={item.id}
                onClick={() => !item.completed && handleItemClick(item.route)}
                disabled={item.completed}
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl p-3 text-left transition-all',
                  item.completed ? 'cursor-default opacity-60' : 'hover:bg-accent cursor-pointer'
                )}
              >
                <div
                  className={cn(
                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium',
                    item.completed
                      ? 'bg-success text-success-foreground'
                      : 'bg-surface-muted text-muted-foreground'
                  )}
                >
                  {item.completed ? <Check className="h-3.5 w-3.5" /> : index + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      'truncate text-sm font-medium',
                      item.completed ? 'text-muted-foreground line-through' : 'text-foreground'
                    )}
                  >
                    {t(item.titleKey)}
                  </p>
                </div>
                {!item.completed && (
                  <ChevronRight className="text-muted-foreground h-4 w-4 shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* All completed message */}
      {allCompleted && !isCollapsed && (
        <div className="border-border-subtle bg-success/5 border-t p-4 text-center">
          <p className="text-success text-sm font-medium">
            {t('dashboard.gettingStarted.allComplete')}
          </p>
        </div>
      )}
    </div>
  )
}
