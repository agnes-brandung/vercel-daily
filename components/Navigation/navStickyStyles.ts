import { cn } from '@/utils/cn';

/**
 * Nav bar layout tokens only. Client components (e.g. Mobile) must import this file—not
 * `Navigation.tsx`—or the bundler pulls the whole server nav graph (`NaviSubscriptionButton`,
 * `lib/subscription` with `use cache`) into the client bundle.
 *
 * Forced-colors: `shadow-elevated` is typically suppressed; a system `CanvasText` bottom edge
 * keeps the bar separated from the page (Windows High Contrast / similar).
 */
const navBarForcedColorsBorderClass =
  'forced-colors:border-b forced-colors:border-solid forced-colors:border-b-[CanvasText]';

export const navStickyContainerStyles = cn(
  'sticky top-0 z-navigation mb-8 w-full bg-body text-typography shadow-elevated -mx-(--base-pad-x) w-[calc(100%+2*var(--base-pad-x))] px-(--base-pad-x)',
  navBarForcedColorsBorderClass
);
