import { fetchNewsApi } from '@/lib/api/fetchNewsApi';
import { cacheLife } from 'next/cache';

export type ArticlesResult =
  | { ok: true; data: ApiArticle[] }
  | { ok: false; error: string };

/**
 * Loads trending articles from the news API and caches them for 15 minutes (stale for 5 minutes, revalidate after 15 minutes, max 1 hour)
 */
export async function getTrendingArticles({ excludeArticleId }: { excludeArticleId: ApiArticle['id'] }): Promise<ArticlesResult> {
  "use cache";
  cacheLife("articles");

  const result = await fetchNewsApi<ApiArticle[]>({ endpoint: 'articles/trending', queryParams: { exclude: [excludeArticleId] } });

  if (!result.ok) {
    return { ok: false, error: result.error };
  }

  return { ok: true, data: result.data };
}
