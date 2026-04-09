export const CATEGORY_COLOR_MAP = {
  changelog: 'cyan',
  engineering: 'magenta',
  customers: 'emerald',
  'company-news': 'rose',
  community: 'violet',
  'most-recent': 'light-gray',
} as const satisfies Record<ApiArticle['category'] | 'most-recent', string>;

/** Catalog-only section key (not an API category). Uses `lightGray` accent styling. */
export type ArticlesCatalogSectionCategory = ApiArticle['category'] | 'most-recent';

export function categoryLabelClassName(category: ApiArticle['category'] | 'most-recent'): string {
  return `text-${CATEGORY_COLOR_MAP[category]}`;
}

/** `md+`: colored border on hover and on keyboard focus. Below `md`: category border color only while pressed (`:active`). */
export function categoryCardBorderClassName(category: ApiArticle['category'] | 'most-recent'): string {
  return `md:hover:border-${CATEGORY_COLOR_MAP[category]} focus-visible:border-${CATEGORY_COLOR_MAP[category]} focus-visible:ring-2 focus-visible:ring-${CATEGORY_COLOR_MAP[category]} max-md:active:border-${CATEGORY_COLOR_MAP[category]}`;
}

/** Static left accent for prominent cards (e.g. breaking news, catalog). */
export function categoryLeftBorderClassName(category: ApiArticle['category'] | 'most-recent'): string {
  return `border-l-4 border-l-${CATEGORY_COLOR_MAP[category]}`;
}

/** Solid category color for CSS `background-color` (e.g. breaking-news flash overlay). */
export function categoryFlashBackground(category: ApiArticle['category']): string {
  return `var(--${CATEGORY_COLOR_MAP[category]})`;
}

/** Soft ring around hero image. */
export function categoryImageRingClassName(category: ApiArticle['category']): string {
  return `ring-2 ring-${CATEGORY_COLOR_MAP[category]}/35 ring-offset-2 ring-offset-card`;
}

/** Articles catalog: one tinted header strip per category section. */
export function categoryCatalogSectionHeaderClassName(
  category: ApiArticle['category'] | 'most-recent',
): string {
  return `border-b border-b-${CATEGORY_COLOR_MAP[category]}/25 bg-${CATEGORY_COLOR_MAP[category]}/[0.08]`;
}

/** Solid category swatch (e.g. catalog section header dot). */
export function categoryCatalogDotClassName(category: ApiArticle['category'] | 'most-recent'): string {
  return `h-2 w-2 shrink-0 rounded-full shadow-sm ${CATEGORY_COLOR_MAP[category]}`;
}
