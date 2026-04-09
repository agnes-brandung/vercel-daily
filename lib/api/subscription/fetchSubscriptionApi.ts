import { BASE_URL } from '../const';
import { parseBackendJson } from '../parseBackendJson';
import { vercelProtectionBypassHeaders } from '../vercelProtectionHeaders';

const SUBSCRIPTION_OPERATION = {
  GET: 'status',
  POST: 'activation',
  DELETE: 'deactivation',
  CREATE: 'subscription creation',
};
const getErrorMessage = (operation: keyof typeof SUBSCRIPTION_OPERATION) => `Something went wrong during the ${SUBSCRIPTION_OPERATION[operation]} process of your subscription. Please retry later.`;

/**
 * Every call to the subscription API includes the Vercel bypass header.
 * When `subscriptionToken` is set, `x-subscription-token` is added as well.
 */
function subscriptionApiHeaders(subscriptionToken?: string): Record<string, string> {
  const headers: Record<string, string> = { ...vercelProtectionBypassHeaders() };

  if (subscriptionToken?.trim()) {
    headers['x-subscription-token'] = subscriptionToken.trim();
  }

  return headers;
}

function handleSubscriptionMethod(method: 'GET' | 'POST' | 'DELETE') {
  return async (token: string): Promise<ApiBackendResult<ApiSubscriptionStatus>> => {
    try {
    const res = await fetch(`${BASE_URL}/subscription`, {
        method,
        headers: subscriptionApiHeaders(token),
      });

      if (!res.ok) {
        return { ok: false, error: getErrorMessage(method) };
      }

      return await parseBackendJson<ApiSubscriptionStatus>(res);
    } catch (e) {
      const message = e instanceof Error ? e.message : getErrorMessage(method);
      console.error(`Error handleSubscriptionMethod: ${method}. Error: ${message}`);
      return { ok: false, error: message };
    }
  };
};

export const fetchSubscriptionStatus = handleSubscriptionMethod('GET');
export const activateSubscription = handleSubscriptionMethod('POST');
export const deactivateSubscription = handleSubscriptionMethod('DELETE');

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
        error: getErrorMessage('CREATE'),
      };
    }
    if (!token?.trim()) {
      return { ok: false, error: 'Missing x-subscription-token response header' };
    }
    return { ok: true, token: token.trim() };
  } catch (e) {
    const message = e instanceof Error ? e.message : getErrorMessage('CREATE');
    console.error('Error POST createSubscription. Error:', e);
    return { ok: false, error: message };
  }
}
