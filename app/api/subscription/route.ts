import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import {
  deactivateSubscription,
  fetchSubscriptionStatus,
  activateSubscription,
} from '@/lib/api/subscription/fetchSubscriptionApi';
import { SUBSCRIPTION_TOKEN_COOKIE } from '@/lib/subscription';

async function getToken(): Promise<
  { ok: true; token: string } | { ok: false; response: NextResponse }
> {
  const token = (await cookies()).get(SUBSCRIPTION_TOKEN_COOKIE)?.value;
  if (!token) {
    return {
      ok: false,
      response: NextResponse.json({ ok: false, error: 'Missing subscription token' }, { status: 401 }),
    };
  }
  return { ok: true, token };
}

/** Get subscription status (uses cookie token). */
export async function GET() {
  const token = await getToken();
  if (!token.ok) {
    return token.response;
  }
  const result = await fetchSubscriptionStatus(token.token);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 502 });
  }
  return NextResponse.json({ ok: true, data: result.data });
}

/** Activate subscription with token */
export async function POST() {
  const token = await getToken();
  if (!token.ok) {
    return token.response;
  }
  const result = await activateSubscription(token.token);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 502 });
  }
  return NextResponse.json({ ok: true, data: result.data });
}

/** Deactivate subscription with token */
export async function DELETE() {
  const token = await getToken();
  if (!token.ok) {
    return token.response;
  }
  const result = await deactivateSubscription(token.token);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 502 });
  }
  return NextResponse.json({ ok: true, data: result.data });
}
