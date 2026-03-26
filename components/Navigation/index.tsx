import { Suspense } from 'react';
import NavigationDesktop from './Desktop';
import NavigationMobile from './Mobile';
import { InfoMessage } from '../ui/InfoMessage';

/**
 * Above main (`z-base` in layout) so hover/transform on cards does not paint over the bar.
 * Below drawer (`z-drawer-backdrop` / `z-drawer` in globals).
 */
export const navStickyContainerStyles =
  'sticky top-0 z-navigation mb-8 w-full bg-body text-typography shadow-elevated -mx-(--base-pad-x) w-[calc(100%+2*var(--base-pad-x))] px-(--base-pad-x)';

export default function Navigation() {
  return (
    <>
      <NavigationDesktop />
      <Suspense fallback={<InfoMessage type="loading" message="Loading navigation…" />}>
        <NavigationMobile />
      </Suspense>
    </>
  )
}