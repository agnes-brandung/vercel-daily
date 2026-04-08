export async function parseBackendJson<T>(res: Response): Promise<ApiBackendResult<T>> {
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