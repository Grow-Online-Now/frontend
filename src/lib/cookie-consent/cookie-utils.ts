import * as CookieConsent from 'vanilla-cookieconsent'

// Export helper to check analytics consent
export function hasAnalyticsConsent(): boolean {
  if (typeof window === 'undefined') return false
  return CookieConsent.acceptedCategory('analytics')
}

// Export helper to show preferences modal
export function showCookiePreferences() {
  CookieConsent.showPreferences()
}
