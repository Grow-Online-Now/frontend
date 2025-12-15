/**
 * Step2Platforms Component
 * Second step of the text flow: Choose platforms to post to
 * Includes content preview and full-width platform cards
 */

import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PlatformCard } from './PlatformCard'
import { ValidationWarnings } from './ValidationWarnings'
import { ContentPreview } from '@/components/create/shared'
import { EmptyState } from '@/components/dashboard/shared/EmptyState'
import { useNavigate, useParams } from 'react-router-dom'
import type { PlatformWithValidation, ValidationWarning } from '@/types/create'

interface Step2PlatformsProps {
  content: string
  platforms: PlatformWithValidation[]
  selectedIds: string[]
  onToggle: (id: string) => void
  validations: ValidationWarning[]
  onShortenWithAI?: (platformId: string) => void
  className?: string
}

const stepAnimation = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.2, ease: 'easeOut' as const },
}

export function Step2Platforms({
  content,
  platforms,
  selectedIds,
  onToggle,
  validations,
  onShortenWithAI,
  className,
}: Step2PlatformsProps) {
  const { t } = useTranslation()
  const { lang } = useParams<{ lang: string }>()
  const navigate = useNavigate()

  const hasOverLimitErrors = validations.some((v) => v.type === 'over_limit')

  // Empty state if no accounts connected
  if (platforms.length === 0) {
    return (
      <motion.div {...stepAnimation} className={className}>
        <EmptyState
          icon={<Check className="h-6 w-6" />}
          titleKey="dashboard.create.text.step2.empty.title"
          descriptionKey="dashboard.create.text.step2.empty.description"
          ctaKey="dashboard.accounts.connectNew"
          onCtaClick={() => navigate(`/${lang}/dashboard/accounts`)}
        />
      </motion.div>
    )
  }

  return (
    <motion.div {...stepAnimation} className={cn('mx-auto max-w-[600px]', className)}>
      {/* Header */}
      <div className="mb-6 text-center">
        <h2 className="text-foreground text-xl font-semibold">
          {t('dashboard.create.text.step2.title')}
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          {t('dashboard.create.text.step2.description')}
        </p>
      </div>

      {/* Content preview */}
      <ContentPreview content={content} className="mb-6" />

      {/* Platform cards - stacked list */}
      <div className="flex flex-col gap-3">
        {platforms.map((platform) => (
          <PlatformCard
            key={platform.id}
            platform={platform}
            isSelected={selectedIds.includes(platform.id)}
            onToggle={() => onToggle(platform.id)}
          />
        ))}
      </div>

      {/* Validation warnings */}
      <ValidationWarnings warnings={validations} onShortenWithAI={onShortenWithAI} />

      {/* All good message */}
      {selectedIds.length > 0 && !hasOverLimitErrors && (
        <div className="bg-success/5 border-success/20 mt-4 flex items-center justify-center gap-2 rounded-xl border px-4 py-3">
          <Check className="text-success h-4 w-4" />
          <span className="text-success text-sm">{t('dashboard.create.text.step2.allGood')}</span>
        </div>
      )}
    </motion.div>
  )
}
