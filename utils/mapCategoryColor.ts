/**
 * Category → accent token (matches `--cyan`, `--magenta`, … in `app/globals.css`).
 * Do not build Tailwind classes from these strings with template literals — the bundler
 * will not emit those utilities. Use the `*_CLASS` maps below instead.
 */
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

const CATEGORY_LABEL_CLASS: Record<ArticlesCatalogSectionCategory, string> = {
  changelog: 'text-cyan',
  engineering: 'text-magenta',
  customers: 'text-emerald',
  'company-news': 'text-rose',
  community: 'text-violet',
  'most-recent': 'text-light-gray',
};

const CATEGORY_CARD_BORDER_CLASS: Record<ArticlesCatalogSectionCategory, string> = {
  changelog:
    'md:hover:border-cyan focus-visible:border-cyan focus-visible:ring-2 focus-visible:ring-cyan max-md:active:border-cyan',
  engineering:
    'md:hover:border-magenta focus-visible:border-magenta focus-visible:ring-2 focus-visible:ring-magenta max-md:active:border-magenta',
  customers:
    'md:hover:border-emerald focus-visible:border-emerald focus-visible:ring-2 focus-visible:ring-emerald max-md:active:border-emerald',
  'company-news':
    'md:hover:border-rose focus-visible:border-rose focus-visible:ring-2 focus-visible:ring-rose max-md:active:border-rose',
  community:
    'md:hover:border-violet focus-visible:border-violet focus-visible:ring-2 focus-visible:ring-violet max-md:active:border-violet',
  'most-recent':
    'md:hover:border-light-gray focus-visible:border-light-gray focus-visible:ring-2 focus-visible:ring-light-gray max-md:active:border-light-gray',
};

const CATEGORY_LEFT_BORDER_CLASS: Record<ArticlesCatalogSectionCategory, string> = {
  changelog: 'border-l-4 border-l-cyan',
  engineering: 'border-l-4 border-l-magenta',
  customers: 'border-l-4 border-l-emerald',
  'company-news': 'border-l-4 border-l-rose',
  community: 'border-l-4 border-l-violet',
  'most-recent': 'border-l-4 border-l-light-gray',
};

const CATEGORY_IMAGE_RING_CLASS: Record<ApiArticle['category'], string> = {
  changelog: 'ring-2 ring-cyan/35 ring-offset-2 ring-offset-card',
  engineering: 'ring-2 ring-magenta/35 ring-offset-2 ring-offset-card',
  customers: 'ring-2 ring-emerald/35 ring-offset-2 ring-offset-card',
  'company-news': 'ring-2 ring-rose/35 ring-offset-2 ring-offset-card',
  community: 'ring-2 ring-violet/35 ring-offset-2 ring-offset-card',
};

const CATEGORY_CATALOG_HEADER_CLASS: Record<ArticlesCatalogSectionCategory, string> = {
  changelog: 'border-b border-b-cyan/25 bg-cyan/[0.08]',
  engineering: 'border-b border-b-magenta/25 bg-magenta/[0.08]',
  customers: 'border-b border-b-emerald/25 bg-emerald/[0.08]',
  'company-news': 'border-b border-b-rose/25 bg-rose/[0.08]',
  community: 'border-b border-b-violet/25 bg-violet/[0.08]',
  'most-recent': 'border-b border-b-light-gray/25 bg-light-gray/[0.08]',
};

const CATEGORY_CATALOG_DOT_CLASS: Record<ArticlesCatalogSectionCategory, string> = {
  changelog: 'h-2 w-2 shrink-0 rounded-full shadow-sm bg-cyan',
  engineering: 'h-2 w-2 shrink-0 rounded-full shadow-sm bg-magenta',
  customers: 'h-2 w-2 shrink-0 rounded-full shadow-sm bg-emerald',
  'company-news': 'h-2 w-2 shrink-0 rounded-full shadow-sm bg-rose',
  community: 'h-2 w-2 shrink-0 rounded-full shadow-sm bg-violet',
  'most-recent': 'h-2 w-2 shrink-0 rounded-full shadow-sm bg-light-gray',
};

const FLASH_BACKGROUND: Record<ApiArticle['category'], string> = {
  changelog: 'var(--cyan)',
  engineering: 'var(--magenta)',
  customers: 'var(--emerald)',
  'company-news': 'var(--rose)',
  community: 'var(--violet)',
};

export function categoryLabelClassName(category: ArticlesCatalogSectionCategory): string {
  return CATEGORY_LABEL_CLASS[category];
}

/** `md+`: colored border on hover and on keyboard focus. Below `md`: category border color only while pressed (`:active`). */
export function categoryCardBorderClassName(category: ArticlesCatalogSectionCategory): string {
  return CATEGORY_CARD_BORDER_CLASS[category];
}

/** Static left accent for prominent cards (e.g. breaking news, catalog). */
export function categoryLeftBorderClassName(category: ArticlesCatalogSectionCategory): string {
  return CATEGORY_LEFT_BORDER_CLASS[category];
}

/** Solid category color for CSS `background-color` (e.g. breaking-news flash overlay). */
export function categoryFlashBackground(category: ApiArticle['category']): string {
  return FLASH_BACKGROUND[category];
}

/** Soft ring around hero image. */
export function categoryImageRingClassName(category: ApiArticle['category']): string {
  return CATEGORY_IMAGE_RING_CLASS[category];
}

/** Articles catalog: one tinted header strip per category section. */
export function categoryCatalogSectionHeaderClassName(category: ArticlesCatalogSectionCategory): string {
  return CATEGORY_CATALOG_HEADER_CLASS[category];
}

/** Solid category swatch (e.g. catalog section header dot). */
export function categoryCatalogDotClassName(category: ArticlesCatalogSectionCategory): string {
  return CATEGORY_CATALOG_DOT_CLASS[category];
}
