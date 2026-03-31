/**
 * Failed app Route Handlers return JSON `{ ok: false, error: string }`.
 * Use this when calling `fetch('/api/...')` from the client so components stay thin.
 */
export async function readClientApiError(response: Response, fallback: string): Promise<string> {
  try {
    const data = (await response.json()) as { error?: unknown };
    if (typeof data.error === 'string' && data.error.length > 0) {
      return data.error;
    }
  } catch {
    // Non-JSON or empty body
  }
  return fallback;
}
