import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { SocialPlatform, FacebookPage } from '@/types/connections'

interface OAuthResult {
  success: boolean
  platform: SocialPlatform
  error: string | null
  pendingKey: string | null
  facebookPages: FacebookPage[] | null
}

/**
 * Hook to detect and parse OAuth callback query parameters
 * Returns result once, then clears params and returns null
 *
 * Query params handled:
 * - connected=instagram (success)
 * - error=token_expired&platform=instagram (failure)
 * - platform=facebook&pendingKey=xxx&pages=JSON (Facebook page selection)
 */
export function useOAuthResult(): OAuthResult | null {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [result, setResult] = useState<OAuthResult | null>(null)
  const processedRef = useRef(false)

  useEffect(() => {
    // Only process once
    if (processedRef.current) return

    const connected = searchParams.get('connected')
    const error = searchParams.get('error')
    const platform = searchParams.get('platform')
    const pendingKey = searchParams.get('pendingKey')
    const pagesParam = searchParams.get('pages')

    // No OAuth callback detected
    if (!connected && !error && !platform) {
      return
    }

    // Mark as processed immediately
    processedRef.current = true

    // Parse Facebook pages if present
    let facebookPages: FacebookPage[] | null = null
    if (pagesParam) {
      try {
        facebookPages = JSON.parse(decodeURIComponent(pagesParam)) as FacebookPage[]
      } catch {
        facebookPages = null
      }
    }

    // Get translated error message
    const getErrorMessage = (errorCode: string, platformName: string | null) => {
      const errorMap: Record<string, string> = {
        token_expired: t('dashboard.accounts.oauth.error.tokenExpired'),
        access_denied: t('dashboard.accounts.oauth.error.accessDenied'),
        invalid_state: t('dashboard.accounts.oauth.error.invalidState'),
        rate_limit: t('dashboard.accounts.oauth.error.rateLimit'),
      }

      if (errorMap[errorCode]) {
        return errorMap[errorCode]
      }

      const translatedPlatform = platformName
        ? t(`dashboard.accounts.platforms.${platformName}`)
        : t('common.account', 'account')

      return t('dashboard.accounts.oauth.error.generic', { platform: translatedPlatform })
    }

    // Build result
    let oauthResult: OAuthResult | null = null

    if (connected) {
      // Success: platform connected
      oauthResult = {
        success: true,
        platform: connected as SocialPlatform,
        error: null,
        pendingKey: null,
        facebookPages: null,
      }
    } else if (platform === 'facebook' && pendingKey && facebookPages) {
      // Facebook page selection pending
      oauthResult = {
        success: true,
        platform: 'facebook',
        error: null,
        pendingKey,
        facebookPages,
      }
    } else if (error && platform) {
      // Error case
      oauthResult = {
        success: false,
        platform: platform as SocialPlatform,
        error: getErrorMessage(error, platform),
        pendingKey: null,
        facebookPages: null,
      }
    }

    // Set result and clear URL params
    if (oauthResult) {
      setResult(oauthResult)

      // Clear URL params
      const newParams = new URLSearchParams(searchParams)
      newParams.delete('connected')
      newParams.delete('error')
      newParams.delete('platform')
      newParams.delete('pendingKey')
      newParams.delete('pages')
      setSearchParams(newParams, { replace: true })
    }
  }, [searchParams, setSearchParams, t])

  return result
}
