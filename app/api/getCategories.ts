import { fetchNewsApi } from '@/lib/api/fetchNewsApi';
import { cacheLife } from 'next/cache';

export type CategoriesResult =
  | { ok: true; data: ApiCategory[] }
  | { ok: false; error: string };

/**
 * Loads categories from the news API and caches them for 1 week since categories probably do not change often.
 */
export async function getCategories(): Promise<CategoriesResult> {
  "use cache";
  cacheLife("weeks");

  const result = await fetchNewsApi<ApiCategory[]>({ endpoint: 'categories' });

  if (!result.ok) {
    return { ok: false, error: result.error };
  }

  return { ok: true, data: result.data };
}
