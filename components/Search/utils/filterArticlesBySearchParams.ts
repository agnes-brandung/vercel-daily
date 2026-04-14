import type { ParsedArticle } from '@/utils/parseApiData';

export const SEARCH_FIRST_RESULTS_MAX = 5;
export const SEARCH_TERM_QUERY_KEY = 'searchTerm';
export const CATEGORIES_QUERY_KEY = 'categories';
export const MIN_SEARCH_TERM_LENGTH = 3;

/** User query: exact letters `ai` only (any case). Lets 2-char searches run despite {@link MIN_SEARCH_TERM_LENGTH}. */
const SPECIAL_AI_USER_QUERY = /^ai$/i;

/** Whole-word capitalised `AI` only (ASCII word boundaries). Lowercase `ai` in text does not match. */
const WHOLE_WORD_CAPITAL_AI = /\bAI\b/;

/** True when the search box / URL carries the special 2-letter AI query (any casing). */
export function isSpecialShortSearchTerm(query: string): boolean {
  return SPECIAL_AI_USER_QUERY.test(query.trim());
}

/** Case-insensitive substring; not used for the special `ai` query (see {@link articleMatchesSearchTerm}). */
function textIncludes(haystack: string, needle: string): boolean {
  return haystack.toLowerCase().includes(needle.toLowerCase());
}

function articleHasCapitalAiWholeWord(article: ParsedArticle): boolean {
  if (WHOLE_WORD_CAPITAL_AI.test(article.title) || WHOLE_WORD_CAPITAL_AI.test(article.excerpt)) {
    return true;
  }
  return article.tags.some((tag) => WHOLE_WORD_CAPITAL_AI.test(tag));
}

/**
 * Title + excerpt (normal query); special `ai` query: only whole-word capitalised `AI` in title, excerpt, or tags.
 */
function articleMatchesSearchTerm(article: ParsedArticle, searchTerm: string): boolean {
  const trimmed = searchTerm.trim();
  if (SPECIAL_AI_USER_QUERY.test(trimmed)) {
    return articleHasCapitalAiWholeWord(article);
  }

  return (
    textIncludes(article.title, trimmed) ||
    textIncludes(article.excerpt, trimmed)
  );
}

/**
 * Single `categories` param: `?categories=changelog+engineering` (literal `+` between slugs).
 * Parsers decode `+` as space, so we split on spaces or `+` and decode each segment.
 */
export function parseCategorySlugsFromSearchParam(raw: string | null | undefined): string[] {
  const trimmed = (raw ?? '').trim();
  if (trimmed.length === 0) {
    return [];
  }
  return trimmed
    .split(/[\s+]+/)
    .map((segment) => {
      try {
        return decodeURIComponent(segment);
      } catch {
        return segment;
      }
    })
    .filter(Boolean);
}

function firstSearchParamValue(value: string | string[] | undefined | null): string {
  if (value === undefined || value === null) {
    return '';
  }
  if (Array.isArray(value)) {
    return (value[0] ?? '').trim();
  }
  return value.trim();
}

/** One `categories` key, slugs joined with `+` in the URL. */
export function readCategorySlugsFromSearchParamsRecord(
  searchParams: Record<string, string | string[] | undefined | null>,
): string[] {
  return parseCategorySlugsFromSearchParam(firstSearchParamValue(searchParams[CATEGORIES_QUERY_KEY]));
}

/** Builds `searchTerm=…&categories=a+b` with literal `+` between category slugs. */
export function buildSearchQueryString(trimmedSearchTerm: string, categorySlugs: string[]): string {
  const parts: string[] = [];
  if (trimmedSearchTerm.length > 0) {
    parts.push(`${SEARCH_TERM_QUERY_KEY}=${encodeURIComponent(trimmedSearchTerm)}`);
  }
  if (categorySlugs.length > 0) {
    parts.push(
      `${CATEGORIES_QUERY_KEY}=${categorySlugs.map((slug) => encodeURIComponent(slug)).join('+')}`,
    );
  }
  return parts.join('&');
}

export function readSearchTermFromSearchParamsRecord(
  searchParams: Record<string, string | string[] | undefined | null>,
): string {
  const value = searchParams[SEARCH_TERM_QUERY_KEY];
  if (value === undefined || value === null) {
    return '';
  }
  if (Array.isArray(value)) {
    return (value[0] ?? '').trim();
  }
  return value.trim();
}

type FilterProps = {
  allArticles: ParsedArticle[];
  searchTerm: string;
  selectedCategories: string[];
}

/**
 * Empty search + no categories → full list (landing only).
 * Category: URL slugs must match `article.category`; **0 selected → no article passes** the category step (empty list).
 * All categories selected in the UI → all slugs in the URL → every article matches one slug.
 * Text: ≥3 chars or special `ai` query; else only the category-narrowed list applies (no substring filter).
 */
export function filterArticlesBySearchTermAndCategories(
  { allArticles, searchTerm, selectedCategories }: FilterProps,
): ParsedArticle[] {
  const term = searchTerm.trim();

  if (term.length === 0 && selectedCategories.length === 0) {
    return allArticles;
  }

  const filteredByCategories = allArticles.filter((article) =>
    selectedCategories.includes(article.category),
  );

  const applyTextFilter =
    term.length >= MIN_SEARCH_TERM_LENGTH || isSpecialShortSearchTerm(term);

  if (!applyTextFilter) {
    return filteredByCategories;
  }

  return filteredByCategories.filter((article) => articleMatchesSearchTerm(article, term));
}
