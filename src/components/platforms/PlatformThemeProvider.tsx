import { type ReactNode } from 'react'
import type { PlatformConfig } from '@/config/platforms'
import { PlatformThemeContext } from '@/lib/platforms'

interface PlatformThemeProviderProps {
  config: PlatformConfig
  children: ReactNode
}

export function PlatformThemeProvider({ config, children }: PlatformThemeProviderProps) {
  return (
    <PlatformThemeContext.Provider value={{ config, theme: config.theme }}>
      {children}
    </PlatformThemeContext.Provider>
  )
}
