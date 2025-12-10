import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Facebook, Building2, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { selectFacebookPage } from '@/services/connections.service'
import { ApiError } from '@/lib/api-client'
import type { FacebookPage, Connection } from '@/types/connections'

interface FacebookPageSelectorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pendingKey: string
  pages: FacebookPage[]
  onSuccess: (connection: Connection) => void
  onCancel: () => void
}

export function FacebookPageSelector({
  open,
  onOpenChange,
  pendingKey,
  pages,
  onSuccess,
  onCancel,
}: FacebookPageSelectorProps) {
  const { t } = useTranslation()
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConfirm = async () => {
    if (!selectedPageId) return

    setIsLoading(true)
    setError(null)

    try {
      const connection = await selectFacebookPage(pendingKey, selectedPageId)
      onSuccess(connection)
      onOpenChange(false)
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : t('dashboard.facebook.selectPage.error')
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    onCancel()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center text-center">
          <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1877F2] text-white">
            <Facebook className="h-8 w-8" />
          </div>
          <DialogTitle className="text-xl">{t('dashboard.facebook.selectPage.title')}</DialogTitle>
          <DialogDescription>{t('dashboard.facebook.selectPage.description')}</DialogDescription>
        </DialogHeader>

        {error && (
          <div className="border-destructive/50 bg-destructive/10 text-destructive rounded-lg border p-3 text-sm">
            {error}
          </div>
        )}

        {pages.length === 0 ? (
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <p className="text-muted-foreground text-sm">
              {t('dashboard.facebook.selectPage.noPages')}
            </p>
          </div>
        ) : (
          <div className="max-h-64 space-y-2 overflow-y-auto py-2">
            {pages.map((page) => (
              <button
                key={page.id}
                type="button"
                onClick={() => setSelectedPageId(page.id)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors',
                  selectedPageId === page.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border-subtle hover:border-border hover:bg-muted/50'
                )}
              >
                <div className="bg-muted flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                  <Building2 className="text-muted-foreground h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-foreground truncate font-medium">{page.name}</p>
                  <p className="text-muted-foreground truncate text-sm">
                    {t('dashboard.facebook.selectPage.category', {
                      category: page.category,
                    })}
                  </p>
                </div>
                <div
                  className={cn(
                    'h-5 w-5 shrink-0 rounded-full border-2 transition-colors',
                    selectedPageId === page.id ? 'border-primary bg-primary' : 'border-border'
                  )}
                >
                  {selectedPageId === page.id && (
                    <div className="flex h-full w-full items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-white" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        <p className="text-muted-foreground text-center text-xs">
          {t('dashboard.facebook.selectPage.hint')}
        </p>

        <div className="flex gap-3">
          <Button variant="outline" onClick={handleCancel} className="flex-1" disabled={isLoading}>
            {t('dashboard.facebook.selectPage.cancel')}
          </Button>
          <Button
            onClick={handleConfirm}
            className="flex-1"
            disabled={!selectedPageId || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('dashboard.facebook.selectPage.loading')}
              </>
            ) : (
              t('dashboard.facebook.selectPage.confirm')
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
