import NavigationDesktop from './Desktop';
import NavigationMobile from './Mobile';

export const navStickyContainerStyles = "sticky top-0 mb-8 z-navigation bg-body text-typography shadow-nav w-full -mx-(--base-pad-x) w-[calc(100%+2*var(--base-pad-x))] px-(--base-pad-x)";

export default function Navigation() {
  return (
    <>
      <NavigationDesktop />
      <NavigationMobile />
    </>
  )
}