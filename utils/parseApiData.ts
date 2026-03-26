/**
 * Presentation helpers: category labels, trimming, and parsers for UI-ready payloads.
 */

/** `ApiArticle` with trimmed `excerpt` and `categoryLabel` for display. */
export interface ParsedArticle extends ApiArticle {
  categoryLabel: string;
}

/** `ApiBreakingNews` with trimmed `headline` / `summary` and `categoryLabel`. */
export interface ParsedBreakingNews extends ApiBreakingNews {
  categoryLabel: string;
}

/** Hyphens in API category slugs → spaces for headings and labels. */
export function formatArticleCategoryLabel(category: ApiArticle['category']): string {
  return category.replace(/-/g, ' ');
}

export function parseArticle(article: ApiArticle): ParsedArticle {
  return {
    ...article,
    excerpt: article.excerpt.trim(),
    categoryLabel: formatArticleCategoryLabel(article.category),
  };
}

export function parseBreakingNews(breaking: ApiBreakingNews): ParsedBreakingNews {
  return {
    ...breaking,
    headline: breaking.headline.trim(),
    summary: breaking.summary.trim(),
    categoryLabel: formatArticleCategoryLabel(breaking.category),
  };
}
