import { NextResponse } from 'next/server';

import { createSubscription } from '@/lib/api/subscription/fetchSubscriptionApi';
import { SUBSCRIPTION_TOKEN_COOKIE, subscriptionTokenCookieOptions } from '@/lib/subscription';

/** Creates an inactive subscription upstream and stores the token in an httpOnly cookie. */
export async function POST() {
  const result = await createSubscription();
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 502 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SUBSCRIPTION_TOKEN_COOKIE, result.token, subscriptionTokenCookieOptions());
  return res;
}
