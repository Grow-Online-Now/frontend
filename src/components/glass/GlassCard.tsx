import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'subtle' | 'strong'
  hover?: boolean
  as?: 'div' | 'section' | 'article'
}

export function GlassCard({
  children,
  className,
  variant = 'default',
  hover = false,
  as: Component = 'div',
}: GlassCardProps) {
  const variantClasses = {
    default: 'glass',
    subtle: 'glass-card-subtle',
    strong: 'glass-card-strong',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={cn(
        'rounded-3xl p-6',
        variantClasses[variant],
        hover && 'glass-hover cursor-pointer',
        className
      )}
      {...(Component !== 'div' && { as: Component })}
    >
      {children}
    </motion.div>
  )
}
