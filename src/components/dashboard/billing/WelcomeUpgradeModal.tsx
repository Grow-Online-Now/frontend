import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Check, ArrowRight } from 'lucide-react'
import confetti from 'canvas-confetti'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { PlanType } from '@/types/subscription'
import { PLAN_DISPLAY_NAMES } from '@/types/subscription'

interface WelcomeUpgradeModalProps {
  open: boolean
  onClose: () => void
  plan: PlanType
}

const PLAN_PERKS: Record<string, string[]> = {
  PRO: [
    'dashboard.billing.welcome.perks.clips50',
    'dashboard.billing.welcome.perks.unlimitedWorkspaces',
    'dashboard.billing.welcome.perks.prioritySupport',
  ],
  GROWTH: [
    'dashboard.billing.welcome.perks.clips500',
    'dashboard.billing.welcome.perks.unlimitedWorkspaces',
    'dashboard.billing.welcome.perks.teamAndApi',
  ],
}

export function WelcomeUpgradeModal({ open, onClose, plan }: WelcomeUpgradeModalProps) {
  const { t } = useTranslation()
  const hasFired = useRef(false)

  useEffect(() => {
    if (open && !hasFired.current) {
      hasFired.current = true
      // Subtle confetti burst — professional, not birthday party
      const duration = 1500
      const end = Date.now() + duration

      const frame = () => {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors: ['#8b5cf6', '#ec4899', '#3b82f6'],
          disableForReducedMotion: true,
        })
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors: ['#8b5cf6', '#ec4899', '#3b82f6'],
          disableForReducedMotion: true,
        })

        if (Date.now() < end) {
          requestAnimationFrame(frame)
        }
      }
      frame()
    }
  }, [open])

  const perks = PLAN_PERKS[plan] || PLAN_PERKS.PRO
  const planName = PLAN_DISPLAY_NAMES[plan] || plan

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-sm">
        {/* Header with subtle glow */}
        <div className="relative overflow-hidden px-6 pt-10 pb-2">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-10 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-[#8b5cf6]/20 blur-3xl" />
          </div>

          <div className="relative space-y-2 text-center">
            <h2 className="text-text-primary text-2xl font-semibold tracking-tight">
              {t('dashboard.billing.welcome.title', { plan: planName })}
            </h2>
            <p className="text-text-secondary text-sm">
              {t('dashboard.billing.welcome.subtitle')}
            </p>
          </div>
        </div>

        {/* What you unlocked */}
        <div className="space-y-3 px-6 pt-4 pb-2">
          {perks.map((perkKey) => (
            <div key={perkKey} className="flex items-center gap-3">
              <div className="bg-success/10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                <Check className="text-success h-3.5 w-3.5" />
              </div>
              <span className="text-text-primary text-sm">{t(perkKey)}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="px-6 pt-4 pb-6">
          <Button onClick={onClose} className="h-10 w-full text-sm font-semibold" size="lg">
            {t('dashboard.billing.welcome.cta')}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
