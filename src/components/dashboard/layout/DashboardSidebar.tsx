import { memo, useState } from 'react'
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
  Sun,
  Moon,
  ImageIcon,
  Zap,
} from 'lucide-react'
import { CreatePostTypeModal } from '@/components/dashboard/shared/CreatePostTypeModal'
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
import { useTheme } from '@/hooks/useTheme'
import { useSubscription } from '@/hooks/useSubscription'
import { WorkspaceSelector } from '@/components/dashboard/workspace/WorkspaceSelector'
import { PLAN_DISPLAY_NAMES } from '@/types/subscription'
import { useAutomations } from '@/hooks/useAutomations'

interface NavCategory {
  labelKey: string
  items: (SidebarNavItem & { action?: 'openCreateModal' })[]
}

const baseNavCategories: NavCategory[] = [
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
    labelKey: 'dashboard.nav.categories.automate',
    items: [
      {
        labelKey: 'dashboard.nav.automations',
        icon: Zap,
        href: '/dashboard/automations',
      },
    ],
  },
  {
    labelKey: 'dashboard.nav.categories.create',
    items: [
      {
        labelKey: 'dashboard.nav.createPost',
        icon: PenSquare,
        href: '/dashboard/create/text', // Fallback href, but action takes precedence
        action: 'openCreateModal',
      },
      {
        labelKey: 'dashboard.nav.media',
        icon: ImageIcon,
        href: '/dashboard/media',
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
  const { isDark, toggleTheme } = useTheme()
  const { subscription } = useSubscription()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const { automations } = useAutomations()
  const hasFailedAutomations = automations.some(
    (a) => a.runs?.some((r) => r.status === 'failed') || a.status === 'failed'
  )

  // Build nav with dynamic dot on automations
  const navCategories = baseNavCategories.map((cat) => ({
    ...cat,
    items: cat.items.map((item) =>
      item.href === '/dashboard/automations'
        ? { ...item, dot: hasFailedAutomations }
        : item
    ),
  }))

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
      <div className="border-sidebar-border flex h-16 items-center justify-center border-b px-6">
        <Logo size="sm" showText />
      </div>

      {/* Workspace Selector */}
      <div className="border-sidebar-border border-b px-4 py-3">
        <WorkspaceSelector />
      </div>

      {/* Create Post Quick Action */}
      <div className="px-4 py-4">
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="w-full justify-center gap-2 font-medium transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          <span>{t('dashboard.nav.createPost')}</span>
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 pb-4">
        {navCategories.map((category, categoryIndex) => (
          <div key={category.labelKey} className={cn(categoryIndex > 0 && 'mt-6')}>
            <h3 className="text-muted-foreground/60 mb-2 px-2 text-xs font-medium tracking-[0.05em] uppercase">
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
                      <item.icon className="size-5 opacity-40" />
                      <span className="flex-1">{t(item.labelKey)}</span>
                      <span className="bg-muted text-muted-foreground/70 rounded px-1.5 py-0.5 text-xs font-medium tracking-wide uppercase">
                        {t('dashboard.nav.comingSoon')}
                      </span>
                    </span>
                  ) : item.action === 'openCreateModal' ? (
                    <button
                      type="button"
                      onClick={() => setIsCreateModalOpen(true)}
                      className={cn(
                        'group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-150',
                        'text-muted-foreground hover:bg-accent/50 hover:text-foreground font-normal'
                      )}
                    >
                      <item.icon className="size-5 opacity-70 transition-opacity group-hover:opacity-100" />
                      <span>{t(item.labelKey)}</span>
                    </button>
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
                      <item.icon className="size-5 opacity-70 transition-opacity group-hover:opacity-100" />
                      <span className="flex-1">{t(item.labelKey)}</span>
                      {item.dot && (
                        <span className="bg-error h-2 w-2 rounded-full" />
                      )}
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* User Profile Section */}
      <div className="border-sidebar-border border-t p-4">
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
              {subscription && (
                <span className="bg-primary/10 text-primary mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium">
                  {PLAN_DISPLAY_NAMES[subscription.plan]}
                </span>
              )}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <NavLink to="/dashboard/settings" className="flex cursor-pointer items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>{t('dashboard.header.settings')}</span>
              </NavLink>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={toggleTheme} className="cursor-pointer">
              {isDark ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
              <span>{isDark ? t('common.theme.light') : t('common.theme.dark')}</span>
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

      {/* Create Post Type Modal */}
      <CreatePostTypeModal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} />
    </aside>
  )
}

export const DashboardSidebar = memo(DashboardSidebarComponent)
