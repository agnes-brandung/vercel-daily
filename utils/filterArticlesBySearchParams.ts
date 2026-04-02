import type { ParsedArticle } from '@/utils/parseApiData';

export const SEARCH_TERM_QUERY_KEY = 'searchTerm';
export const CATEGORIES_QUERY_KEY = 'categories';

export const MIN_SEARCH_TERM_LENGTH = 3;

/** User query: exact letters `ai` only (any case). Lets 2-char searches run despite {@link MIN_SEARCH_TERM_LENGTH}. */
const SPECIAL_AI_USER_QUERY = /^ai$/i;

/**
 * Article search: only searches for whole-word, capitalised ` AI ` only. Substrings like `ai` inside "plain text" must not match, even if the user typed `ai`.
 */
const WHOLE_WORD_CAPITAL_AI_IN_TEXT = /\bAI\b/;

/** True when the search box / URL carries the special 2-letter AI query (any casing). */
export function isSpecialShortSearchTerm(trimmedQuery: string): boolean {
  return SPECIAL_AI_USER_QUERY.test(trimmedQuery);
}

function articleMatchesSearchTerm(article: ParsedArticle, searchTerm: string): boolean {
  const bodyText = articleContentToSearchableText(article.content);
  
  if (SPECIAL_AI_USER_QUERY.test(searchTerm)) {
      // TODO remove test - only search in title
      return article.title.includes(searchTerm);
    return (
      WHOLE_WORD_CAPITAL_AI_IN_TEXT.test(article.title) ||
      WHOLE_WORD_CAPITAL_AI_IN_TEXT.test(article.excerpt) ||
      WHOLE_WORD_CAPITAL_AI_IN_TEXT.test(bodyText) ||
      article.tags.some((tag) => WHOLE_WORD_CAPITAL_AI_IN_TEXT.test(tag))
    );
  }

  // TODO remove test - only search in title
  return (
    article.title.includes(searchTerm)
  );

  return (
    article.title.includes(searchTerm) ||
    article.excerpt.includes(searchTerm) ||
    bodyText.includes(searchTerm) ||
    article.tags.some((tag) => tag.includes(searchTerm))
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

function searchParamToStringArray(value: string | string[] | undefined | null): string[] {
  if (value === undefined || value === null) {
    return [];
  }
  if (Array.isArray(value)) {
    return value.map((s) => s.trim()).filter(Boolean);
  }
  return value.trim() ? [value.trim()] : [];
}

/** Repeated keys: `?categories=a&categories=b` → Next may give string or string[]. */
export function readCategorySlugsFromSearchParamsRecord(
  searchParams: Record<string, string | string[] | undefined | null>,
): string[] {
  return searchParamToStringArray(searchParams[CATEGORIES_QUERY_KEY]);
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

  const filteredBySearchTerm = allArticles.filter((article) =>
    articleMatchesSearchTerm(article, searchTerm),
  );

  if (selectedCategories.length === 0) {
    return filteredBySearchTerm;
  }

  const finalFilteredArticles = filteredBySearchTerm.filter((article) =>
    selectedCategories.includes(article.category),
  );

  return finalFilteredArticles;
}
