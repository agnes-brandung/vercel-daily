import { BASE_URL } from './const';

/**
 * Fetches from the news API and returns a result (no throw), branch on `ok` in the components.
 */
export async function fetchNewsApi<T>({
  endpoint,
  queryParams,
}: {
  endpoint: string;
  queryParams?: Record<string, string | string[]>;
}): Promise<ApiBackendResult<T>> {  
  try {
    const url = new URL(`${BASE_URL}/${endpoint}`);

    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => url.searchParams.append(key, v));
        } else {
          url.searchParams.append(key, value);
        }
      });
    }

    const res = await fetch(url.toString(), {
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