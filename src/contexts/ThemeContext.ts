/**
 * Theme Context
 * Provides theme state to the application
 */

import { createContext } from 'react'

type Theme = 'light' | 'dark' | 'system'

export interface ThemeContextValue {
  theme: Theme
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  isDark: boolean
  isLight: boolean
  isSystem: boolean
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)
