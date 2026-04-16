import type { ParsedArticle } from '@/utils/parseApiData';

/** One catalog section: ordered list of articles for a category. */
export interface ArticlesByCategory {
  category: ApiArticle['category'];
  articles: ParsedArticle[];
}

/** Display order for category sections (API may return articles in any order). */
const CATEGORY_SECTION_ORDER: ApiArticle['category'][] = [
  'changelog',
  'engineering',
  'customers',
  'company-news',
  'community',
];

/** Featured first, then others, up to 6 (or fewer if there are fewer articles). */
export function pickFeaturedArticles(allArticles: ParsedArticle[]): ParsedArticle[] {
  const featured = allArticles.filter((a) => a.featured);

  if (featured.length >= 6) return featured.slice(0, 6);
  const rest = allArticles.filter((a) => !a.featured);

  return [...featured, ...rest].slice(0, Math.min(6, allArticles.length));
}

/** Groups articles by `category`, sorts each group by `publishedAt` descending, then orders sections. */
export function groupArticlesByCategory(articles: ParsedArticle[]): ArticlesByCategory[] {
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

/** Five most recently published articles (does not mutate the input array). */
export function selectMostRecentArticles(articles: ParsedArticle[], limit = 5): ParsedArticle[] {
  return [...articles]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
}
