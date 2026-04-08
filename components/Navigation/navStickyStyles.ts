/**
 * Nav bar layout tokens only. Client components (e.g. Mobile) must import this file—not
 * `Navigation.tsx`—or the bundler pulls the whole server nav graph (`NaviSubscriptionButton`,
 * `lib/subscription` with `use cache`) into the client bundle.
 */
export const navStickyContainerStyles =
  'sticky top-0 z-navigation mb-8 w-full bg-body text-typography shadow-elevated -mx-(--base-pad-x) w-[calc(100%+2*var(--base-pad-x))] px-(--base-pad-x)';
