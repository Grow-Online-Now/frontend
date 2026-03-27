import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { Zap, Plus } from 'lucide-react'
import { PageHeader } from '@/components/dashboard/shared/PageHeader'
import { EmptyState } from '@/components/dashboard/shared/EmptyState'
import { Button } from '@/components/ui/button'
import { useAutomations } from '@/hooks/useAutomations'
import { AutomationCard } from '@/components/dashboard/automations/AutomationCard'

export default function AutomationsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { lang = 'en' } = useParams<{ lang: string }>()
  const { automations, isLoading, remove, activate, pause, trigger } = useAutomations()

  const handleCreate = () => {
    navigate(`/${lang}/dashboard/automations/new`)
  }

  if (isLoading) {
    return (
      <div>
        <PageHeader
          titleKey="dashboard.automations.title"
          descriptionKey="dashboard.automations.description"
        />
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-bg-elevated border-border-default h-48 animate-pulse rounded-xl border"
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        titleKey="dashboard.automations.title"
        descriptionKey="dashboard.automations.description"
        actions={
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            {t('dashboard.automations.createButton')}
          </Button>
        }
      />

      {automations.length === 0 ? (
        <div className="mt-12">
          <EmptyState
            icon={<Zap className="h-6 w-6" />}
            titleKey="dashboard.automations.empty.title"
            descriptionKey="dashboard.automations.empty.description"
            ctaKey="dashboard.automations.empty.cta"
            onCtaClick={handleCreate}
          />
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {automations.map((automation) => (
            <AutomationCard
              key={automation.id}
              automation={automation}
              onActivate={() => activate(automation.id)}
              onPause={() => pause(automation.id)}
              onDelete={() => remove(automation.id)}
              onTrigger={() => trigger(automation.id)}
              onClick={() => navigate(`/${lang}/dashboard/automations/${automation.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
