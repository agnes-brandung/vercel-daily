import { ChevronRightIcon } from '@/components/ui/icons/chevron-right';
import { Copy, TextLink } from '@/components/ui/Typography';
import { cn } from '@/utils/cn';

type BreadcrumbLinkItem = {
  label: string;
  href: string;
}

type BreadcrumbProps = {
  /**
   * Ordered trail of sections (each segment is a `TextLink`), e.g.
   * `[{ label: 'Home', href: '/' }, { label: 'Articles', href: '/articles' }]` on an article detail page.
   */
  items: BreadcrumbLinkItem[];
  /**
   * Current page label (plain text, not linked). Omit when the page itself is only linked from `items`
   * (e.g. `[{ label: 'Home', href: '/' }]` on a section index).
   */
  current?: string;
}

const breadcrumbContainerStyles = 'flex flex-wrap items-center gap-x-2 gap-y-1';
const itemStyles = 'flex items-center gap-1';
/** Below `md`: current page + leading chevron on their own row so long titles wrap cleanly. */
const currentItemStyles = cn(
  itemStyles,
  'basis-full min-w-0 items-start md:basis-auto md:items-center',
);
const labelStyles = 'inline-block py-1 text-sm';

/**
 * Compact breadcrumb for reuse across routes. Server Component — pass static `items` / `current` from the page or layout.
 */
export function Breadcrumb({ items, current }: BreadcrumbProps) {
  if (items.length === 0 && !current) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb">
      <ol className={breadcrumbContainerStyles}>
        {items.map((item, index) => (
          <li key={`${item.href}-${index}`} className={itemStyles}>
            {index > 0 ? (
              <ChevronRightIcon aria-hidden />
            ) : null}
            <TextLink href={item.href} className={labelStyles}>
              {item.label}
            </TextLink>
          </li>
        ))}
        {current ? (
          <li className={currentItemStyles} aria-current="page">
            {items.length > 0 ? (
              <ChevronRightIcon aria-hidden className="mt-0.5 md:mt-0" />
            ) : null}
            <Copy
              size="sm"
              color="lightGray"
              className="min-w-0 flex-1 px-1 wrap-break-word md:flex-none"
            >
              {current}
            </Copy>
          </li>
        ) : null}
      </ol>
    </nav>
  );
}
