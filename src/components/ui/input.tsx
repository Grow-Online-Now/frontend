import * as React from 'react'

import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Base styles
        'bg-background text-foreground h-10 w-full min-w-0 rounded-lg border px-3.5 py-2 text-sm transition-all duration-150 outline-none',
        // Border - more visible
        'border-border',
        // Placeholder
        'placeholder:text-muted-foreground/50',
        // Selection
        'selection:bg-primary selection:text-primary-foreground',
        // Hover
        'hover:border-border-muted',
        // Focus
        'focus-visible:border-primary focus-visible:ring-primary/15 focus-visible:ring-[3px]',
        // Disabled/readonly
        'disabled:bg-muted/50 disabled:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-70',
        'read-only:bg-muted/50 read-only:text-muted-foreground read-only:cursor-not-allowed',
        // Invalid
        'aria-invalid:border-destructive aria-invalid:ring-destructive/10',
        // File input
        'file:text-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium',
        className
      )}
      {...props}
    />
  )
}

export { Input }
