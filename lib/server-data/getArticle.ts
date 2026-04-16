import { fetchNewsApi } from '@/lib/api/fetchNewsApi';
import { parseArticle, type ParsedArticle } from '@/utils/parseApiData';
import { cacheLife, cacheTag } from 'next/cache';

/** Stable segment for `cacheTag` (slug or id, trimmed). */
function getArticleCacheTagSegment(slugOrId: string): string {
  return encodeURIComponent(slugOrId.trim());
}

export type ArticleFetchResult =
  | { ok: true; data: ParsedArticle }
  | { ok: false; kind: 'not_found' }
  | { ok: false; kind: 'error'; error: string };

/**
 * Loads a single article by **slug** or **id** from `GET /articles/{slugOrId}`.
 * Cached per path segment (same lifetime as the article list).
 */
export async function getArticle(slugOrId: string): Promise<ArticleFetchResult> {
  'use cache';
  cacheLife('articles');
  cacheTag('articles', `article:${getArticleCacheTagSegment(slugOrId)}`);

  const key = slugOrId.trim();
  if (key.length === 0) {
    return { ok: false, kind: 'not_found' };
  }

  const article = await fetchNewsApi<ApiArticle>({
    endpoint: `articles/${encodeURIComponent(key)}`,
  });

  if (!article.ok) {
    if (article.status === 404) {
      return { ok: false, kind: 'not_found' };
    }
    return { ok: false, kind: 'error', error: article.error };
  }

  return { ok: true, data: parseArticle(article.data) };
}
