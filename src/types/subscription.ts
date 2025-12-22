// Subscription Types
// Based on Stripe subscription billing integration

export type PlanType = 'FREE' | 'PRO' | 'GROWTH'
export type BillingInterval = 'monthly' | 'yearly'
export type SubscriptionStatus =
  | 'ACTIVE'
  | 'PAST_DUE'
  | 'CANCELED'
  | 'INCOMPLETE'
  | 'TRIALING'
  | 'UNPAID'

export interface PlanLimits {
  maxWorkspaces: number | null
  maxPostsPerMonth: number | null
  maxPlatformsPerWorkspace: number | null
}

export interface Subscription {
  id: string
  plan: PlanType
  status: SubscriptionStatus
  billingInterval: BillingInterval | null
  currentPeriodStart: string | null
  currentPeriodEnd: string | null
  cancelAtPeriodEnd: boolean
  canceledAt: string | null
  limits: PlanLimits
  features: string[]
}

export interface Plan {
  id: PlanType
  name: string
  description: string
  features: string[]
  limits: PlanLimits
  pricing: {
    monthly: number | null
    yearly: number | null
  }
}

export interface CheckoutSession {
  sessionId: string
  url: string
}

export interface PortalSession {
  url: string
}

export interface SubscriptionResponse {
  subscription: Subscription
}

export interface PlansResponse {
  plans: Plan[]
}

// Display constants
export const PLAN_DISPLAY_NAMES: Record<PlanType, string> = {
  FREE: 'Free',
  PRO: 'Pro',
  GROWTH: 'Growth',
}

export const PLAN_COLORS: Record<PlanType, string> = {
  FREE: 'gray',
  PRO: 'blue',
  GROWTH: 'purple',
}

// Helper functions
export function formatLimit(limit: number | null): string {
  return limit === null ? 'Unlimited' : limit.toString()
}

export function canUpgrade(currentPlan: PlanType, targetPlan: PlanType): boolean {
  const planOrder: PlanType[] = ['FREE', 'PRO', 'GROWTH']
  return planOrder.indexOf(targetPlan) > planOrder.indexOf(currentPlan)
}

export function getPlanOrder(plan: PlanType): number {
  const planOrder: PlanType[] = ['FREE', 'PRO', 'GROWTH']
  return planOrder.indexOf(plan)
}
