import { cookies } from 'next/headers';
import { cacheLife, cacheTag } from 'next/cache';

import { fetchSubscriptionStatus } from '@/lib/api/subscription/fetchSubscriptionApi';
import { SUBSCRIPTION_TOKEN_COOKIE } from '@/lib/api/subscription/utils';
import { subscriptionTag } from '@/lib/api/subscription/utils';

type SubscriptionStatus = {
  isActive: boolean;
  /** `subscription_token` cookie is present (may be inactive until activated). */
  hasToken: boolean;
}

async function readSubscriptionTokenFromCookie(): Promise<string | null> {
  const token = (await cookies()).get(SUBSCRIPTION_TOKEN_COOKIE)?.value;
  return token?.trim() ? token.trim() : null;
}

async function getSubscriptionStatusByToken(token: string): Promise<SubscriptionStatus> {
  'use cache';
  cacheLife('days');
  cacheTag(subscriptionTag(token));

  const result = await fetchSubscriptionStatus(token);
  if (!result.ok) {
    return { isActive: false, hasToken: true };
  }

  return { isActive: result.data.status === 'active', hasToken: true };
}

/**
 * Subscription status for the current request (cookie-aware).
 * Reads runtime cookie data outside the cached scope and passes it as argument.
 */
export async function getSubscriptionStatus(): Promise<SubscriptionStatus> {
  const token = await readSubscriptionTokenFromCookie();
  if (!token) {
    return { isActive: false, hasToken: false };
  }
  return getSubscriptionStatusByToken(token);
}