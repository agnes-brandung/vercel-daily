import { Suspense } from 'react';
import NavigationDesktop from './Desktop';
import NavigationMobile from './Mobile';
import LoadingSkeleton from '../ui/LoadingSkeleton';
import { getSubscriptionStatus } from '@/lib/subscription';
import { SubscriptionButton } from '../Subscription/SubscriptionButton';

/**
 * Above main (`z-base` in layout) so hover/transform on cards does not paint over the bar.
 * Below drawer (`z-drawer-backdrop` / `z-drawer` in globals).
 *
 * Subscription UI: async server fetch + client `SubscriptionButton` is wrapped in Suspense here
 * and passed as `children` into nav shells (including client `NavigationMobile`). That composition
 * pattern keeps streaming boundaries at the server; see Suspense/streaming in Next.js docs.
 *
 * Sticky class string lives in `navStickyStyles.ts` so client `Mobile.tsx` never imports this file.
 * TODO: error in Article Page because of Mobile NavigationSubscriptionSlot
 */
export async function NavigationSubscriptionSlot() {
  const { isActive, hasToken } = await getSubscriptionStatus();

  return (
    <Suspense fallback={<LoadingSkeleton type="button" />}>
      <SubscriptionButton isActive={isActive} hasToken={hasToken} />
    </Suspense>
  );
}

export default function Navigation() {
  return (
    <>
      <NavigationDesktop>
        <NavigationSubscriptionSlot />
      </NavigationDesktop>
      <NavigationMobile>
        <NavigationSubscriptionSlot />
      </NavigationMobile>
    </>
  );
}