/**
 * Headers required for requests to the protected Vercel Daily news/subscription APIs.
 * Centralized so news and subscription clients stay in sync.
 */
export function vercelProtectionBypassHeaders(): Record<string, string> {
  return {
    'x-vercel-protection-bypass': process.env.VERCEL_PROTECTION_BYPASS!,
  };
}
