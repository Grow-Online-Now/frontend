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
        // Platform colors (for platform badges only)
        twitter: 'bg-[rgba(29,155,240,0.15)] text-[#1d9bf0]',
        linkedin: 'bg-[rgba(10,102,194,0.15)] text-[#0a66c2]',
        instagram: 'bg-[rgba(228,64,95,0.15)] text-[#e4405f]',
        tiktok: 'bg-bg-active text-text-primary',
        youtube: 'bg-[rgba(255,0,0,0.15)] text-[#ff0000]',
        facebook: 'bg-[rgba(24,119,242,0.15)] text-[#1877f2]',
        pinterest: 'bg-[rgba(189,8,28,0.15)] text-[#bd081c]',
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
      {icon && (
        <span className="shrink-0 [&>svg]:size-3.5 [&>img]:size-3.5">
          {icon}
        </span>
      )}
      {children}
    </span>
  )
}
