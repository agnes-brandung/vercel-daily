import type { ParsedArticle } from '@/utils/parseApiData';

export const SEARCH_FIRST_RESULTS_MAX = 5;
export const SEARCH_TERM_QUERY_KEY = 'searchTerm';
export const CATEGORIES_QUERY_KEY = 'categories';
export const MIN_SEARCH_TERM_LENGTH = 3;

/** User query: exact letters `ai` only (any case). Lets 2-char searches run despite {@link MIN_SEARCH_TERM_LENGTH}. */
const SPECIAL_AI_USER_QUERY = /^ai$/i;

/** Article search: only searches for whole-word, capitalised ` AI ` only. Substrings like `ai` inside "plain text" must not match, even if the user typed `ai`.*/
const WHOLE_WORD_CAPITAL_AI_IN_TEXT = /\bAI\b/;

/** True when the search box / URL carries the special 2-letter AI query (any casing). */
export function isSpecialShortSearchTerm(trimmedQuery: string): boolean {
  return SPECIAL_AI_USER_QUERY.test(trimmedQuery);
}

/** Case-insensitive substring; not used for the special `ai` query (see {@link articleMatchesSearchTerm}). */
function textIncludes(haystack: string, needle: string): boolean {
  return haystack.toLowerCase().includes(needle.toLowerCase());
}

// TODO remove test - only search in title for now
function articleMatchesSearchTerm(article: ParsedArticle, searchTerm: string): boolean {
  const bodyText = articleContentToSearchableText(article.content);

  if (SPECIAL_AI_USER_QUERY.test(searchTerm)) {
    return article.title.includes(searchTerm);
    return (
      WHOLE_WORD_CAPITAL_AI_IN_TEXT.test(article.title) ||
      WHOLE_WORD_CAPITAL_AI_IN_TEXT.test(article.excerpt) ||
      WHOLE_WORD_CAPITAL_AI_IN_TEXT.test(bodyText) ||
      article.tags.some((tag) => WHOLE_WORD_CAPITAL_AI_IN_TEXT.test(tag))
    );
  }

  return textIncludes(article.title, searchTerm);
  // Case-insensitive everywhere; AI branch above stays the exception (whole-word `AI`, test stub).
  return (
    textIncludes(article.title, searchTerm) ||
    textIncludes(article.excerpt, searchTerm) ||
    textIncludes(bodyText, searchTerm) ||
    article.tags.some((tag) => textIncludes(tag, searchTerm))
  );
}

/** Flatten rich blocks or plain-text body into one string for substring search. */
export function articleContentToSearchableText(content: ParsedArticle['content']): string {
  if (Array.isArray(content)) {
    return content
      .map((block) => {
        switch (block.type) {
          case 'paragraph':
          case 'heading':
          case 'blockquote':
            return block.text;
          case 'unordered-list':
          case 'ordered-list':
            return block.items.join(' ');
          case 'image':
            return `${block.alt} ${block.caption ?? ''}`.trim();
          default: {
            const _exhaustive: never = block;
            void _exhaustive;
            return '';
          }
        }
      })
      .join(' ');
  }
  return content.text;
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

/** Empty search term → full list; else substring match on title, excerpt, body text, tags. */
export function filterArticlesBySearchTermAndCategories(
  { allArticles, searchTerm, selectedCategories }: FilterProps,
): ParsedArticle[] {
  if (searchTerm.length === 0 && selectedCategories.length === 0) {
    return allArticles;
  }

  const filteredByCategories = allArticles.filter((article) =>
    selectedCategories.includes(article.category),
  );

  let finalFilteredArticles: ParsedArticle[] = [];

  if (searchTerm.length >= MIN_SEARCH_TERM_LENGTH) {
    finalFilteredArticles = filteredByCategories.filter((article) =>
      articleMatchesSearchTerm(article, searchTerm),
    );
  } else {
    finalFilteredArticles = filteredByCategories;
  }

  return finalFilteredArticles;
}
