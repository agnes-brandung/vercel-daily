import { TextLink } from "@/ui/Typography";
import { BrandLink, HomeIconLink } from './NavigationLinks';
import { navStickyContainerStyles } from './Navigation';
import { cn } from '@/lib/utils';
import LoadingSkeleton from '@/ui/LoadingSkeleton';
import { Suspense } from 'react';
import { SubscriptionButton } from '@/components/Subscription/SubscriptionButton';

const navContainerStyles = "py-6 hidden lg:block";
const innerContainerStyles = "mx-auto flex h-full w-full max-w-full items-center justify-between gap-4";

export default function NavigationDesktop({ isActive, hasToken }: { isActive: boolean; hasToken: boolean }) {
  return (
    <nav className={cn(navStickyContainerStyles, navContainerStyles)} aria-label="Main">
      <div className={innerContainerStyles}>
        <HomeIconLink />

        <BrandLink />

        <ul className="flex list-none items-center gap-6">
          <li>
            <Suspense fallback={<LoadingSkeleton type="button" />}>
              <SubscriptionButton isActive={isActive} hasToken={hasToken} />
            </Suspense>
          </li>
          <li>
            <TextLink href="/search">Search</TextLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}
