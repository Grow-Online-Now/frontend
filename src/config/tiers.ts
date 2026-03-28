import type { PlanType } from '@/types/subscription'

export type Feature = { textKey: string; tooltipKey?: string }

export type Tier = {
  id: 'free' | 'pro' | 'growth'
  planId: PlanType
  nameKey: string
  price: { monthly: number; annually: number }
  discount: { monthly: number; annually: number }
  descriptionKey: string
  featureKeys: string[]
  includesPreviousKey?: string
  ctaKey: string
  ctaLink?: string
  mostPopular?: boolean
}

// Static fallback prices (used when Stripe API hasn't loaded yet)
const pricing: Record<string, number> = {
  FREE_MONTHLY: 0,
  FREE_ANNUALLY: 0,
  PRO_MONTHLY: 19,
  PRO_ANNUALLY: 15,
  GROWTH_MONTHLY: 49,
  GROWTH_ANNUALLY: 39,
}

function discount(monthly: number, annually: number) {
  if (monthly === 0) return 0
  return Math.round(((monthly - annually) / monthly) * 100)
}

const freeTier: Tier = {
  id: 'free',
  planId: 'FREE',
  nameKey: 'landing.pricing.tiers.free.name',
  price: {
    monthly: pricing.FREE_MONTHLY,
    annually: pricing.FREE_ANNUALLY,
  },
  discount: { monthly: 0, annually: 0 },
  descriptionKey: 'landing.pricing.tiers.free.description',
  featureKeys: [
    'landing.pricing.tiers.free.features.0',
    'landing.pricing.tiers.free.features.1',
    'landing.pricing.tiers.free.features.2',
    'landing.pricing.tiers.free.features.3',
  ],
  ctaKey: 'landing.pricing.tiers.free.cta',
  ctaLink: '/signup',
  mostPopular: false,
}

const proTier: Tier = {
  id: 'pro',
  planId: 'PRO',
  nameKey: 'landing.pricing.tiers.pro.name',
  price: {
    monthly: pricing.PRO_MONTHLY,
    annually: pricing.PRO_ANNUALLY,
  },
  discount: {
    monthly: 0,
    annually: discount(pricing.PRO_MONTHLY, pricing.PRO_ANNUALLY),
  },
  descriptionKey: 'landing.pricing.tiers.pro.description',
  includesPreviousKey: 'landing.pricing.tiers.pro.includesPrevious',
  featureKeys: [
    'landing.pricing.tiers.pro.features.0',
    'landing.pricing.tiers.pro.features.1',
    'landing.pricing.tiers.pro.features.2',
    'landing.pricing.tiers.pro.features.3',
    'landing.pricing.tiers.pro.features.4',
  ],
  ctaKey: 'landing.pricing.tiers.pro.cta',
  mostPopular: true,
}

const growthTier: Tier = {
  id: 'growth',
  planId: 'GROWTH',
  nameKey: 'landing.pricing.tiers.growth.name',
  price: {
    monthly: pricing.GROWTH_MONTHLY,
    annually: pricing.GROWTH_ANNUALLY,
  },
  discount: {
    monthly: 0,
    annually: discount(pricing.GROWTH_MONTHLY, pricing.GROWTH_ANNUALLY),
  },
  descriptionKey: 'landing.pricing.tiers.growth.description',
  includesPreviousKey: 'landing.pricing.tiers.growth.includesPrevious',
  featureKeys: [
    'landing.pricing.tiers.growth.features.0',
    'landing.pricing.tiers.growth.features.1',
    'landing.pricing.tiers.growth.features.2',
    'landing.pricing.tiers.growth.features.3',
  ],
  ctaKey: 'landing.pricing.tiers.growth.cta',
  mostPopular: false,
}

export const tiers: Tier[] = [freeTier, proTier, growthTier]
