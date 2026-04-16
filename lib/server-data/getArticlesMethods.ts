import { fetchNewsApi } from '@/lib/api/fetchNewsApi';
import { parseArticle, type ParsedArticle } from '@/utils/parseApiData';
import { cacheLife, cacheTag } from 'next/cache';
import {
  type ArticlesByCategory,
  groupArticlesByCategory,
  pickFeaturedArticles,
  selectMostRecentArticles,
} from '@/lib/server-data/articleListDerivations';

export type { ArticlesByCategory } from '@/lib/server-data/articleListDerivations';

export type ArticlesResult =
  | {
      ok: true;
      data: {
        allArticles: ParsedArticle[];
        articlesByCategory: ArticlesByCategory[];
        mostRecentArticles: ParsedArticle[];
        featuredArticles: ParsedArticle[];
      };
    }
  | { ok: false; error: string };

export type SearchArticlesResult =
  | { ok: true; data: { articlesByCategory: ArticlesByCategory[]; mostRecentArticles: ParsedArticle[] } }
  | { ok: false; error: string };

/**
 * Loads articles from the news API and caches them for 15 minutes (stale for 5 minutes, revalidate after 15 minutes, max 1 hour)
 */
export async function getArticleMethods(): Promise<ArticlesResult> {
  'use cache';
  cacheLife('articles');
  cacheTag('articles', 'all-articles');

  const allArticles = await fetchNewsApi<ApiArticle[]>({ endpoint: 'articles' });

  if (!allArticles.ok) {
    return { ok: false, error: allArticles.error };
  }

  const parsedArticles = allArticles.data.map((article) => parseArticle(article));

  return {
    ok: true,
    data: {
      allArticles: parsedArticles,
      articlesByCategory: groupArticlesByCategory(parsedArticles),
      mostRecentArticles: selectMostRecentArticles(parsedArticles),
      featuredArticles: pickFeaturedArticles(parsedArticles),
    },
  };
}
