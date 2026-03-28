/**
 * Competitor data for migration/alternative pages
 * Each competitor has specific data that gets interpolated into the page template
 */

export interface KillFeature {
  featureKey: string
  competitorStatus: 'none' | 'partial' | 'manual'
  growOnlineStatus: 'full' | 'ai' | 'auto'
}

export interface CompetitorData {
  slug: string
  name: string
  /** Translation key for the competitor tagline */
  taglineKey: string
  /** Translation key for competitor-specific obsolescence narrative */
  obsolescenceKey: string
  /** Price displayed in comparison */
  priceDisplay: string
  /** Our price for comparison */
  ourPriceDisplay: string
  /** Year they were founded/represent (for obsolescence narrative) */
  legacyYear: string
  /** Features where we win - used in kill table */
  killFeatures: KillFeature[]
  /** FAQ keys specific to this competitor */
  faqKeys: string[]
}

/**
 * Default kill features that apply to most competitors
 * These show where Grow Online wins vs legacy tools
 */
const defaultKillFeatures: KillFeature[] = [
  {
    featureKey: 'contentCreation',
    competitorStatus: 'manual',
    growOnlineStatus: 'ai',
  },
  {
    featureKey: 'analytics',
    competitorStatus: 'partial',
    growOnlineStatus: 'full',
  },
  {
    featureKey: 'automation',
    competitorStatus: 'manual',
    growOnlineStatus: 'auto',
  },
  {
    featureKey: 'platformStrategy',
    competitorStatus: 'none',
    growOnlineStatus: 'ai',
  },
  {
    featureKey: 'brandVoice',
    competitorStatus: 'none',
    growOnlineStatus: 'ai',
  },
  {
    featureKey: 'hashtagStrategy',
    competitorStatus: 'manual',
    growOnlineStatus: 'ai',
  },
  {
    featureKey: 'bestTimePosting',
    competitorStatus: 'partial',
    growOnlineStatus: 'ai',
  },
  {
    featureKey: 'contentRepurposing',
    competitorStatus: 'none',
    growOnlineStatus: 'auto',
  },
]

const defaultFaqKeys = ['pricing', 'migration', 'features', 'support', 'trial', 'platforms']

/**
 * Competitor-specific data
 * Add new competitors here with their specific details
 */
export const competitors: Record<string, CompetitorData> = {
  buffer: {
    slug: 'buffer',
    name: 'Buffer',
    taglineKey: 'alternatives.competitors.buffer.tagline',
    obsolescenceKey: 'alternatives.competitors.buffer.obsolescence',
    priceDisplay: '$6/channel',
    ourPriceDisplay: '$29/mo flat',
    legacyYear: '2010',
    killFeatures: defaultKillFeatures,
    faqKeys: defaultFaqKeys,
  },
  hootsuite: {
    slug: 'hootsuite',
    name: 'Hootsuite',
    taglineKey: 'alternatives.competitors.hootsuite.tagline',
    obsolescenceKey: 'alternatives.competitors.hootsuite.obsolescence',
    priceDisplay: '$99/mo',
    ourPriceDisplay: '$29/mo flat',
    legacyYear: '2008',
    killFeatures: defaultKillFeatures,
    faqKeys: defaultFaqKeys,
  },
  later: {
    slug: 'later',
    name: 'Later',
    taglineKey: 'alternatives.competitors.later.tagline',
    obsolescenceKey: 'alternatives.competitors.later.obsolescence',
    priceDisplay: '$25/mo',
    ourPriceDisplay: '$29/mo flat',
    legacyYear: '2014',
    killFeatures: defaultKillFeatures,
    faqKeys: defaultFaqKeys,
  },
  sproutsocial: {
    slug: 'sproutsocial',
    name: 'Sprout Social',
    taglineKey: 'alternatives.competitors.sproutsocial.tagline',
    obsolescenceKey: 'alternatives.competitors.sproutsocial.obsolescence',
    priceDisplay: '$249/seat',
    ourPriceDisplay: '$29/mo flat',
    legacyYear: '2010',
    killFeatures: defaultKillFeatures,
    faqKeys: defaultFaqKeys,
  },
  planoly: {
    slug: 'planoly',
    name: 'Planoly',
    taglineKey: 'alternatives.competitors.planoly.tagline',
    obsolescenceKey: 'alternatives.competitors.planoly.obsolescence',
    priceDisplay: '$13/mo',
    ourPriceDisplay: '$29/mo flat',
    legacyYear: '2016',
    killFeatures: defaultKillFeatures,
    faqKeys: defaultFaqKeys,
  },
  metricool: {
    slug: 'metricool',
    name: 'Metricool',
    taglineKey: 'alternatives.competitors.metricool.tagline',
    obsolescenceKey: 'alternatives.competitors.metricool.obsolescence',
    priceDisplay: '$22/mo',
    ourPriceDisplay: '$29/mo flat',
    legacyYear: '2016',
    killFeatures: defaultKillFeatures,
    faqKeys: defaultFaqKeys,
  },
  postbridge: {
    slug: 'postbridge',
    name: 'Postbridge',
    taglineKey: 'alternatives.competitors.postbridge.tagline',
    obsolescenceKey: 'alternatives.competitors.postbridge.obsolescence',
    priceDisplay: '$22.50/mo',
    ourPriceDisplay: '$29/mo flat',
    legacyYear: '2020',
    killFeatures: defaultKillFeatures,
    faqKeys: defaultFaqKeys,
  },
  postiz: {
    slug: 'postiz',
    name: 'Postiz',
    taglineKey: 'alternatives.competitors.postiz.tagline',
    obsolescenceKey: 'alternatives.competitors.postiz.obsolescence',
    priceDisplay: '$29/mo',
    ourPriceDisplay: '$29/mo flat',
    legacyYear: '2023',
    killFeatures: defaultKillFeatures,
    faqKeys: defaultFaqKeys,
  },
  postplanify: {
    slug: 'postplanify',
    name: 'Postplanify',
    taglineKey: 'alternatives.competitors.postplanify.tagline',
    obsolescenceKey: 'alternatives.competitors.postplanify.obsolescence',
    priceDisplay: '$7.49/mo',
    ourPriceDisplay: '$29/mo flat',
    legacyYear: '2022',
    killFeatures: defaultKillFeatures,
    faqKeys: defaultFaqKeys,
  },
}

/**
 * Get competitor data by slug
 * Returns undefined if competitor not found
 */
export function getCompetitorBySlug(slug: string): CompetitorData | undefined {
  return competitors[slug.toLowerCase()]
}

/**
 * Get all competitor slugs for generating static paths
 */
export function getAllCompetitorSlugs(): string[] {
  return Object.keys(competitors)
}
