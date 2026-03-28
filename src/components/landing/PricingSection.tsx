'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from '@/components/common/LocalizedLink'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Sparkle, Zap, Check, MessageCircle, Briefcase } from 'lucide-react'
import { CardWrapper } from '@/components/common/CardWrapper'
import { Section, SectionContent } from '@/components/common/Section'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/common/Card'
import {
  Paragraph,
  SectionHeading,
  SectionSubtitle,
  Subheading,
} from '@/components/common/Typography'
import { Badge, type BadgeVariant } from '@/components/ui/badge'
import { type Tier } from '@/config/tiers'
import { usePricingPlans } from '@/hooks/usePricingPlans'
import { cn } from '@/lib/utils'

type PricingTierConfig = {
  tier: Tier
  badges?: {
    messageKey?: string
    savePercent?: number
    variant?: BadgeVariant
    annualOnly?: boolean
  }[]
  button: {
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
    icon?: React.ReactNode
    to: string
    target?: string
  }
  icon: React.ReactNode
}

function buildPricingConfig(tiers: Tier[]): PricingTierConfig[] {
  return [
    {
      tier: tiers[0], // FREE
      button: {
        to: '/signup',
      },
      icon: <Briefcase />,
    },
    {
      tier: tiers[1], // PRO
      badges: [
        { savePercent: tiers[1].discount.annually, annualOnly: true },
        { messageKey: 'landing.pricing.badges.popular', variant: 'success' },
      ],
      button: {
        to: '/signup',
      },
      icon: <Zap />,
    },
    {
      tier: tiers[2], // GROWTH
      badges: [{ savePercent: tiers[2].discount.annually, annualOnly: true }],
      button: {
        variant: 'secondary',
        to: '/signup',
      },
      icon: <Sparkle />,
    },
  ]
}

const frequencies = ['annually', 'monthly'] as const
type Frequency = (typeof frequencies)[number]

export function Pricing() {
  const { t } = useTranslation()
  const { tiers } = usePricingPlans()
  const [frequency, setFrequency] = useState<Frequency>(frequencies[0])
  const pricingTiersConfig = buildPricingConfig(tiers)

  return (
    <Section id="pricing">
      <SectionHeading>{t('landing.pricing.title')}</SectionHeading>
      <SectionSubtitle>{t('landing.pricing.subtitle')}</SectionSubtitle>
      <SectionContent noMarginTop className="mt-6">
        <div className="mb-6 flex justify-center">
          <RadioGroup
            value={frequency}
            onValueChange={(value) => setFrequency(value as Frequency)}
            className="bg-background ring-border flex w-fit rounded-full p-1.5 text-xs leading-5 font-semibold shadow-sm ring-1 ring-inset"
          >
            <Label className="sr-only">{t('landing.pricing.frequency.annually')}</Label>
            {frequencies.map((value) => (
              <label
                key={value}
                className={cn(
                  frequency === value ? 'bg-foreground text-background' : 'text-muted-foreground',
                  'cursor-pointer rounded-full px-6 py-1 transition-colors'
                )}
              >
                <RadioGroupItem value={value} className="sr-only" />
                <span>{t(`landing.pricing.frequency.${value}`)}</span>
              </label>
            ))}
          </RadioGroup>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {pricingTiersConfig.map((config, index) => (
            <CardWrapper key={config.tier.id}>
              <PricingCard config={config} tierIndex={index} isAnnual={frequency === 'annually'} />
            </CardWrapper>
          ))}
        </div>
      </SectionContent>
    </Section>
  )
}

interface PricingCardProps {
  config: PricingTierConfig
  tierIndex: number
  isAnnual: boolean
}

function PricingCard({ config, tierIndex, isAnnual }: PricingCardProps) {
  const { t } = useTranslation()
  const { tier, badges, button, icon } = config
  const price = isAnnual ? tier.price.annually : tier.price.monthly
  const isFirstTier = tierIndex === 0

  return (
    <Card
      title={t(tier.nameKey)}
      description={t(tier.descriptionKey)}
      icon={icon}
      variant="extra-rounding"
      addon={
        <div className="flex h-0 items-center gap-1.5">
          {badges
            ?.filter((badge) => !badge.annualOnly || isAnnual)
            .map((badge, idx) => (
              <Badge key={idx} variant={badge.variant as BadgeVariant}>
                {badge.savePercent !== undefined
                  ? t('landing.pricing.badges.savePercent', { percent: badge.savePercent })
                  : badge.messageKey
                    ? t(badge.messageKey)
                    : null}
              </Badge>
            ))}
        </div>
      }
      className="h-full"
    >
      <div className="px-6 pt-0 pb-6">
        <div className="space-y-6">
          <div className="flex items-end gap-2">
            {price > 0 ? (
              <>
                <Subheading>${price}</Subheading>
                <Paragraph size="xs" color="light" className="-translate-y-1">
                  {t(isAnnual ? 'landing.pricing.billedAnnually' : 'landing.pricing.billedMonthly')}
                </Paragraph>
              </>
            ) : (
              <Subheading>{t('landing.pricing.free')}</Subheading>
            )}
          </div>
          <Button size="lg" variant={button.variant} asChild>
            <Link to={button.to} target={button.target}>
              {button.icon}
              {/* z-10 keeps text above gradient background on hover to prevent color shift */}
              <span className="relative z-10">{t(tier.ctaKey)}</span>
            </Link>
          </Button>
        </div>
      </div>
      <CardContent className="border-border-subtle border-t">
        {!isFirstTier && tier.includesPreviousKey && (
          <Paragraph size="sm" className="mb-4 font-medium">
            {t(tier.includesPreviousKey)}
          </Paragraph>
        )}
        <ul className="space-y-3">
          {tier.featureKeys.map((featureKey) => (
            <li className="text-muted-foreground flex items-center gap-2 text-sm" key={featureKey}>
              <div className="text-primary">
                <Check />
              </div>
              {t(featureKey)}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
