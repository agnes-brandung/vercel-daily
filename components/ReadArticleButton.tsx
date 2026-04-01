'use client';

import { ArrowRightIcon } from '@/ui/icons/arrow-right';
import { buttonStyles } from '@/ui/Button';
import { cn } from '@/utils/cn';

const readArticleIconClass =
  'inline-flex items-center transition-transform group-hover:translate-x-0.5';

export interface ReadArticleButtonProps {
  className?: string;
}

/**
 * Tertiary “read” affordance (same look as `Button` tertiary + alignleft).
 * Renders a `<span>` so it can sit inside a parent `Link` without nested `<a>` or `<button>`.
 */
export function ReadArticleButton({ className }: ReadArticleButtonProps) {
  return (
    <span
      className={cn(
        buttonStyles({ variant: 'tertiary', layout: 'labelWithIcon', alignleft: true }),
        className,
      )}
    >
      <span className="font-semibold">Read full article</span>
      <span data-testid="icon">
        <ArrowRightIcon className={readArticleIconClass}/>
      </span>
    </span>
  );
}
