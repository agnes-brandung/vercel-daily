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
} from '@/lib/subscription';

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
    return { ok: true, token: existingCookie };
  }

  const created = await createSubscription();
  if (!created.ok) {
    return { ok: false, error: created.error };
  }

  cookieStore.set(SUBSCRIPTION_TOKEN_COOKIE, created.token, subscriptionTokenCookieOptions());
  return { ok: true, token: created.token };
}

export async function subscribeAction(): Promise<SubscriptionActionState> {
  const token = await getOrCreateToken();
  if (!token.ok) {
    return errorState(token.error);
  }

  // TODO: when using activation, token was found but then nothing happens.
  const activated = await activateSubscription(token.token);
  if (!activated.ok) {
    return errorState(activated.error);
  }

  // use 'max' for stale-while-revalidate semantics
  revalidateTag(subscriptionTag(token.token), 'max');
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

