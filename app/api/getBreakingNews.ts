import { fetchNewsApi } from '@/lib/api';
import { cacheLife } from 'next/cache';

export type BreakingNewsResult =
  | { ok: true; data: ApiBreakingNews }
  | { ok: false; error: string };

/**
 * Loads breaking news from the news API and caches them for 1 minute (stale for 15 seconds, revalidate after 1 minute, max 2 minutes)
 */
export async function getBreakingNews(): Promise<BreakingNewsResult> {
  "use cache";
  cacheLife("breakingNews");

  const result = await fetchNewsApi<ApiBreakingNews>({ endpoint: 'breaking-news' });

  if (!result.ok) {
    return { ok: false, error: result.error };
  }

  return { ok: true, data: result.data };
}
