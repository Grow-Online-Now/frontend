import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

const chipVariants = cva(
  'inline-flex items-center gap-2 rounded-md border text-sm transition-all duration-150',
  {
    variants: {
      variant: {
        default:
          'border-border-subtle bg-surface font-normal text-foreground hover:border-border hover:bg-surface-elevated',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        outline: 'border-border bg-transparent hover:bg-accent/50',
        warning:
          'border-warning/20 bg-warning/10 font-medium text-warning hover:bg-warning/15',
        error:
          'border-destructive/20 bg-destructive/10 font-medium text-destructive hover:bg-destructive/15',
      },
      size: {
        sm: 'h-7 px-2.5 text-xs',
        default: 'h-8 px-3 text-sm',
        lg: 'h-9 px-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

const chipRemoveButtonVariants = cva(
  '-mr-1 flex items-center justify-center rounded-sm opacity-0 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring group-hover:opacity-100',
  {
    variants: {
      variant: {
        default: 'text-muted-foreground hover:bg-destructive/10 hover:text-destructive',
        warning: 'text-warning hover:bg-warning/20 hover:text-warning',
        error: 'text-destructive hover:bg-destructive/20 hover:text-destructive',
      },
      size: {
        sm: 'size-4',
        default: 'size-5',
        lg: 'size-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

interface ChipProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof chipVariants> {
  onRemove?: () => void
  removeAriaLabel?: string
}

function Chip({
  className,
  variant,
  size,
  onRemove,
  removeAriaLabel,
  children,
  ...props
}: ChipProps) {
  return (
    <div
      data-slot="chip"
      className={cn('group', chipVariants({ variant, size }), className)}
      {...props}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          aria-label={removeAriaLabel}
          className={cn(
            chipRemoveButtonVariants({
              variant: variant === 'error' ? 'error' : variant === 'warning' ? 'warning' : 'default',
              size,
            })
          )}
        >
          <X className="size-3" strokeWidth={2} />
        </button>
      )}
    </div>
  )
}

export { Chip, chipVariants, type ChipProps }
