import { apiClient } from '@/lib/api-client'
import type {
  Subscription,
  Plan,
  CheckoutSession,
  PortalSession,
  UsageResponse,
  BillingInterval,
  PlanType,
} from '@/types/subscription'

const ENDPOINTS = {
  subscription: '/api/subscriptions',
  plans: '/api/subscriptions/plans',
  usage: '/api/subscriptions/usage',
  checkout: '/api/subscriptions/checkout',
  portal: '/api/subscriptions/portal',
  cancel: '/api/subscriptions/cancel',
  resume: '/api/subscriptions/resume',
} as const

/**
 * Get current user's subscription
 */
export async function getSubscription(): Promise<Subscription> {
  return apiClient.get<Subscription>(ENDPOINTS.subscription)
}

/**
 * Get available subscription plans
 */
export async function getPlans(): Promise<Plan[]> {
  return apiClient.get<Plan[]>(ENDPOINTS.plans)
}

/**
 * Get current usage statistics
 */
export async function getUsage(): Promise<UsageResponse> {
  return apiClient.get<UsageResponse>(ENDPOINTS.usage)
}

/**
 * Create a Stripe checkout session for upgrading
 */
export async function createCheckoutSession(
  plan: Exclude<PlanType, 'FREE'>,
  billingInterval: BillingInterval,
  successUrl: string,
  cancelUrl: string
): Promise<CheckoutSession> {
  return apiClient.post<CheckoutSession>(ENDPOINTS.checkout, {
    plan,
    billingInterval,
    successUrl,
    cancelUrl,
  })
}

/**
 * Create a Stripe portal session for managing billing
 */
export async function createPortalSession(returnUrl: string): Promise<PortalSession> {
  return apiClient.post<PortalSession>(ENDPOINTS.portal, {
    returnUrl,
  })
}

/**
 * Cancel the current subscription
 */
export async function cancelSubscription(): Promise<{ message: string }> {
  return apiClient.post<{ message: string }>(ENDPOINTS.cancel)
}

/**
 * Resume a canceled subscription
 */
export async function resumeSubscription(): Promise<{ message: string }> {
  return apiClient.post<{ message: string }>(ENDPOINTS.resume)
}

// Service object export for alternative usage
export const subscriptionService = {
  getSubscription,
  getPlans,
  getUsage,
  createCheckoutSession,
  createPortalSession,
  cancelSubscription,
  resumeSubscription,
}
