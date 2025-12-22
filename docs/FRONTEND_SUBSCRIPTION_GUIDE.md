# Frontend Subscription Implementation Guide

This guide covers implementing Stripe subscription billing in your React frontend.

## Table of Contents
1. [API Client](#1-api-client)
2. [Types](#2-types)
3. [Hooks](#3-hooks)
4. [Components](#4-components)
5. [Settings Page Integration](#5-settings-page-integration)
6. [Upgrade Prompts](#6-upgrade-prompts)

---

## 1. API Client

Create API functions for subscription endpoints:

```typescript
// src/api/subscriptions.ts

import { api } from './client'; // Your existing API client

export interface Subscription {
  id: string;
  plan: 'FREE' | 'PRO' | 'GROWTH';
  status: 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'INCOMPLETE' | 'TRIALING' | 'UNPAID';
  billingInterval: 'monthly' | 'yearly' | null;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  canceledAt: string | null;
  limits: {
    maxWorkspaces: number | null;
    maxPostsPerMonth: number | null;
    maxPlatformsPerWorkspace: number | null;
  };
  features: string[];
}

export interface Plan {
  id: 'FREE' | 'PRO' | 'GROWTH';
  name: string;
  description: string;
  features: string[];
  limits: {
    maxWorkspaces: number | null;
    maxPostsPerMonth: number | null;
    maxPlatformsPerWorkspace: number | null;
  };
  pricing: {
    monthly: number | null;
    yearly: number | null;
  };
}

export interface CheckoutSession {
  sessionId: string;
  url: string;
}

export interface PortalSession {
  url: string;
}

// Get current user's subscription
export async function getSubscription(): Promise<Subscription> {
  const response = await api.get('/api/subscriptions');
  return response.data;
}

// Get available plans
export async function getPlans(): Promise<Plan[]> {
  const response = await api.get('/api/subscriptions/plans');
  return response.data;
}

// Create checkout session for upgrade
export async function createCheckoutSession(
  plan: 'PRO' | 'GROWTH',
  billingInterval: 'monthly' | 'yearly',
  successUrl: string,
  cancelUrl: string
): Promise<CheckoutSession> {
  const response = await api.post('/api/subscriptions/checkout', {
    plan,
    billingInterval,
    successUrl,
    cancelUrl,
  });
  return response.data;
}

// Create portal session for managing billing
export async function createPortalSession(returnUrl: string): Promise<PortalSession> {
  const response = await api.post('/api/subscriptions/portal', {
    returnUrl,
  });
  return response.data;
}

// Cancel subscription
export async function cancelSubscription(): Promise<{ message: string }> {
  const response = await api.post('/api/subscriptions/cancel');
  return response.data;
}

// Resume canceled subscription
export async function resumeSubscription(): Promise<{ message: string }> {
  const response = await api.post('/api/subscriptions/resume');
  return response.data;
}
```

---

## 2. Types

```typescript
// src/types/subscription.ts

export type PlanType = 'FREE' | 'PRO' | 'GROWTH';
export type BillingInterval = 'monthly' | 'yearly';
export type SubscriptionStatus = 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'INCOMPLETE' | 'TRIALING' | 'UNPAID';

export interface PlanLimits {
  maxWorkspaces: number | null;
  maxPostsPerMonth: number | null;
  maxPlatformsPerWorkspace: number | null;
}

export const PLAN_DISPLAY_NAMES: Record<PlanType, string> = {
  FREE: 'Free',
  PRO: 'Pro',
  GROWTH: 'Growth',
};

export const PLAN_COLORS: Record<PlanType, string> = {
  FREE: 'gray',
  PRO: 'blue',
  GROWTH: 'purple',
};

// Helper to format limits for display
export function formatLimit(limit: number | null): string {
  return limit === null ? 'Unlimited' : limit.toString();
}

// Helper to check if user can upgrade
export function canUpgrade(currentPlan: PlanType, targetPlan: PlanType): boolean {
  const planOrder: PlanType[] = ['FREE', 'PRO', 'GROWTH'];
  return planOrder.indexOf(targetPlan) > planOrder.indexOf(currentPlan);
}
```

---

## 3. Hooks

### useSubscription Hook

```typescript
// src/hooks/useSubscription.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getSubscription,
  getPlans,
  createCheckoutSession,
  createPortalSession,
  cancelSubscription,
  resumeSubscription,
  type Subscription,
  type Plan,
} from '@/api/subscriptions';
import { toast } from 'sonner'; // or your toast library

export function useSubscription() {
  const queryClient = useQueryClient();

  // Fetch current subscription
  const {
    data: subscription,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['subscription'],
    queryFn: getSubscription,
  });

  // Fetch available plans
  const { data: plans } = useQuery({
    queryKey: ['plans'],
    queryFn: getPlans,
  });

  // Checkout mutation
  const checkoutMutation = useMutation({
    mutationFn: ({
      plan,
      billingInterval,
    }: {
      plan: 'PRO' | 'GROWTH';
      billingInterval: 'monthly' | 'yearly';
    }) => {
      const successUrl = `${window.location.origin}/settings/billing?success=true`;
      const cancelUrl = `${window.location.origin}/settings/billing?canceled=true`;
      return createCheckoutSession(plan, billingInterval, successUrl, cancelUrl);
    },
    onSuccess: (data) => {
      // Redirect to Stripe Checkout
      window.location.href = data.url;
    },
    onError: (error: Error) => {
      toast.error('Failed to start checkout: ' + error.message);
    },
  });

  // Portal mutation
  const portalMutation = useMutation({
    mutationFn: () => {
      const returnUrl = `${window.location.origin}/settings/billing`;
      return createPortalSession(returnUrl);
    },
    onSuccess: (data) => {
      // Redirect to Stripe Portal
      window.location.href = data.url;
    },
    onError: (error: Error) => {
      toast.error('Failed to open billing portal: ' + error.message);
    },
  });

  // Cancel mutation
  const cancelMutation = useMutation({
    mutationFn: cancelSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
      toast.success('Subscription will be canceled at the end of the billing period');
    },
    onError: (error: Error) => {
      toast.error('Failed to cancel subscription: ' + error.message);
    },
  });

  // Resume mutation
  const resumeMutation = useMutation({
    mutationFn: resumeSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
      toast.success('Subscription resumed successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to resume subscription: ' + error.message);
    },
  });

  return {
    subscription,
    plans,
    isLoading,
    error,
    // Actions
    startCheckout: checkoutMutation.mutate,
    openPortal: portalMutation.mutate,
    cancel: cancelMutation.mutate,
    resume: resumeMutation.mutate,
    // Loading states
    isCheckingOut: checkoutMutation.isPending,
    isOpeningPortal: portalMutation.isPending,
    isCanceling: cancelMutation.isPending,
    isResuming: resumeMutation.isPending,
  };
}
```

### useCanCreateWorkspace Hook

```typescript
// src/hooks/useCanCreateWorkspace.ts

import { useSubscription } from './useSubscription';
import { useWorkspaces } from './useWorkspaces'; // Your existing hook

export function useCanCreateWorkspace() {
  const { subscription } = useSubscription();
  const { workspaces } = useWorkspaces();

  if (!subscription || !workspaces) {
    return { canCreate: false, reason: 'Loading...' };
  }

  const maxWorkspaces = subscription.limits.maxWorkspaces;
  const currentCount = workspaces.length;

  if (maxWorkspaces === null) {
    return { canCreate: true, reason: null };
  }

  if (currentCount >= maxWorkspaces) {
    return {
      canCreate: false,
      reason: `Your ${subscription.plan} plan allows ${maxWorkspaces} workspace(s). Upgrade to create more.`,
      currentCount,
      maxWorkspaces,
    };
  }

  return {
    canCreate: true,
    reason: null,
    currentCount,
    maxWorkspaces,
  };
}
```

---

## 4. Components

### PricingCard Component

```tsx
// src/components/billing/PricingCard.tsx

import { useState } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Plan, PlanType, BillingInterval } from '@/types/subscription';
import { formatLimit, PLAN_COLORS } from '@/types/subscription';

interface PricingCardProps {
  plan: Plan;
  currentPlan: PlanType;
  billingInterval: BillingInterval;
  onSelect: (plan: PlanType, interval: BillingInterval) => void;
  isLoading?: boolean;
}

export function PricingCard({
  plan,
  currentPlan,
  billingInterval,
  onSelect,
  isLoading,
}: PricingCardProps) {
  const isCurrentPlan = plan.id === currentPlan;
  const isUpgrade = ['PRO', 'GROWTH'].includes(plan.id) &&
    (currentPlan === 'FREE' || (currentPlan === 'PRO' && plan.id === 'GROWTH'));
  const isDowngrade = !isCurrentPlan && !isUpgrade && plan.id !== 'FREE';

  const price = billingInterval === 'monthly'
    ? plan.pricing.monthly
    : plan.pricing.yearly;

  const monthlyEquivalent = billingInterval === 'yearly' && price
    ? Math.round(price / 12)
    : price;

  const formatPrice = (cents: number | null) => {
    if (cents === null) return 'Free';
    return `$${(cents / 100).toFixed(0)}`;
  };

  return (
    <Card className={cn(
      'relative flex flex-col',
      isCurrentPlan && 'border-primary ring-2 ring-primary',
      plan.id === 'PRO' && !isCurrentPlan && 'border-blue-500'
    )}>
      {plan.id === 'PRO' && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500">
          Most Popular
        </Badge>
      )}

      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {plan.name}
          {isCurrentPlan && (
            <Badge variant="secondary">Current Plan</Badge>
          )}
        </CardTitle>
        <CardDescription>{plan.description}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1">
        {/* Pricing */}
        <div className="mb-6">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold">
              {formatPrice(monthlyEquivalent)}
            </span>
            {price !== null && (
              <span className="text-muted-foreground">/month</span>
            )}
          </div>
          {billingInterval === 'yearly' && price !== null && (
            <p className="text-sm text-muted-foreground">
              ${(price / 100).toFixed(0)} billed yearly (save 20%)
            </p>
          )}
        </div>

        {/* Limits */}
        <div className="mb-6 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Workspaces</span>
            <span className="font-medium">{formatLimit(plan.limits.maxWorkspaces)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Posts/month</span>
            <span className="font-medium">{formatLimit(plan.limits.maxPostsPerMonth)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Platforms</span>
            <span className="font-medium">{formatLimit(plan.limits.maxPlatformsPerWorkspace)}</span>
          </div>
        </div>

        {/* Features */}
        <ul className="space-y-2">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-green-500" />
              <span>{formatFeature(feature)}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        {isCurrentPlan ? (
          <Button className="w-full" variant="outline" disabled>
            Current Plan
          </Button>
        ) : plan.id === 'FREE' ? (
          <Button className="w-full" variant="outline" disabled>
            Free Plan
          </Button>
        ) : (
          <Button
            className="w-full"
            onClick={() => onSelect(plan.id, billingInterval)}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : isUpgrade ? 'Upgrade' : 'Switch Plan'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

// Helper to format feature keys into readable text
function formatFeature(feature: string): string {
  const featureNames: Record<string, string> = {
    basic_scheduling: 'Basic scheduling',
    single_workspace: 'Single workspace',
    multi_workspace: 'Multiple workspaces',
    analytics_basic: 'Basic analytics',
    analytics_advanced: 'Advanced analytics',
    priority_support: 'Priority support',
    team_collaboration: 'Team collaboration',
    api_access: 'API access',
  };
  return featureNames[feature] || feature;
}
```

### BillingIntervalToggle Component

```tsx
// src/components/billing/BillingIntervalToggle.tsx

import { cn } from '@/lib/utils';
import type { BillingInterval } from '@/types/subscription';

interface BillingIntervalToggleProps {
  value: BillingInterval;
  onChange: (interval: BillingInterval) => void;
}

export function BillingIntervalToggle({ value, onChange }: BillingIntervalToggleProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      <button
        className={cn(
          'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
          value === 'monthly'
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground'
        )}
        onClick={() => onChange('monthly')}
      >
        Monthly
      </button>
      <button
        className={cn(
          'px-4 py-2 rounded-lg text-sm font-medium transition-colors relative',
          value === 'yearly'
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground'
        )}
        onClick={() => onChange('yearly')}
      >
        Yearly
        <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
          -20%
        </span>
      </button>
    </div>
  );
}
```

### CurrentSubscription Component

```tsx
// src/components/billing/CurrentSubscription.tsx

import { format } from 'date-fns';
import { AlertCircle, Calendar, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { Subscription } from '@/api/subscriptions';
import { PLAN_DISPLAY_NAMES, formatLimit } from '@/types/subscription';

interface CurrentSubscriptionProps {
  subscription: Subscription;
  onManageBilling: () => void;
  onCancel: () => void;
  onResume: () => void;
  isOpeningPortal?: boolean;
  isCanceling?: boolean;
  isResuming?: boolean;
}

export function CurrentSubscription({
  subscription,
  onManageBilling,
  onCancel,
  onResume,
  isOpeningPortal,
  isCanceling,
  isResuming,
}: CurrentSubscriptionProps) {
  const isPaid = subscription.plan !== 'FREE';
  const isCanceled = subscription.cancelAtPeriodEnd;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>
              Manage your subscription and billing
            </CardDescription>
          </div>
          <Badge variant={subscription.status === 'ACTIVE' ? 'default' : 'destructive'}>
            {PLAN_DISPLAY_NAMES[subscription.plan]}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Cancellation Warning */}
        {isCanceled && subscription.currentPeriodEnd && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Your subscription will be canceled on{' '}
              {format(new Date(subscription.currentPeriodEnd), 'MMMM d, yyyy')}.
              You'll be downgraded to the Free plan.
            </AlertDescription>
          </Alert>
        )}

        {/* Past Due Warning */}
        {subscription.status === 'PAST_DUE' && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Your payment failed. Please update your payment method to avoid
              losing access to premium features.
            </AlertDescription>
          </Alert>
        )}

        {/* Plan Details */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Workspaces</p>
            <p className="text-2xl font-bold">
              {formatLimit(subscription.limits.maxWorkspaces)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Posts/month</p>
            <p className="text-2xl font-bold">
              {formatLimit(subscription.limits.maxPostsPerMonth)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Platforms</p>
            <p className="text-2xl font-bold">
              {formatLimit(subscription.limits.maxPlatformsPerWorkspace)}
            </p>
          </div>
        </div>

        {/* Billing Info */}
        {isPaid && subscription.currentPeriodEnd && (
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                {isCanceled ? 'Access until' : 'Renews'}{' '}
                {format(new Date(subscription.currentPeriodEnd), 'MMMM d, yyyy')}
              </span>
            </div>
            {subscription.billingInterval && (
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span className="capitalize">{subscription.billingInterval} billing</span>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          {isPaid && (
            <Button
              variant="outline"
              onClick={onManageBilling}
              disabled={isOpeningPortal}
            >
              {isOpeningPortal ? 'Opening...' : 'Manage Billing'}
            </Button>
          )}

          {isPaid && !isCanceled && (
            <Button
              variant="ghost"
              className="text-destructive hover:text-destructive"
              onClick={onCancel}
              disabled={isCanceling}
            >
              {isCanceling ? 'Canceling...' : 'Cancel Subscription'}
            </Button>
          )}

          {isCanceled && (
            <Button onClick={onResume} disabled={isResuming}>
              {isResuming ? 'Resuming...' : 'Resume Subscription'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
```

### UpgradeModal Component

```tsx
// src/components/billing/UpgradeModal.tsx

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PricingCard } from './PricingCard';
import { BillingIntervalToggle } from './BillingIntervalToggle';
import type { Plan, PlanType, BillingInterval } from '@/types/subscription';

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
  plans: Plan[];
  currentPlan: PlanType;
  onSelectPlan: (plan: PlanType, interval: BillingInterval) => void;
  isLoading?: boolean;
}

export function UpgradeModal({
  open,
  onClose,
  plans,
  currentPlan,
  onSelectPlan,
  isLoading,
}: UpgradeModalProps) {
  const [billingInterval, setBillingInterval] = useState<BillingInterval>('yearly');

  // Filter to only show paid plans
  const paidPlans = plans.filter((p) => p.id !== 'FREE');

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Upgrade Your Plan</DialogTitle>
          <DialogDescription>
            Choose the plan that best fits your needs
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <BillingIntervalToggle
            value={billingInterval}
            onChange={setBillingInterval}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {paidPlans.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              currentPlan={currentPlan}
              billingInterval={billingInterval}
              onSelect={onSelectPlan}
              isLoading={isLoading}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

---

## 5. Settings Page Integration

### BillingSettings Page

```tsx
// src/pages/settings/BillingSettings.tsx

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useSubscription } from '@/hooks/useSubscription';
import { CurrentSubscription } from '@/components/billing/CurrentSubscription';
import { PricingCard } from '@/components/billing/PricingCard';
import { BillingIntervalToggle } from '@/components/billing/BillingIntervalToggle';
import { Skeleton } from '@/components/ui/skeleton';
import type { BillingInterval } from '@/types/subscription';

export function BillingSettings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [billingInterval, setBillingInterval] = useState<BillingInterval>('yearly');

  const {
    subscription,
    plans,
    isLoading,
    startCheckout,
    openPortal,
    cancel,
    resume,
    isCheckingOut,
    isOpeningPortal,
    isCanceling,
    isResuming,
  } = useSubscription();

  // Handle success/cancel from Stripe redirect
  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      toast.success('Subscription updated successfully!');
      setSearchParams({});
    }
    if (searchParams.get('canceled') === 'true') {
      toast.info('Checkout canceled');
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!subscription || !plans) {
    return <div>Error loading subscription data</div>;
  }

  const handleSelectPlan = (plan: 'PRO' | 'GROWTH', interval: BillingInterval) => {
    startCheckout({ plan, billingInterval: interval });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Billing</h2>
        <p className="text-muted-foreground">
          Manage your subscription and billing information
        </p>
      </div>

      {/* Current Subscription */}
      <CurrentSubscription
        subscription={subscription}
        onManageBilling={() => openPortal()}
        onCancel={() => cancel()}
        onResume={() => resume()}
        isOpeningPortal={isOpeningPortal}
        isCanceling={isCanceling}
        isResuming={isResuming}
      />

      {/* Upgrade Section */}
      {subscription.plan !== 'GROWTH' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">
                {subscription.plan === 'FREE' ? 'Upgrade Your Plan' : 'Change Plan'}
              </h3>
              <p className="text-sm text-muted-foreground">
                Get access to more features and higher limits
              </p>
            </div>
            <BillingIntervalToggle
              value={billingInterval}
              onChange={setBillingInterval}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <PricingCard
                key={plan.id}
                plan={plan}
                currentPlan={subscription.plan}
                billingInterval={billingInterval}
                onSelect={handleSelectPlan}
                isLoading={isCheckingOut}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## 6. Upgrade Prompts

### WorkspaceLimitBanner Component

Show this when user tries to create a workspace but has reached their limit:

```tsx
// src/components/billing/WorkspaceLimitBanner.tsx

import { useState } from 'react';
import { Zap } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { UpgradeModal } from './UpgradeModal';
import { useSubscription } from '@/hooks/useSubscription';

interface WorkspaceLimitBannerProps {
  currentCount: number;
  maxWorkspaces: number;
}

export function WorkspaceLimitBanner({
  currentCount,
  maxWorkspaces,
}: WorkspaceLimitBannerProps) {
  const [showUpgrade, setShowUpgrade] = useState(false);
  const { subscription, plans, startCheckout, isCheckingOut } = useSubscription();

  if (!subscription || !plans) return null;

  return (
    <>
      <Alert className="border-amber-500 bg-amber-50 dark:bg-amber-950">
        <Zap className="h-4 w-4 text-amber-500" />
        <AlertTitle>Workspace limit reached</AlertTitle>
        <AlertDescription className="flex items-center justify-between">
          <span>
            You're using {currentCount} of {maxWorkspaces} workspaces on the{' '}
            {subscription.plan} plan.
          </span>
          <Button size="sm" onClick={() => setShowUpgrade(true)}>
            Upgrade
          </Button>
        </AlertDescription>
      </Alert>

      <UpgradeModal
        open={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        plans={plans}
        currentPlan={subscription.plan}
        onSelectPlan={(plan, interval) => {
          startCheckout({ plan, billingInterval: interval });
        }}
        isLoading={isCheckingOut}
      />
    </>
  );
}
```

### Usage in Create Workspace Flow

```tsx
// In your workspace creation component/page

import { useCanCreateWorkspace } from '@/hooks/useCanCreateWorkspace';
import { WorkspaceLimitBanner } from '@/components/billing/WorkspaceLimitBanner';

function CreateWorkspacePage() {
  const { canCreate, reason, currentCount, maxWorkspaces } = useCanCreateWorkspace();

  return (
    <div>
      {!canCreate && maxWorkspaces && (
        <WorkspaceLimitBanner
          currentCount={currentCount!}
          maxWorkspaces={maxWorkspaces}
        />
      )}

      {/* Your workspace creation form */}
      <form>
        {/* ... */}
        <Button type="submit" disabled={!canCreate}>
          Create Workspace
        </Button>
      </form>
    </div>
  );
}
```

---

## Quick Setup Checklist

1. **Install dependencies:**
   ```bash
   npm install @tanstack/react-query date-fns lucide-react
   ```

2. **Add the API client functions** (`src/api/subscriptions.ts`)

3. **Add types** (`src/types/subscription.ts`)

4. **Add the hook** (`src/hooks/useSubscription.ts`)

5. **Add components:**
   - `PricingCard`
   - `BillingIntervalToggle`
   - `CurrentSubscription`
   - `UpgradeModal`
   - `WorkspaceLimitBanner`

6. **Create the billing settings page** and add to your router

7. **Add upgrade prompts** where limits are enforced

---

## Testing

1. Use Stripe test mode (your dashboard shows "Environnement de test")
2. Use test card: `4242 4242 4242 4242` (any future date, any CVC)
3. Test the full flow:
   - View plans
   - Start checkout
   - Complete payment
   - Verify subscription updated
   - Test portal access
   - Test cancel/resume
