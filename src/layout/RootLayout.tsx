import { Outlet, ScrollRestoration } from 'react-router-dom'
import { ThemeProvider } from '@/components/providers/ThemeProvider'

function RootLayout() {
  return (
    <ThemeProvider defaultTheme="system">
      <ScrollRestoration />
      <Outlet />
    </ThemeProvider>
  )
}

export default RootLayout
