import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSession, signOut } from '@/lib/auth-client'
import { useNavigate, useParams } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LogOut, Settings, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Link } from '@/components/common/LocalizedLink'

interface DashboardHeaderProps {
  className?: string
}

function DashboardHeaderComponent({ className }: DashboardHeaderProps) {
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
    <header
      className={cn(
        'border-border-subtle bg-surface flex h-16 items-center justify-between border-b px-6',
        className
      )}
    >
      {/* Welcome message */}
      <div>
        <h1 className="text-foreground text-lg font-semibold">
          {t('dashboard.header.welcome', { name: userName.split(' ')[0] })}
        </h1>
      </div>

      {/* User menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="focus-visible:ring-primary flex items-center gap-3 rounded-full ring-offset-2 transition-opacity outline-none hover:opacity-80 focus-visible:ring-2">
            <Avatar className="h-10 w-10 cursor-pointer">
              <AvatarImage src={user?.image || undefined} alt={userName} />
              <AvatarFallback className="bg-primary/10 text-primary">{userInitials}</AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-1.5">
            <p className="text-sm font-medium">{userName}</p>
            <p className="text-muted-foreground text-xs">{userEmail}</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/dashboard/settings" className="flex cursor-pointer items-center gap-2">
              <User className="h-4 w-4" />
              <span>{t('dashboard.header.profile')}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/dashboard/settings" className="flex cursor-pointer items-center gap-2">
              <Settings className="h-4 w-4" />
              <span>{t('dashboard.header.settings')}</span>
            </Link>
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
    </header>
  )
}

export const DashboardHeader = memo(DashboardHeaderComponent)
