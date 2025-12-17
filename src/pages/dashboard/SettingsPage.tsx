import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSession } from '@/lib/auth-client'
import { PageHeader } from '@/components/dashboard/shared/PageHeader'
import { DashboardCard } from '@/components/dashboard/shared/DashboardCard'
import { InfoHint } from '@/components/dashboard/shared/InfoHint'
import { TooltipIcon } from '@/components/dashboard/shared/TooltipIcon'
import { WorkspaceSettings } from '@/components/dashboard/settings/WorkspaceSettings'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useNavigate, useParams } from 'react-router-dom'
import { cn } from '@/lib/utils'
import i18n from '@/i18n'

export default function SettingsPage() {
  const { t } = useTranslation()
  const { data: session } = useSession()
  const navigate = useNavigate()
  const { lang = 'en' } = useParams<{ lang: string }>()

  const user = session?.user
  const [name, setName] = useState(user?.name || '')
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const userInitials = (user?.name || 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const handleSaveProfile = async () => {
    setIsSaving(true)
    // TODO: Implement profile update API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  const handleLanguageChange = (newLang: string) => {
    i18n.changeLanguage(newLang)
    // Navigate to the same page with new language
    const currentPath = window.location.pathname.replace(`/${lang}`, `/${newLang}`)
    navigate(currentPath, { replace: true })
  }

  return (
    <div className="max-w-2xl">
      <PageHeader
        titleKey="dashboard.settings.title"
        descriptionKey="dashboard.settings.description"
      />

      {/* Profile Section */}
      <DashboardCard titleKey="dashboard.settings.profile.title" className="mb-6">
        <InfoHint textKey="dashboard.hints.settings.profile" variant="tip" className="mb-6" />
        <div className="space-y-5">
          {/* Avatar */}
          <div className="border-border-subtle flex items-center gap-4 border-b pb-5">
            <Avatar className="border-border-subtle h-16 w-16 rounded-2xl border-2">
              <AvatarImage src={user?.image || undefined} alt={user?.name || ''} />
              <AvatarFallback className="bg-primary/10 text-primary rounded-2xl text-lg font-semibold">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2">
              <p className="text-muted-foreground text-sm">
                {t('dashboard.settings.profile.avatar')}
              </p>
              <Button variant="outline" size="sm" className="w-fit rounded-lg text-sm font-medium">
                {t('dashboard.settings.profile.changeAvatar')}
              </Button>
            </div>
          </div>

          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-muted-foreground text-sm font-medium">
              {t('dashboard.settings.profile.name')}
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('dashboard.settings.profile.namePlaceholder')}
              className="rounded-lg"
            />
          </div>

          {/* Email (read-only) */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-muted-foreground text-sm font-medium">
              {t('dashboard.settings.profile.email')}
            </Label>
            <Input id="email" value={user?.email || ''} disabled className="rounded-lg" />
          </div>

          <div className="pt-2">
            <Button onClick={handleSaveProfile} disabled={isSaving} className="rounded-lg">
              {isSaving
                ? t('dashboard.settings.profile.saving')
                : t('dashboard.settings.profile.save')}
            </Button>
          </div>
        </div>
      </DashboardCard>

      {/* Workspace Section */}
      <WorkspaceSettings />

      {/* Notifications Section */}
      <DashboardCard titleKey="dashboard.settings.notifications.title" className="mb-6">
        <InfoHint textKey="dashboard.hints.settings.notifications" variant="tip" className="mb-6" />
        <div className="divide-border-subtle divide-y">
          {/* Email notifications */}
          <div className="flex items-start justify-between gap-4 py-4 first:pt-0">
            <div className="flex-1 pr-4">
              <div className="flex items-center gap-2">
                <p className="text-foreground text-sm font-medium">
                  {t('dashboard.settings.notifications.email')}
                </p>
                <TooltipIcon tooltipKey="dashboard.hints.settings.emailNotifications" />
              </div>
              <p className="text-muted-foreground mt-0.5 text-sm">
                {t('dashboard.settings.notifications.emailDescription')}
              </p>
            </div>
            <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
          </div>
          {/* Push notifications */}
          <div className="flex items-start justify-between gap-4 py-4 last:pb-0">
            <div className="flex-1 pr-4">
              <div className="flex items-center gap-2">
                <p className="text-foreground text-sm font-medium">
                  {t('dashboard.settings.notifications.push')}
                </p>
                <TooltipIcon tooltipKey="dashboard.hints.settings.pushNotifications" />
              </div>
              <p className="text-muted-foreground mt-0.5 text-sm">
                {t('dashboard.settings.notifications.pushDescription')}
              </p>
            </div>
            <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
          </div>
        </div>
      </DashboardCard>

      {/* Language Section */}
      <DashboardCard titleKey="dashboard.settings.language.title" className="mb-6">
        <p className="text-muted-foreground mb-4 text-sm">
          {t('dashboard.settings.language.description')}
        </p>
        <div className="bg-muted/50 inline-flex gap-1 rounded-lg p-1">
          {['en', 'fr', 'es'].map((langOption) => (
            <button
              key={langOption}
              onClick={() => handleLanguageChange(langOption)}
              className={cn(
                'rounded-md px-4 py-2 text-sm font-medium transition-all duration-150',
                lang === langOption
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {t(`dashboard.settings.language.options.${langOption}`)}
            </button>
          ))}
        </div>
      </DashboardCard>

      {/* Danger Zone */}
      <DashboardCard className="border-destructive/20 bg-destructive/[0.03]">
        <h3 className="text-destructive mb-2 text-base font-semibold tracking-tight">
          {t('dashboard.settings.danger.title')}
        </h3>
        <p className="text-destructive/70 mb-4 text-sm leading-relaxed">
          {t('dashboard.settings.danger.deleteDescription')}
        </p>
        <Button variant="destructive" size="sm" className="rounded-lg">
          {t('dashboard.settings.danger.deleteAccount')}
        </Button>
      </DashboardCard>
    </div>
  )
}
