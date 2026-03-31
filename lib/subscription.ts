import { cookies } from 'next/headers';
import { cacheLife, cacheTag } from 'next/cache';

import { fetchSubscriptionStatus } from '@/lib/api/subscription/fetchSubscriptionApi';

/** HttpOnly cookie storing the upstream subscription token. */
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
 * Stable cache tag for a given subscription token.
 * Keep it token-scoped to avoid invalidating other users.
 */
export function subscriptionTag(token: string): string {
  return `subscription:${token}`;
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
