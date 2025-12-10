import { useEffect } from 'react'
import { Outlet, useParams, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const SUPPORTED_LANGUAGES = ['en', 'fr', 'es']

export function LanguageLayout() {
  const { lang } = useParams<{ lang: string }>()
  const { i18n } = useTranslation()

  useEffect(() => {
    if (lang && SUPPORTED_LANGUAGES.includes(lang) && i18n.language !== lang) {
      i18n.changeLanguage(lang)
    }
  }, [lang, i18n])

  // If lang param exists but is not supported, redirect to default
  if (lang && !SUPPORTED_LANGUAGES.includes(lang)) {
    return <Navigate to="/en" replace />
  }

  return <Outlet />
}
