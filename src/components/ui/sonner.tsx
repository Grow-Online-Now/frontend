import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from 'lucide-react'
import { Toaster as Sonner, type ToasterProps } from 'sonner'

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4 text-success" />,
        info: <InfoIcon className="size-4 text-info" />,
        warning: <TriangleAlertIcon className="size-4 text-warning" />,
        error: <OctagonXIcon className="size-4 text-error" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      toastOptions={{
        className:
          'bg-surface-elevated border-border text-foreground rounded-xl shadow-lg',
        descriptionClassName: 'text-muted-foreground',
      }}
      style={
        {
          '--normal-bg': 'var(--bg-elevated)',
          '--normal-text': 'var(--text-primary)',
          '--normal-border': 'var(--border-default)',
          '--success-bg': 'var(--bg-elevated)',
          '--success-text': 'var(--text-primary)',
          '--success-border': 'var(--color-success)',
          '--error-bg': 'var(--bg-elevated)',
          '--error-text': 'var(--text-primary)',
          '--error-border': 'var(--color-error)',
          '--border-radius': '12px',
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
