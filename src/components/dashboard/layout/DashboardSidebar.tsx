import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSession, signOut } from '@/lib/auth-client'
import { useNavigate, useParams } from 'react-router-dom'
import { NavLink } from '@/components/common/LocalizedLink'
import {
  LayoutDashboard,
  BarChart3,
  Calendar,
  PenSquare,
  Users,
  Settings,
  Plus,
  LogOut,
  ChevronRight,
  FileText,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SidebarNavItem } from '@/types/dashboard'
import { Logo } from '@/components/ui/logo'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface NavCategory {
  labelKey: string
  items: SidebarNavItem[]
}

const navCategories: NavCategory[] = [
  {
    labelKey: 'dashboard.nav.categories.general',
    items: [
      {
        labelKey: 'dashboard.nav.overview',
        icon: LayoutDashboard,
        href: '/dashboard',
      },
      {
        labelKey: 'dashboard.nav.analytics',
        icon: BarChart3,
        href: '/dashboard/analytics',
        comingSoon: true,
      },
    ],
  },
  {
    labelKey: 'dashboard.nav.categories.posts',
    items: [
      {
        labelKey: 'dashboard.nav.allPosts',
        icon: FileText,
        href: '/dashboard/posts',
      },
      {
        labelKey: 'dashboard.nav.calendar',
        icon: Calendar,
        href: '/dashboard/scheduler',
      },
      {
        labelKey: 'dashboard.nav.createPost',
        icon: PenSquare,
        href: '/dashboard/posts/create',
      },
    ],
  },
  {
    labelKey: 'dashboard.nav.categories.configuration',
    items: [
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
    ],
  },
]

interface DashboardSidebarProps {
  className?: string
}

function DashboardSidebarComponent({ className }: DashboardSidebarProps) {
  const { t } = useTranslation()
  const { data: session } = useSession()
  const navigate = useNavigate()
  const { lang = 'en' } = useParams<{ lang: string }>()

  const user = session?.user
  const userName = user?.name || 'User'
  const userEmail = user?.email || ''
  const userInitials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const handleSignOut = async () => {
    await signOut()
    navigate(`/${lang}/login`)
  }

  return (
    <aside
      className={cn(
        'border-sidebar-border bg-sidebar flex h-screen w-64 flex-col border-r',
        className
      )}
    >
      {/* Logo */}
      <div className="border-sidebar-border flex h-16 items-center border-b px-6">
        <Logo size="sm" showText />
      </div>

      {/* Create Post Quick Action */}
      <div className="px-3 pt-4 pb-2">
        <Button
          asChild
          className="group from-primary to-primary/90 shadow-primary/25 hover:shadow-primary/30 dark:shadow-primary/15 dark:hover:shadow-primary/20 relative w-full justify-center gap-2 overflow-hidden bg-gradient-to-r font-medium shadow-md transition-all duration-200 hover:-translate-y-px hover:shadow-lg active:translate-y-0 active:shadow-md"
        >
          <NavLink to="/dashboard/posts/create">
            {/* Shimmer effect overlay */}
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <Plus className="h-4 w-4 transition-transform duration-200 group-hover:rotate-90" />
            <span>{t('dashboard.nav.createPost')}</span>
          </NavLink>
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        {navCategories.map((category, categoryIndex) => (
          <div key={category.labelKey} className={cn(categoryIndex > 0 && 'mt-6')}>
            <h3 className="text-muted-foreground/60 mb-2 px-3 text-[11px] font-medium tracking-[0.05em] uppercase">
              {t(category.labelKey)}
            </h3>
            <ul className="space-y-0.5">
              {category.items.map((item) => (
                <li key={item.href}>
                  {item.comingSoon ? (
                    <span
                      className={cn(
                        'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm',
                        'text-muted-foreground/50 cursor-not-allowed'
                      )}
                    >
                      <item.icon className="h-[18px] w-[18px] opacity-40" />
                      <span className="flex-1">{t(item.labelKey)}</span>
                      <span className="bg-muted text-muted-foreground/70 rounded px-1.5 py-0.5 text-[10px] font-medium tracking-wide uppercase">
                        {t('dashboard.nav.comingSoon')}
                      </span>
                    </span>
                  ) : (
                    <NavLink
                      to={item.href}
                      end={item.href === '/dashboard' || item.href === '/dashboard/posts'}
                      className={({ isActive }) =>
                        cn(
                          'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-150',
                          isActive
                            ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                            : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground font-normal'
                        )
                      }
                    >
                      <item.icon className="h-[18px] w-[18px] opacity-70 transition-opacity group-hover:opacity-100" />
                      <span>{t(item.labelKey)}</span>
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* User Profile Section */}
      <div className="border-sidebar-border border-t p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="hover:bg-accent/50 flex w-full items-center gap-3 rounded-lg p-2 transition-all duration-150">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user?.image || undefined} alt={userName} />
                <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <p className="text-foreground truncate text-sm font-medium">{userName}</p>
                <p className="text-muted-foreground truncate text-xs">{userEmail}</p>
              </div>
              <ChevronRight className="text-muted-foreground/50 h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top" className="w-56">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">{userName}</p>
              <p className="text-muted-foreground text-xs">{userEmail}</p>
              <span className="bg-primary/10 text-primary mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium">
                {t('dashboard.user.plan')}
              </span>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <NavLink to="/dashboard/settings" className="flex cursor-pointer items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>{t('dashboard.header.settings')}</span>
              </NavLink>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>{t('dashboard.header.signOut')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  )
}

export const DashboardSidebar = memo(DashboardSidebarComponent)
