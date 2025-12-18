/**
 * BlueskyConnectModal
 * Modal for connecting Bluesky account with handle and app password
 * Bluesky uses credential-based auth, not OAuth
 */

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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, ExternalLink, Eye, EyeOff } from 'lucide-react'
import { BlueskyIcon } from '@/components/icons/PlatformIcons'

interface BlueskyConnectModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConnect: (handle: string, appPassword: string) => Promise<void>
  isLoading: boolean
  error: string | null
}

export function BlueskyConnectModal({
  open,
  onOpenChange,
  onConnect,
  isLoading,
  error,
}: BlueskyConnectModalProps) {
  const { t } = useTranslation()
  const [handle, setHandle] = useState('')
  const [appPassword, setAppPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!handle.trim() || !appPassword.trim()) return

    try {
      await onConnect(handle.trim(), appPassword.trim())
      // Clear form on success
      setHandle('')
      setAppPassword('')
    } catch {
      // Error is handled by parent via error prop
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setHandle('')
      setAppPassword('')
      onOpenChange(false)
    }
  }

  const isValid = handle.trim().length > 0 && appPassword.trim().length > 0

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center text-center">
          <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--platform-bluesky)]">
            <BlueskyIcon className="h-8 w-8 text-white" />
          </div>
          <DialogTitle className="text-xl">{t('dashboard.bluesky.connect.title')}</DialogTitle>
          <DialogDescription>{t('dashboard.bluesky.connect.description')}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="border-destructive/50 bg-destructive/10 text-destructive rounded-lg border p-3 text-sm">
              {error}
            </div>
          )}

          {/* Handle Input */}
          <div className="space-y-2">
            <Label htmlFor="bluesky-handle">{t('dashboard.bluesky.connect.handleLabel')}</Label>
            <Input
              id="bluesky-handle"
              type="text"
              placeholder={t('dashboard.bluesky.connect.handlePlaceholder')}
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              disabled={isLoading}
              autoComplete="username"
            />
            <p className="text-muted-foreground text-xs">
              {t('dashboard.bluesky.connect.handleHint')}
            </p>
          </div>

          {/* App Password Input */}
          <div className="space-y-2">
            <Label htmlFor="bluesky-password">
              {t('dashboard.bluesky.connect.appPasswordLabel')}
            </Label>
            <div className="relative">
              <Input
                id="bluesky-password"
                type={showPassword ? 'text' : 'password'}
                placeholder={t('dashboard.bluesky.connect.appPasswordPlaceholder')}
                value={appPassword}
                onChange={(e) => setAppPassword(e.target.value)}
                disabled={isLoading}
                autoComplete="current-password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-muted-foreground text-xs">
              {t('dashboard.bluesky.connect.appPasswordHint')}
            </p>
          </div>

          {/* App Password Link */}
          <a
            href="https://bsky.app/settings/app-passwords"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 inline-flex items-center gap-1 text-sm transition-colors"
          >
            {t('dashboard.bluesky.connect.createAppPassword')}
            <ExternalLink className="h-3 w-3" />
          </a>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isLoading}
            >
              {t('common.actions.cancel')}
            </Button>
            <Button type="submit" className="flex-1" disabled={!isValid || isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('dashboard.bluesky.connect.connecting')}
                </>
              ) : (
                t('dashboard.bluesky.connect.connect')
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
