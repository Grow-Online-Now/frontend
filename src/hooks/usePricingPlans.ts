import { useState, useEffect } from 'react'
import { tiers, type Tier } from '@/config/tiers'
import { getPlans } from '@/services/subscription.service'
import type { Plan } from '@/types/subscription'

/**
 * Hook that fetches real prices from the API and merges them
 * with the static tier config. Falls back to static prices if API fails.
 */
export function usePricingPlans() {
  const [hydratedTiers, setHydratedTiers] = useState<Tier[]>(tiers)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function fetchPrices() {
      try {
        const plans = await getPlans()
        if (cancelled) return

        const planMap = new Map<string, Plan>()
        for (const plan of plans) {
          planMap.set(plan.id, plan)
        }

        const updated = tiers.map((tier) => {
          const plan = planMap.get(tier.planId)
          if (!plan || !plan.pricing.monthly) return tier

          return {
            ...tier,
            price: {
              monthly: plan.pricing.monthly,
              annually: plan.pricing.yearly
                ? Math.round(plan.pricing.yearly / 12)
                : tier.price.annually,
            },
          }
        })

        setHydratedTiers(updated)
      } catch {
        // Keep static fallback prices
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    fetchPrices()
    return () => {
      cancelled = true
    }
  }, [])

  return { tiers: hydratedTiers, isLoading }
}
