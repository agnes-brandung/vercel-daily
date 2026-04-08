import type { ReactNode } from 'react';

import { ImageWithFallback } from '@/components/ui/PlaceholderImg';
import { cn } from '@/utils/cn';

/** Wash over the image behind text; mobile (lower band) + desktop (text column). */
export const BREAKING_NEWS_IMAGE_SCRIM = 'bg-card/97';

/**
 * Desktop text column width — use on the left scrim and on the text block (`lg:` prefix there).
 */
export const BREAKING_NEWS_DESKTOP_TEXT_COLUMN_MAX = 'max-w-[min(70rem,80%)]';

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
      <ImageWithFallback
        src={imageSrc}
        alt={imageAlt}
        fill
        preload
        loading="eager"
        sizes="100vw"
        className={cn(
          'absolute inset-0 z-base h-full min-h-96 w-full object-cover transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.02] sm:min-h-104 lg:min-h-76',
          'object-[50%_0%] lg:object-right',
        )}
      />
      <div
        className={cn(
          'pointer-events-none absolute inset-x-0 bottom-0 z-raised box-border border-t border-border lg:hidden',
          'top-50',
          BREAKING_NEWS_IMAGE_SCRIM,
        )}
        aria-hidden
      />
      <div
        className={cn(
          'pointer-events-none absolute inset-y-0 left-0 z-raised hidden w-full box-border border-r border-border lg:block',
          BREAKING_NEWS_DESKTOP_TEXT_COLUMN_MAX,
          BREAKING_NEWS_IMAGE_SCRIM,
        )}
        aria-hidden
      />
      {children}
    </>
  );
}
