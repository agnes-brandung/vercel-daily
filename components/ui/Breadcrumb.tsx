import { ChevronRightIcon } from '@/components/ui/icons/chevron-right';
import { Copy, TextLink } from '@/components/ui/Typography';
import { cn } from '@/utils/cn';

export type BreadcrumbLinkItem = {
  label: string;
  href: string;
}

export type BreadcrumbProps = {
  /**
   * Whether to show only a link back to Home.
   */
  oneLevelOnly?: boolean;
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
  className?: string;
}

const breadcrumbContainerStyles = 'flex flex-wrap items-center gap-x-2 gap-y-1';
const itemStyles = 'flex items-center gap-1';
const labelStyles = 'inline-block py-1 text-sm';

/**
 * Compact breadcrumb for reuse across routes. Server Component — pass static `items` / `current` from the page or layout.
 */
export function Breadcrumb({ items, current, className }: BreadcrumbProps) {
  if (items.length === 0 && !current) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className={cn(className)}>
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
          <li className={itemStyles} aria-current="page">
            {items.length > 0 ? (
              <ChevronRightIcon aria-hidden />
            ) : null}
            <Copy size="sm" color="lightGray">
              {current}
            </Copy>
          </li>
        ) : null}
      </ol>
    </nav>
  );
}
