import { fetchNewsApi } from '@/lib/api/fetchNewsApi';
import { parseArticle, type ParsedArticle } from '@/utils/parseApiData';
import { cacheLife } from 'next/cache';

export type ArticlesResult =
  | { ok: true; data: { allArticles: ParsedArticle[], articlesByCategory: ArticlesByCategory[], mostRecentArticles: ParsedArticle[], featuredArticles: ParsedArticle[] } }
  | { ok: false; error: string };


type ArticlesByCategory = {
  category: ApiArticle['category'];
  articles: ParsedArticle[];
};

export type SearchArticlesResult =
  | { ok: true; data: { articlesByCategory: ArticlesByCategory[], mostRecentArticles: ParsedArticle[] } }
  | { ok: false; error: string };

/** Display order for category sections (API may return articles in any order). */
const CATEGORY_SECTION_ORDER: ApiArticle['category'][] = [
  'changelog',
  'engineering',
  'customers',
  'company-news',
  'community',
];

/** Featured first, then others, up to 6 (or fewer if the API returns less). */
function pickFeaturedArticles(allArticles: ParsedArticle[]): ParsedArticle[] {
  const featured = allArticles.filter((a) => a.featured);

  if (featured.length >= 6) return featured.slice(0, 6);
  const rest = allArticles.filter((a) => !a.featured);
  
  return [...featured, ...rest].slice(0, Math.min(6, allArticles.length));
}

function groupArticlesByCategory(articles: ParsedArticle[]): Array<ArticlesByCategory> {
  const byCategory = new Map<ApiArticle['category'], ParsedArticle[]>();

  for (const article of articles) {
    const list = byCategory.get(article.category) ?? [];
    list.push(article);
    byCategory.set(article.category, list);
  }

  for (const list of byCategory.values()) {
    list.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }

  return CATEGORY_SECTION_ORDER.filter((c) => (byCategory.get(c)?.length ?? 0) > 0).map((c) => ({
    category: c,
    articles: byCategory.get(c)!,
  }));
}

function getMostRecentArticles(articles: ParsedArticle[]): ParsedArticle[] {
  return articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()).slice(0, 5);
}

/**
 * Loads articles from the news API and caches them for 15 minutes (stale for 5 minutes, revalidate after 15 minutes, max 1 hour)
 */
export async function getArticleMethods(): Promise<ArticlesResult> {
  "use cache";
  cacheLife("articles");

  const allArticles = await fetchNewsApi<ApiArticle[]>({ endpoint: 'articles' });

  if (!allArticles.ok) {
    return { ok: false, error: allArticles.error };
  }

  const parsedArticles = allArticles.data.map((article) => parseArticle(article));

  return { ok: true, data: {
    allArticles: parsedArticles,
    articlesByCategory: groupArticlesByCategory(parsedArticles),
    mostRecentArticles: getMostRecentArticles(parsedArticles),
    featuredArticles: pickFeaturedArticles(parsedArticles),
  }};
}
