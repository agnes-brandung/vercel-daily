'use server';

import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';

import {
  activateSubscription,
  createSubscription,
  deactivateSubscription,
} from '@/lib/api/subscription/fetchSubscriptionApi';
import {
  SUBSCRIPTION_TOKEN_COOKIE,
  subscriptionTag,
  subscriptionTokenCookieOptions,
} from '@/lib/api/subscription/utils';

export type SubscriptionActionState = {
  ok: boolean;
  error?: string;
}

const okState: SubscriptionActionState = { ok: true };

function errorState(error: string): SubscriptionActionState {
  return { ok: false, error };
}

async function getOrCreateToken(): Promise<{ ok: true; token: string } | { ok: false; error: string }> {
  const cookieStore = await cookies();
  const existingCookie = cookieStore.get(SUBSCRIPTION_TOKEN_COOKIE)?.value?.trim();
  if (existingCookie) {
    cookieStore.set(SUBSCRIPTION_TOKEN_COOKIE, existingCookie, subscriptionTokenCookieOptions());
    return { ok: true, token: existingCookie };
  }

  const created = await createSubscription();
  if (!created.ok) {
    return { ok: false, error: created.error };
  }

  cookieStore.set(SUBSCRIPTION_TOKEN_COOKIE, created.token, subscriptionTokenCookieOptions());
  return { ok: true, token: created.token };
}

/**
 * Server Actions that are revalidated when the user changes their subscription status.
 * Data is mutated instantly and revalidated in the background so users see fresh content automatically.
 */
export async function subscribeAction(): Promise<SubscriptionActionState> {
  const tokenResponse = await getOrCreateToken();
  // Simulate an error
  // tokenResponse.ok = false;

  if (!tokenResponse.ok) {
    return errorState(tokenResponse.error);
  }

  const activated = await activateSubscription(tokenResponse.token);
  if (!activated.ok) {
    return errorState(activated.error);
  }

  // use 'max' for stale-while-revalidate semantics
  revalidateTag(subscriptionTag(tokenResponse.token), 'max');
  return okState;
}

export async function unsubscribeAction(): Promise<SubscriptionActionState> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SUBSCRIPTION_TOKEN_COOKIE)?.value?.trim();
  if (!token) {
    return okState;
  }

  const deactivated = await deactivateSubscription(token);
  if (!deactivated.ok) {
    return errorState(deactivated.error);
  }

  cookieStore.delete(SUBSCRIPTION_TOKEN_COOKIE);

  // use 'max' for stale-while-revalidate semantics
  revalidateTag(subscriptionTag(token), 'max');
  return okState;
}

