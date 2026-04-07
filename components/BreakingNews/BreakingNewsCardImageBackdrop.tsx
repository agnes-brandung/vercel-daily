import type { ReactNode } from 'react';

import { cn } from '@/utils/cn';

/** Wash over the image behind text; mobile (lower band) + desktop (text column). */
export const BREAKING_NEWS_IMAGE_SCRIM = 'bg-card/92';

/**
 * Desktop text column width — use on the left scrim and on the text block (`lg:` prefix there).
 * @example `cn('...', \`lg:\${BREAKING_NEWS_DESKTOP_TEXT_COLUMN_MAX}\`)`
 */
export const BREAKING_NEWS_DESKTOP_TEXT_COLUMN_MAX = 'max-w-[min(42rem,58%)]';

interface BreakingNewsCardImageBackdropProps {
  imageSrc: string;
  imageAlt: string;
  children: ReactNode;
}

/**
 * Full-bleed hero image with scrims: mobile = clear top band + washed lower band; desktop = washed text column + clear right.
 */
export function BreakingNewsCardImageBackdrop({
  imageSrc,
  imageAlt,
  children,
}: BreakingNewsCardImageBackdropProps) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element -- external URLs; skip Image remotePatterns */}
      <img
        src={imageSrc}
        alt={imageAlt}
        className={cn(
          'absolute inset-0 z-0 h-full min-h-96 w-full object-cover transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.02] sm:min-h-104 lg:min-h-76',
          'object-[50%_0%] lg:object-right',
        )}
      />
      <div
        className={cn(
          'pointer-events-none absolute inset-x-0 bottom-0 z-0 box-border border-t border-border lg:hidden',
          'top-50',
          BREAKING_NEWS_IMAGE_SCRIM,
        )}
        aria-hidden
      />
      <div
        className={cn(
          'pointer-events-none absolute inset-y-0 left-0 z-0 hidden w-full box-border border-r border-border lg:block',
          BREAKING_NEWS_DESKTOP_TEXT_COLUMN_MAX,
          BREAKING_NEWS_IMAGE_SCRIM,
        )}
        aria-hidden
      />
      {children}
    </>
  );
}
