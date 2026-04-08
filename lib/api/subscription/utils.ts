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

/**
 * Stable cache tag for a given subscription token.
 * Keep it token-scoped to avoid invalidating other users.
 */
export function subscriptionTag(token: string): string {
  return `subscription:${token}`;
}
