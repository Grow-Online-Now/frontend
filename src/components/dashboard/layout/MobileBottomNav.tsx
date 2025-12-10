import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink } from '@/components/common/LocalizedLink'
import { LayoutDashboard, Calendar, Users, Settings, PlusCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SidebarNavItem } from '@/types/dashboard'

const navItems: SidebarNavItem[] = [
  {
    labelKey: 'dashboard.nav.overview',
    icon: LayoutDashboard,
    href: '/dashboard',
  },
  {
    labelKey: 'dashboard.nav.calendar',
    icon: Calendar,
    href: '/dashboard/scheduler',
  },
  {
    labelKey: 'dashboard.nav.create',
    icon: PlusCircle,
    href: '/dashboard/campaign/create',
  },
  {
    labelKey: 'dashboard.nav.accounts',
    icon: Users,
    href: '/dashboard/accounts',
  },
  {
    labelKey: 'dashboard.nav.settings',
    icon: Settings,
    href: '/dashboard/settings',
  },
]

interface MobileBottomNavProps {
  className?: string
}

function MobileBottomNavComponent({ className }: MobileBottomNavProps) {
  const { t } = useTranslation()

  return (
    <nav
      className={cn(
        'border-border-subtle bg-surface fixed right-0 bottom-0 left-0 z-50 border-t md:hidden',
        className
      )}
    >
      <ul className="flex h-16 items-center justify-around">
        {navItems.map((item) => (
          <li key={item.href}>
            <NavLink
              to={item.href}
              end={item.href === '/dashboard'}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium transition-colors',
                  isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                )
              }
            >
              <item.icon className="h-5 w-5" />
              <span>{t(item.labelKey)}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export const MobileBottomNav = memo(MobileBottomNavComponent)
