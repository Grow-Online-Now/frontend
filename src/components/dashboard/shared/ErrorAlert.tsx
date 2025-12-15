import { AlertCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

interface ErrorAlertProps {
  /** Translation key for the error message */
  messageKey?: string
  /** Direct error message (used if messageKey not provided) */
  message?: string
  className?: string
}

/**
 * Standardized error alert component following the design system
 * Uses semantic error colors with muted background
 */
export function ErrorAlert({ messageKey, message, className }: ErrorAlertProps) {
  const { t } = useTranslation()

  const displayMessage = messageKey ? t(messageKey) : message

  if (!displayMessage) return null

  return (
    <div
      className={cn(
        'border-destructive/30 bg-error-muted text-destructive flex items-center gap-3 rounded-lg border p-4 text-sm',
        className
      )}
      role="alert"
    >
      <AlertCircle className="h-4 w-4 shrink-0" />
      <span>{displayMessage}</span>
    </div>
  )
}
