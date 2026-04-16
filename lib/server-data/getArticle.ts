import { fetchNewsApi } from '@/lib/api/fetchNewsApi';
import { parseArticle, type ParsedArticle } from '@/utils/parseApiData';
import { cacheLife, cacheTag } from 'next/cache';

/** Stable segment for `cacheTag` (slug or id, trimmed). */
function getArticleCacheTagSegment(slugOrId: string): string {
  return encodeURIComponent(slugOrId.trim());
}

type ArticleResult = {
  /** Resolved article, or `null` when missing (404) or empty key. */
  article: ParsedArticle | null;
  /** Present when the request failed for a reason other than “not found”. */
  error?: string;
}

/**
 * Loads a single article by **slug** or **id** from `GET /articles/{slugOrId}`.
 * Cached per path segment (same lifetime as the article list).
 */
export async function getArticle(slugOrId: string): Promise<ArticleResult> {
  'use cache';
  cacheLife('articles');
  cacheTag('articles', `article:${getArticleCacheTagSegment(slugOrId)}`);

  const key = slugOrId.trim();
  if (key.length === 0) {
    return { article: null };
  }

  const article = await fetchNewsApi<ApiArticle>({
    endpoint: `articles/${encodeURIComponent(key)}`,
  });

  if (!article.ok) {
    if (article.status === 404) {
      return { article: null };
    }
    return { article: null, error: article.error };
  }

  return { article: parseArticle(article.data) };
}
