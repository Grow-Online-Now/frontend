import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  icon?: React.ReactNode
}

export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ className, error, icon, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {icon && (
          <div className="text-muted-foreground pointer-events-none absolute top-1/2 left-4 -translate-y-1/2">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            'glass-input w-full rounded-xl px-4 py-3',
            'text-foreground placeholder:text-muted-foreground',
            'focus:border-primary focus:ring-primary/20 focus:ring-2',
            icon && 'pl-12',
            error && 'border-destructive focus:border-destructive',
            className
          )}
          {...props}
        />
      </div>
    )
  }
)

GlassInput.displayName = 'GlassInput'
