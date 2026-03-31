import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { Users, PenSquare, Calendar, Zap, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useConnections } from '@/hooks/useConnections'
import { CreatePostTypeModal } from '@/components/dashboard/shared/CreatePostTypeModal'
import type { OverviewStats } from '@/types/activity'

interface SmartQuickActionsProps {
  stats: OverviewStats | null
}

const ease = [0.16, 1, 0.3, 1] as const

export function SmartQuickActions({ stats }: SmartQuickActionsProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { lang = 'en' } = useParams<{ lang: string }>()
  const { connections } = useConnections()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const hasConnections = connections.length > 0
  const hasPosts = (stats?.postsThisWeek ?? 0) > 0

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease }}
      >
        <p className="text-text-tertiary mb-2 text-xs font-medium uppercase tracking-wider">
          {t('dashboard.overview.quickActions.title')}
        </p>

        <div className="space-y-1">
          {!hasConnections ? (
            <ActionRow
              icon={Users}
              labelKey="dashboard.overview.quickActions.connectSocials.title"
              descriptionKey="dashboard.overview.quickActions.connectSocials.description"
              onClick={() => navigate(`/${lang}/dashboard/accounts`)}
            />
          ) : !hasPosts ? (
            <>
              <ActionRow
                icon={PenSquare}
                labelKey="dashboard.overview.quickActions.createFirst.title"
                descriptionKey="dashboard.overview.quickActions.createFirst.description"
                onClick={() => setIsCreateModalOpen(true)}
              />
              <ActionRow
                icon={Zap}
                labelKey="dashboard.overview.quickActions.automations"
                onClick={() => navigate(`/${lang}/dashboard/automations`)}
              />
            </>
          ) : (
            <>
              <ActionRow
                icon={PenSquare}
                labelKey="dashboard.overview.quickActions.createPost"
                onClick={() => setIsCreateModalOpen(true)}
              />
              <ActionRow
                icon={Calendar}
                labelKey="dashboard.overview.quickActions.viewCalendar"
                onClick={() => navigate(`/${lang}/dashboard/scheduler`)}
              />
              <ActionRow
                icon={Zap}
                labelKey="dashboard.overview.quickActions.automations"
                onClick={() => navigate(`/${lang}/dashboard/automations`)}
              />
            </>
          )}
        </div>
      </motion.div>

      <CreatePostTypeModal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} />
    </>
  )
}

function ActionRow({
  icon: Icon,
  labelKey,
  descriptionKey,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>
  labelKey: string
  descriptionKey?: string
  onClick: () => void
}) {
  const { t } = useTranslation()

  return (
    <button
      onClick={onClick}
      className="group flex w-full items-center gap-3 rounded-lg p-2.5 transition-colors duration-150 hover:bg-bg-hover"
    >
      <Icon className="text-text-secondary h-4 w-4 shrink-0" />
      <div className="min-w-0 flex-1 text-left">
        <p className="text-text-primary text-sm">{t(labelKey)}</p>
        {descriptionKey && (
          <p className="text-text-tertiary text-xs">{t(descriptionKey)}</p>
        )}
      </div>
      <ChevronRight className="text-text-muted h-3.5 w-3.5 shrink-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100" />
    </button>
  )
}
