import { Suspense } from 'react';
import NavigationDesktop from './Desktop';
import NavigationMobile from './Mobile/MobileNavigation';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import Subscription from '@/components/Subscription/Subscription';
import { NavigationSkeleton } from './Mobile/MobileNavigationSkeleton';

/**
 * SubscriptionButton: async server fetch + client `SubscriptionButton` is wrapped in Suspense here
 * and passed as `children` into mobile navigation (including client `NavigationMobile`). That composition
 * pattern keeps streaming boundaries at the server; see Suspense/streaming in Next.js docs.
 *
 * Sticky class string lives in `navStickyStyles.ts` so client `Mobile.tsx` never imports this file.
 */
export default function Navigation() {
  return (
    <>
      <NavigationDesktop>
        <Suspense fallback={<LoadingSkeleton type="button" />}>
          <Subscription />
        </Suspense>
      </NavigationDesktop>
      <Suspense fallback={<NavigationSkeleton />}>
        <NavigationMobile>
          <Subscription />
        </NavigationMobile>
      </Suspense>
    </>
  );
}