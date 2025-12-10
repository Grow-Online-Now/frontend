import { cva } from 'class-variance-authority'

interface CardWrapperProps {
  children: React.ReactNode
  padding?: 'none' | 'xs' | 'xs-2' | 'sm' | 'md'
  rounded?: 'none' | 'xs' | 'sm' | 'md' | 'full'
  variant?: 'default' | 'dark-border'
  className?: string
}

export function CardWrapper({
  children,
  variant = 'default',
  padding = 'md',
  rounded = 'md',
  className,
}: CardWrapperProps) {
  const cardWrapperStyles = cva('text-left border bg-card', {
    variants: {
      padding: {
        none: '',
        xs: 'p-1.5',
        'xs-2': 'p-2',
        sm: 'p-3',
        md: 'p-5',
      },
      rounded: {
        none: '',
        xs: 'rounded-[19px]',
        sm: 'rounded-[38px]',
        md: 'rounded-[52px]',
        full: 'rounded-full',
      },
      variant: {
        default: 'border-border-subtle',
        'dark-border': 'border-border-muted',
      },
    },
  })

  return (
    <div className={cardWrapperStyles({ padding, rounded, variant, className })}>{children}</div>
  )
}
