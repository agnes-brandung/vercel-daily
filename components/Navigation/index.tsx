import NavigationDesktop from './Desktop';
import NavigationMobile from './Mobile';

/**
 * Above main (`z-0` in layout) so hover/transform on cards does not paint over the bar.
 * Below drawer (`z-drawer-backdrop` / `z-drawer` in globals).
 */
export const navStickyContainerStyles =
  'sticky top-0 mb-8 w-full bg-body text-typography shadow-nav -mx-(--base-pad-x) w-[calc(100%+2*var(--base-pad-x))] px-(--base-pad-x)';

export default function Navigation() {
  return (
    <>
      <NavigationDesktop />
      <NavigationMobile />
    </>
  )
}