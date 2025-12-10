import { createContext, useContext } from 'react'
import type { PlatformConfig, PlatformTheme } from '@/config/platforms'

interface PlatformThemeContextValue {
  config: PlatformConfig
  theme: PlatformTheme
}

export const PlatformThemeContext = createContext<PlatformThemeContextValue | null>(null)

export function usePlatformTheme() {
  const context = useContext(PlatformThemeContext)
  if (!context) {
    throw new Error('usePlatformTheme must be used within a PlatformThemeProvider')
  }
  return context
}

export function usePlatformConfig() {
  const context = useContext(PlatformThemeContext)
  if (!context) {
    throw new Error('usePlatformConfig must be used within a PlatformThemeProvider')
  }
  return context.config
}
