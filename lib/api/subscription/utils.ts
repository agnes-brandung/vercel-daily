/** HttpOnly cookie storing the upstream subscription token. */
export const SUBSCRIPTION_TOKEN_COOKIE = 'subscription_token';

const COOKIE_MAX_AGE_SEC = 60 * 60 * 24 * 30; // 30 days

/**
 * Set-Cookie flags for `subscription_token`.
 *
 * **DevTools / Network:** Browsers always send the raw `Cookie` header on requests; that is
 * visible in DevTools and is not a failure of `httpOnly`. `httpOnly` blocks **page JavaScript**
 * from reading the value via `document.cookie`, which is what reduces XSS token theft.
 */
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

/** Pass to `cookies().delete(...)` so removal matches `path: '/'` from {@link subscriptionTokenCookieOptions}. */
export function subscriptionTokenCookieDeleteOptions(): { name: string; path: string } {
  return { name: SUBSCRIPTION_TOKEN_COOKIE, path: '/' };
}

/**
 * Stable cache tag for a given subscription token.
 * Keep it token-scoped to avoid invalidating other users.
 */
export function subscriptionTag(token: string): string {
  return `subscription:${token}`;
}
