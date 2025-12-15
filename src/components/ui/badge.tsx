import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/**
 * Badge variants following the design system
 * Uses flat colors with semantic variants for status/feedback
 */
const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        // Default - neutral
        default: 'bg-bg-active text-text-secondary',
        // Semantic variants
        success: 'bg-success-muted text-success',
        warning: 'bg-warning-muted text-warning',
        error: 'bg-error-muted text-destructive',
        info: 'bg-info-muted text-info',
        // Platform colors (for platform badges only) - using CSS variables
        twitter: 'bg-[var(--platform-twitter)]/15 text-[var(--platform-twitter)]',
        linkedin: 'bg-[var(--platform-linkedin)]/15 text-[var(--platform-linkedin)]',
        instagram: 'bg-[var(--platform-instagram)]/15 text-[var(--platform-instagram)]',
        tiktok: 'bg-bg-active text-text-primary',
        youtube: 'bg-[var(--platform-youtube)]/15 text-[var(--platform-youtube)]',
        facebook: 'bg-[var(--platform-facebook)]/15 text-[var(--platform-facebook)]',
        pinterest: 'bg-[var(--platform-pinterest)]/15 text-[var(--platform-pinterest)]',
        // Additional utility variants
        outline: 'border border-border-default bg-transparent text-text-secondary',
        secondary: 'bg-bg-hover text-text-secondary',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-xs',
        lg: 'px-3 py-1.5 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>['variant']>

interface BadgeProps extends VariantProps<typeof badgeVariants> {
  children: React.ReactNode
  icon?: React.ReactNode
  className?: string
}

export function Badge({ children, variant, size, icon, className }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)}>
      {icon && <span className="shrink-0 [&>img]:size-3.5 [&>svg]:size-3.5">{icon}</span>}
      {children}
    </span>
  )
}
