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
        success: <CircleCheckIcon className="text-success size-4" />,
        info: <InfoIcon className="text-info size-4" />,
        warning: <TriangleAlertIcon className="text-warning size-4" />,
        error: <OctagonXIcon className="text-error size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      toastOptions={{
        className: 'bg-surface-elevated border-border text-foreground rounded-xl shadow-lg',
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
