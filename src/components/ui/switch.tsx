'use client'

import * as React from 'react'
import * as SwitchPrimitive from '@radix-ui/react-switch'

import { cn } from '@/lib/utils'

function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        // Base
        'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 transition-all duration-200 outline-none',
        // Unchecked state
        'data-[state=unchecked]:bg-muted data-[state=unchecked]:border-border',
        // Checked state
        'data-[state=checked]:bg-primary data-[state=checked]:border-primary',
        // Focus
        'focus-visible:ring-primary/20 focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2',
        // Hover
        'hover:data-[state=unchecked]:border-border/80',
        'hover:data-[state=checked]:bg-primary/90',
        // Disabled
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          // Base
          'bg-background pointer-events-none block h-5 w-5 rounded-full shadow-md ring-0',
          // Animation
          'transition-transform duration-200 ease-out',
          // Position
          'data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0',
          // Shadow
          'shadow-sm'
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
