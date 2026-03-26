const BASE_URL = "https://vercel-daily-news-api.vercel.app/api";

export type BackendResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

/**
 * Fetches from the news API and returns a result (no throw), branch on `ok` in the components.
 */
export async function fetchNewsApi<T>({
  endpoint,
}: {
  endpoint: string;
}): Promise<BackendResult<T>> {
  try {
    const res = await fetch(`${BASE_URL}/${endpoint}`, {
      headers: {
        "x-vercel-protection-bypass": process.env.VERCEL_PROTECTION_BYPASS!,
      },
    });

    if (!res.ok) {
      return {
        ok: false,
        error: `Failed to fetch ${endpoint} (${res.status})`,
      };
    }

    // TODO: improve type once we know all the endpoints and their data schemes?
    const backend: unknown = await res.json();

    if (
      typeof backend !== "object" ||
      backend === null ||
      !("success" in backend) ||
      !("data" in backend) ||
      !(backend as { success: unknown }).success ||
      (backend as { data: unknown }).data === undefined
    ) {
      return {
        ok: false,
        error: `Invalid response from ${endpoint} (${res.status})`,
      };
    }

    return { ok: true, data: (backend as { data: T }).data };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return { ok: false, error: message };
  }
}

/** For Route Handlers etc.: same fetch, but throws on failure instead of `BackendResult`. */
export async function fetchNewsApiOrThrow<T>({
  endpoint,
}: {
  endpoint: string;
}): Promise<T> {
  const result = await fetchNewsApi<T>({ endpoint });
  if (!result.ok) {
    throw new Error(result.error);
  }
  return result.data;
}
