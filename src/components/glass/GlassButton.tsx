import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

interface GlassButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  | 'onAnimationStart'
  | 'onAnimationEnd'
  | 'onAnimationIteration'
  | 'onDrag'
  | 'onDragStart'
  | 'onDragEnd'
> {
  children: React.ReactNode
  loading?: boolean
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export function GlassButton({
  children,
  loading = false,
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  ...props
}: GlassButtonProps) {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  const variantClasses = {
    primary: 'glass-button text-white font-semibold',
    secondary: 'glass bg-secondary hover:bg-secondary/80 border-border text-foreground',
    ghost: 'bg-transparent hover:bg-secondary border-transparent text-foreground',
  }

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={cn(
        'rounded-xl font-medium transition-all duration-200',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'flex items-center justify-center gap-2',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </motion.button>
  )
}
