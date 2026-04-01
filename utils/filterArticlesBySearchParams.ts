import type { ParsedArticle } from '@/utils/parseApiData';

export const SEARCH_TERM_QUERY_KEY = 'searchTerm';
export const CATEGORIES_QUERY_KEY = 'categories';

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

  const filteredBySearchTerm = allArticles.filter(
    (article) =>
      article.title.includes(searchTerm) ||
      article.excerpt.includes(searchTerm) ||
      articleContentToSearchableText(article.content).includes(searchTerm) ||
      article.tags.some((tag) => tag.includes(searchTerm)),
  );

  console.log('filteredBySearchTerm', filteredBySearchTerm)

  const finalFilteredArticles = filteredBySearchTerm.filter((article) => {
    return selectedCategories.every((category) => article.category === category);
  });
  console.log('finalFilteredArticles', finalFilteredArticles)

  return finalFilteredArticles;
}
