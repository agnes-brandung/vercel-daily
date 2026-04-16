import { fetchNewsApi } from '@/lib/api/fetchNewsApi';
import { cacheLife, cacheTag } from 'next/cache';

export type ArticleResult =
  | { ok: true; data: ApiArticle }
  | { ok: false; error: string };

/**
 * Loads an article by its ID from the news API and caches it for 15 minutes (stale for 5 minutes, revalidate after 15 minutes, max 1 hour)
 */
export async function getArticleById({ articleId }: { articleId: ApiArticle['id'] }): Promise<ArticleResult> {
  "use cache";
  cacheLife("articles");
  cacheTag('articles', `article-${articleId}`)

  const article = await fetchNewsApi<ApiArticle>({ endpoint: `articles/${articleId}` });

  if (!article.ok) {
    return { ok: false, error: article.error };
  }

  return { ok: true, data: article.data };
}
