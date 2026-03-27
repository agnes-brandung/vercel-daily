import { cache } from 'react';
import { cookies } from 'next/headers';

import { fetchSubscriptionStatus } from '@/lib/api/subscription/fetchSubscriptionApi';

/** HttpOnly cookie storing the upstream subscription token (set by `/api/subscription/create`). */
export const SUBSCRIPTION_TOKEN_COOKIE = 'subscription_token';

const COOKIE_MAX_AGE_SEC = 60 * 60 * 24 * 30; // 30 days

export function subscriptionTokenCookieOptions(): {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'lax';
  path: string;
  maxAge: number;
} {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: COOKIE_MAX_AGE_SEC,
  };
}

export type SubscriptionStatus = {
  isActive: boolean;
  /** `subscription_token` cookie is present (may be inactive until activated). */
  hasToken: boolean;
}

/**
 * Single upstream GET per request; use for Subscribe/Unsubscribe UI hints and `isSubscribed`.
 */
export const getSubscriptionStatus = cache(async (): Promise<SubscriptionStatus> => {
  const subscriptionTokenCookie = (await cookies()).get(SUBSCRIPTION_TOKEN_COOKIE)?.value;
  if (!subscriptionTokenCookie) {
    return { isActive: false, hasToken: false };
  }

  const result = await fetchSubscriptionStatus(subscriptionTokenCookie);
  if (!result.ok) {
    return { isActive: false, hasToken: true };
  }

  return {
    isActive: result.data.status === 'active',
    hasToken: true,
  };
});

/**
 * Central check: subscribed only when the cookie exists and upstream GET reports `status === 'active'`.
 * Use in Server Components, Server Actions, and route handlers (not in client components).
 */
// TODO: use next cacheLife instead of react cache + revalidate the cache when the subscription status changes
export const isSubscribed = cache(async (): Promise<boolean> => {
  const subscription = await getSubscriptionStatus();
  return subscription.isActive;
});
