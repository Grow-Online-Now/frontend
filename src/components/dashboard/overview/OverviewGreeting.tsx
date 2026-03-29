import { useTranslation } from 'react-i18next'
import { useSession } from '@/lib/auth-client'

export function OverviewGreeting() {
  const { t } = useTranslation()
  const { data: session } = useSession()

  const hour = new Date().getHours()
  const greetingKey =
    hour < 12
      ? 'dashboard.overview.greeting.morning'
      : hour < 18
        ? 'dashboard.overview.greeting.afternoon'
        : 'dashboard.overview.greeting.evening'

  const firstName = session?.user?.name?.split(' ')[0] || ''

  return (
    <h1 className="text-text-primary text-2xl font-semibold tracking-tight">
      {t(greetingKey, { name: firstName })}
    </h1>
  )
}
