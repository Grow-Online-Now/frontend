import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'

/**
 * OAuth Callback Page
 *
 * This page handles OAuth callbacks in the popup window.
 * For most platforms, it shows success and closes.
 * For Facebook, it sends page data back to the parent window for selection.
 *
 * Expected URL params:
 * - success=true/false
 * - platform=facebook|instagram|etc
 * - pendingKey=xxx (Facebook only)
 * - pages=JSON encoded array (Facebook only)
 * - error=message (on failure)
 */
export default function OAuthCallback() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const success = searchParams.get('success') === 'true'
    const platform = searchParams.get('platform')
    const error = searchParams.get('error')
    const pendingKey = searchParams.get('pendingKey')
    const pagesParam = searchParams.get('pages')

    // Handle error case
    if (!success || error) {
      setStatus('error')
      setMessage(error || t('common.errors.connectionFailed'))
      // Close popup after showing error briefly
      setTimeout(() => {
        window.close()
      }, 2000)
      return
    }

    // Handle Facebook with pages to select
    if (platform === 'facebook' && pendingKey && pagesParam) {
      try {
        const pages = JSON.parse(decodeURIComponent(pagesParam))

        // Send message to parent window with Facebook pages data
        if (window.opener) {
          window.opener.postMessage(
            {
              type: 'oauth-callback',
              platform: 'facebook',
              pendingKey,
              pages,
            },
            window.location.origin
          )
        }

        setStatus('success')
        setMessage(t('dashboard.facebook.selectPage.title'))

        // Close popup - parent will show page selector
        setTimeout(() => {
          window.close()
        }, 500)
      } catch {
        setStatus('error')
        setMessage(t('common.errors.invalidResponse'))
        setTimeout(() => {
          window.close()
        }, 2000)
      }
      return
    }

    // Handle other platforms - connection complete
    if (window.opener) {
      window.opener.postMessage(
        {
          type: 'oauth-callback',
          platform,
          success: true,
        },
        window.location.origin
      )
    }

    setStatus('success')
    setMessage(t('dashboard.accounts.modal.success'))

    // Close popup
    setTimeout(() => {
      window.close()
    }, 1000)
  }, [searchParams, t])

  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <div className="text-center">
        {status === 'loading' && (
          <>
            <Loader2 className="text-primary mx-auto h-12 w-12 animate-spin" />
            <p className="text-muted-foreground mt-4">{t('dashboard.accounts.modal.connecting')}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="text-success mx-auto h-12 w-12" />
            <p className="text-foreground mt-4 font-medium">{message}</p>
            <p className="text-muted-foreground mt-2 text-sm">{t('common.closingWindow')}</p>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="text-destructive mx-auto h-12 w-12" />
            <p className="text-foreground mt-4 font-medium">
              {t('common.errors.connectionFailed')}
            </p>
            <p className="text-muted-foreground mt-2 text-sm">{message}</p>
          </>
        )}
      </div>
    </div>
  )
}
