export type Feature = { textKey: string; tooltipKey?: string }

export type Tier = {
  id: 'starter' | 'professional' | 'enterprise'
  nameKey: string
  tiers: { monthly: string; annually: string }
  price: { monthly: number; annually: number }
  discount: { monthly: number; annually: number }
  quantity?: number
  descriptionKey: string
  featureKeys: string[]
  includesPreviousKey?: string
  ctaKey: string
  ctaLink?: string
  mostPopular?: boolean
}

const pricing: Record<string, number> = {
  STARTER_MONTHLY: 19,
  STARTER_ANNUALLY: 15,
  PROFESSIONAL_MONTHLY: 49,
  PROFESSIONAL_ANNUALLY: 39,
  ENTERPRISE_MONTHLY: 0,
  ENTERPRISE_ANNUALLY: 0,
}

const variantIdToTier: Record<number, string> = {
  20: 'STARTER_MONTHLY',
  21: 'STARTER_ANNUALLY',
  22: 'PROFESSIONAL_MONTHLY',
  23: 'PROFESSIONAL_ANNUALLY',
  25: 'ENTERPRISE_MONTHLY',
  26: 'ENTERPRISE_ANNUALLY',
}

const STRIPE_PRICE_ID_CONFIG: Record<
  string,
  {
    // active price id
    priceId?: string
    // Allow handling of old price ids
    oldPriceIds?: string[]
  }
> = {
  STARTER_MONTHLY: {},
  STARTER_ANNUALLY: {},
  PROFESSIONAL_MONTHLY: {},
  PROFESSIONAL_ANNUALLY: {},
  ENTERPRISE_MONTHLY: {},
  ENTERPRISE_ANNUALLY: {},
}

export function getStripeSubscriptionTier({ priceId }: { priceId: string }): string | null {
  const entries = Object.entries(STRIPE_PRICE_ID_CONFIG)

  for (const [tier, config] of entries) {
    if (config.priceId === priceId || config.oldPriceIds?.includes(priceId)) {
      return tier as string
    }
  }
  return null
}

export function getStripePriceId({ tier }: { tier: string }): string | null {
  return STRIPE_PRICE_ID_CONFIG[tier]?.priceId ?? null
}

function discount(monthly: number, annually: number) {
  return Math.round(((monthly - annually) / monthly) * 100)
}

export const starterTierName = 'starter'

const starterTier: Tier = {
  id: 'starter',
  nameKey: 'landing.pricing.tiers.starter.name',
  tiers: {
    monthly: 'STARTER_MONTHLY',
    annually: 'STARTER_ANNUALLY',
  },
  price: {
    monthly: pricing.STARTER_MONTHLY,
    annually: pricing.STARTER_ANNUALLY,
  },
  discount: {
    monthly: 0,
    annually: discount(pricing.STARTER_MONTHLY, pricing.STARTER_ANNUALLY),
  },
  descriptionKey: 'landing.pricing.tiers.starter.description',
  featureKeys: [
    'landing.pricing.tiers.starter.features.0',
    'landing.pricing.tiers.starter.features.1',
    'landing.pricing.tiers.starter.features.2',
    'landing.pricing.tiers.starter.features.3',
    'landing.pricing.tiers.starter.features.4',
  ],
  ctaKey: 'landing.pricing.tiers.starter.cta',
  mostPopular: true,
}

const professionalTier: Tier = {
  id: 'professional',
  nameKey: 'landing.pricing.tiers.professional.name',
  tiers: {
    monthly: 'PROFESSIONAL_MONTHLY',
    annually: 'PROFESSIONAL_ANNUALLY',
  },
  price: {
    monthly: pricing.PROFESSIONAL_MONTHLY,
    annually: pricing.PROFESSIONAL_ANNUALLY,
  },
  discount: {
    monthly: 0,
    annually: discount(pricing.PROFESSIONAL_MONTHLY, pricing.PROFESSIONAL_ANNUALLY),
  },
  descriptionKey: 'landing.pricing.tiers.professional.description',
  includesPreviousKey: 'landing.pricing.tiers.professional.includesPrevious',
  featureKeys: [
    'landing.pricing.tiers.professional.features.0',
    'landing.pricing.tiers.professional.features.1',
    'landing.pricing.tiers.professional.features.2',
    'landing.pricing.tiers.professional.features.3',
    'landing.pricing.tiers.professional.features.4',
  ],
  ctaKey: 'landing.pricing.tiers.professional.cta',
  mostPopular: false,
}

const enterpriseTier: Tier = {
  id: 'enterprise',
  nameKey: 'landing.pricing.tiers.enterprise.name',
  tiers: {
    monthly: 'ENTERPRISE_MONTHLY',
    annually: 'ENTERPRISE_ANNUALLY',
  },
  price: { monthly: 0, annually: 0 },
  discount: { monthly: 0, annually: 0 },
  descriptionKey: 'landing.pricing.tiers.enterprise.description',
  includesPreviousKey: 'landing.pricing.tiers.enterprise.includesPrevious',
  featureKeys: [
    'landing.pricing.tiers.enterprise.features.0',
    'landing.pricing.tiers.enterprise.features.1',
    'landing.pricing.tiers.enterprise.features.2',
    'landing.pricing.tiers.enterprise.features.3',
  ],
  ctaKey: 'landing.pricing.tiers.enterprise.cta',
  ctaLink: '/sales',
  mostPopular: false,
}

export function getLemonSubscriptionTier({ variantId }: { variantId: number }): string {
  const tier = variantIdToTier[variantId]
  if (!tier) throw new Error(`Unknown variant id: ${variantId}`)
  return tier
}

export const tiers: Tier[] = [starterTier, professionalTier, enterpriseTier]
