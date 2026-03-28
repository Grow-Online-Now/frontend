import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { Zap, Plus } from 'lucide-react'
import { PageHeader } from '@/components/dashboard/shared/PageHeader'
import { EmptyState } from '@/components/dashboard/shared/EmptyState'
import { Button } from '@/components/ui/button'
import { useAutomations } from '@/hooks/useAutomations'
import { AutomationBoard } from '@/components/dashboard/automations/AutomationBoard'
import { CreateAutomationPanel } from '@/components/dashboard/automations/CreateAutomationPanel'
import { toast } from 'sonner'

export default function AutomationsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { lang = 'en' } = useParams<{ lang: string }>()
  const { automations, isLoading, activate, pause, trigger, refetch } =
    useAutomations()

  const [showCreatePanel, setShowCreatePanel] = useState(false)

  const handleRetry = async (id: string) => {
    try {
      await trigger(id)
      toast.success(t('dashboard.automations.board.retryStarted'))
    } catch {
      toast.error(t('dashboard.automations.board.retryFailed'))
    }
  }

  const handlePause = async (id: string) => {
    try {
      await pause(id)
      toast.success(t('dashboard.automations.board.paused'))
    } catch {
      toast.error(t('dashboard.automations.board.pauseFailed'))
    }
  }

  const handleResume = async (id: string) => {
    try {
      await activate(id)
      toast.success(t('dashboard.automations.board.resumed'))
    } catch {
      toast.error(t('dashboard.automations.board.resumeFailed'))
    }
  }

  if (isLoading) {
    return (
      <div>
        <PageHeader
          titleKey="dashboard.automations.title"
          descriptionKey="dashboard.automations.description"
        />
        <div className="mt-6 flex gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-bg-elevated border-border-default h-64 flex-1 animate-pulse rounded-xl border"
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
          <Button onClick={() => setShowCreatePanel(true)} className="gap-2">
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
            onCtaClick={() => setShowCreatePanel(true)}
          />
        </div>
      ) : (
        <>
          <AutomationBoard
            automations={automations}
            onRetry={handleRetry}
            onPause={handlePause}
            onResume={handleResume}
            onClick={(id) =>
              navigate(`/${lang}/dashboard/automations/${id}`)
            }
          />
        </>
      )}

      {/* Create automation panel */}
      <CreateAutomationPanel
        open={showCreatePanel}
        onOpenChange={setShowCreatePanel}
        onCreated={() => {
          setShowCreatePanel(false)
          refetch()
        }}
      />
    </div>
  )
}
