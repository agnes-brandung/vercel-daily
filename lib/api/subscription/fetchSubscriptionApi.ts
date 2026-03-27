import { BASE_URL } from '../const';

/**
 * Every call to the subscription API includes the Vercel bypass header.
 * When `subscriptionToken` is set, `x-subscription-token` is added as well.
 */
function subscriptionApiHeaders(subscriptionToken?: string): Record<string, string> {
  const headers: Record<string, string> = {
  'x-vercel-protection-bypass': process.env.VERCEL_PROTECTION_BYPASS!,
  };

  if (subscriptionToken?.trim()) {
    headers['x-subscription-token'] = subscriptionToken.trim();
  }
  
  return headers;
}

async function parseBackendJson<T>(res: Response): Promise<ApiBackendResult<T>> {
  const text = await res.text();
  if (!text.trim()) {
    return { ok: false, error: `Empty response body (${res.status})` };
  }
  let backend: unknown;
  try {
    backend = JSON.parse(text) as unknown;
  } catch {
    return { ok: false, error: `Invalid JSON (${res.status})` };
  }
  if (
    typeof backend !== 'object' ||
    backend === null ||
    !('success' in backend) ||
    !('data' in backend) ||
    !(backend as { success: unknown }).success ||
    (backend as { data: unknown }).data === undefined
  ) {
    return { ok: false, error: `Invalid response shape (${res.status})` };
  }
  return { ok: true, data: (backend as { data: T }).data };
}

/** GET …/subscription — current status (requires token). */
export async function fetchSubscriptionStatus(
  token: string,
): Promise<ApiBackendResult<ApiSubscriptionStatus>> {
  try {
    const res = await fetch(`${BASE_URL}/subscription`, {
      method: 'GET',
      headers: subscriptionApiHeaders(token),
    });
    if (!res.ok) {
      return { ok: false, error: `GET subscription failed (${res.status})` };
    }
    return parseBackendJson<ApiSubscriptionStatus>(res);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return { ok: false, error: message };
  }
}

/** POST …/subscription — activate (requires token). */
export async function activateSubscription(
  token: string,
): Promise<ApiBackendResult<ApiSubscriptionStatus>> {
  try {
    const res = await fetch(`${BASE_URL}/subscription`, {
      method: 'POST',
      headers: subscriptionApiHeaders(token),
    });
    if (!res.ok) {
      return { ok: false, error: `POST subscription failed (${res.status})` };
    }
    return parseBackendJson<ApiSubscriptionStatus>(res);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return { ok: false, error: message };
  }
}

/** DELETE …/subscription — deactivate (requires token). */
export async function deactivateSubscription(
  token: string,
): Promise<ApiBackendResult<ApiSubscriptionStatus>> {
  try {
    const res = await fetch(`${BASE_URL}/subscription`, {
      method: 'DELETE',
      headers: subscriptionApiHeaders(token),
    });
    if (!res.ok) {
      return { ok: false, error: `DELETE subscription failed (${res.status})` };
    }
    return parseBackendJson<ApiSubscriptionStatus>(res);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return { ok: false, error: message };
  }
}

export type CreateSubscriptionResult =
  | { ok: true; token: string }
  | { ok: false; error: string };

export async function createSubscription(): Promise<CreateSubscriptionResult> {
  try {
    const res = await fetch(`${BASE_URL}/subscription/create`, {
      method: 'POST',
      headers: subscriptionApiHeaders(),
    });
    const token = res.headers.get('x-subscription-token');
    if (!res.ok) {
      return {
        ok: false,
        error: `POST subscription/create failed (${res.status})`,
      };
    }
    if (!token?.trim()) {
      return { ok: false, error: 'Missing x-subscription-token response header' };
    }
    return { ok: true, token: token.trim() };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return { ok: false, error: message };
  }
}
