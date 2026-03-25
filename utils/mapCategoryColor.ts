const CATEGORY_COLOR_CLASS = {
  changelog: 'text-cyan',
  engineering: 'text-magenta',
  customers: 'text-emerald',
  'company-news': 'text-rose',
  community: 'text-violet',
} as const satisfies Record<ApiArticle['category'], string>;

/** `md+`: colored border on hover and on keyboard focus. Below `md`: category border color only while pressed (`:active`). */
const CATEGORY_CARD_BORDER_CLASS = {
  changelog:
    'md:hover:border-cyan focus-visible:border-cyan focus-visible:ring-cyan max-md:active:border-cyan',
  engineering:
    'md:hover:border-magenta focus-visible:border-magenta focus-visible:ring-magenta max-md:active:border-magenta',
  customers:
    'md:hover:border-emerald focus-visible:border-emerald focus-visible:ring-emerald max-md:active:border-emerald',
  'company-news':
    'md:hover:border-rose focus-visible:border-rose focus-visible:ring-rose max-md:active:border-rose',
  community:
    'md:hover:border-violet focus-visible:border-violet focus-visible:ring-violet max-md:active:border-violet',
} as const satisfies Record<ApiArticle['category'], string>;

export function categoryLabelClassName(category: ApiArticle['category']): string {
  return CATEGORY_COLOR_CLASS[category];
}

export function categoryCardBorderClassName(category: ApiArticle['category']): string {
  return CATEGORY_CARD_BORDER_CLASS[category];
}

/** Static left accent for prominent cards (e.g. breaking news). */
const CATEGORY_LEFT_BORDER_CLASS = {
  changelog: 'border-l-cyan',
  engineering: 'border-l-magenta',
  customers: 'border-l-emerald',
  'company-news': 'border-l-rose',
  community: 'border-l-violet',
} as const satisfies Record<ApiArticle['category'], string>;

export function categoryLeftBorderClassName(category: ApiArticle['category']): string {
  return `border-l-4 ${CATEGORY_LEFT_BORDER_CLASS[category]}`;
}

/** Solid category color for CSS `background-color` (e.g. breaking-news flash overlay). */
const CATEGORY_FLASH_BACKGROUND = {
  changelog: 'var(--cyan)',
  engineering: 'var(--magenta)',
  customers: 'var(--emerald)',
  'company-news': 'var(--rose)',
  community: 'var(--violet)',
} as const satisfies Record<ApiArticle['category'], string>;

export function categoryFlashBackground(category: ApiArticle['category']): string {
  return CATEGORY_FLASH_BACKGROUND[category];
}
