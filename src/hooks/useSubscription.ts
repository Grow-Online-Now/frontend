import { useState, useEffect, useCallback } from 'react'
import {
  getSubscription,
  getPlans,
  createCheckoutSession,
  createPortalSession,
  cancelSubscription,
  resumeSubscription,
} from '@/services/subscription.service'
import { ApiError } from '@/lib/api-client'
import type { Subscription, Plan, BillingInterval, PlanType } from '@/types/subscription'

interface UseSubscriptionState {
  subscription: Subscription | null
  plans: Plan[]
  isLoading: boolean
  error: string | null
}

interface UseSubscriptionReturn extends UseSubscriptionState {
  refetch: () => Promise<void>
  startCheckout: (
    plan: Exclude<PlanType, 'FREE'>,
    billingInterval: BillingInterval
  ) => Promise<void>
  openPortal: () => Promise<void>
  cancel: () => Promise<void>
  resume: () => Promise<void>
  isCheckingOut: boolean
  isOpeningPortal: boolean
  isCanceling: boolean
  isResuming: boolean
}

/**
 * Hook to manage subscription state and actions
 * Handles fetching subscription, plans, and billing operations
 */
export function useSubscription(): UseSubscriptionReturn {
  const [state, setState] = useState<UseSubscriptionState>({
    subscription: null,
    plans: [],
    isLoading: true,
    error: null,
  })

  // Action loading states
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [isOpeningPortal, setIsOpeningPortal] = useState(false)
  const [isCanceling, setIsCanceling] = useState(false)
  const [isResuming, setIsResuming] = useState(false)

  /**
   * Fetch subscription and plans
   */
  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const [subscription, plans] = await Promise.all([getSubscription(), getPlans()])
      setState({
        subscription,
        plans,
        isLoading: false,
        error: null,
      })
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to load subscription'
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: message,
      }))
    }
  }, [])

  /**
   * Start Stripe checkout session
   */
  const startCheckout = useCallback(
    async (plan: Exclude<PlanType, 'FREE'>, billingInterval: BillingInterval) => {
      setIsCheckingOut(true)
      setState((prev) => ({ ...prev, error: null }))

      try {
        const successUrl = `${window.location.origin}${window.location.pathname}?success=true`
        const cancelUrl = `${window.location.origin}${window.location.pathname}?canceled=true`
        const session = await createCheckoutSession(plan, billingInterval, successUrl, cancelUrl)
        // Redirect to Stripe Checkout
        window.location.href = session.url
      } catch (err) {
        const message = err instanceof ApiError ? err.message : 'Failed to start checkout'
        setState((prev) => ({ ...prev, error: message }))
        setIsCheckingOut(false)
      }
    },
    []
  )

  /**
   * Open Stripe billing portal
   */
  const openPortal = useCallback(async () => {
    setIsOpeningPortal(true)
    setState((prev) => ({ ...prev, error: null }))

    try {
      const returnUrl = `${window.location.origin}${window.location.pathname}`
      const session = await createPortalSession(returnUrl)
      // Redirect to Stripe Portal
      window.location.href = session.url
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to open billing portal'
      setState((prev) => ({ ...prev, error: message }))
      setIsOpeningPortal(false)
    }
  }, [])

  /**
   * Cancel subscription
   */
  const cancel = useCallback(async () => {
    setIsCanceling(true)
    setState((prev) => ({ ...prev, error: null }))

    try {
      await cancelSubscription()
      // Refetch to get updated subscription
      await fetchData()
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to cancel subscription'
      setState((prev) => ({ ...prev, error: message }))
    } finally {
      setIsCanceling(false)
    }
  }, [fetchData])

  /**
   * Resume canceled subscription
   */
  const resume = useCallback(async () => {
    setIsResuming(true)
    setState((prev) => ({ ...prev, error: null }))

    try {
      await resumeSubscription()
      // Refetch to get updated subscription
      await fetchData()
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to resume subscription'
      setState((prev) => ({ ...prev, error: message }))
    } finally {
      setIsResuming(false)
    }
  }, [fetchData])

  // Fetch data on mount
  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    ...state,
    refetch: fetchData,
    startCheckout,
    openPortal,
    cancel,
    resume,
    isCheckingOut,
    isOpeningPortal,
    isCanceling,
    isResuming,
  }
}
