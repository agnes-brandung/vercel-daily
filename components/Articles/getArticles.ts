import { fetchNewsApi } from '@/lib/api';
import { cacheLife } from 'next/cache';

export type ArticlesResult =
  | { ok: true; allArticles: ApiArticle[] }
  | { ok: false; error: string };

/**
 * Loads articles from the news API and caches them for 15 minutes (stale for 5 minutes, revalidate after 15 minutes, max 1 hour)
 */
export async function getArticles(): Promise<ArticlesResult> {
  "use cache";
  cacheLife("articles");

  const result = await fetchNewsApi<ApiArticle[]>({ endpoint: 'articles' });

  if (!result.ok) {
    return { ok: false, error: result.error };
  }

  return { ok: true, allArticles: result.data };
}
