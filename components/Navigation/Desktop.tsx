import { TextLink } from "@/ui/Typography";
import { BrandLink, HomeIconLink } from './NavigationLinks';
import { navStickyContainerStyles } from './index';
import { cn } from '@/lib/utils';
// import { SubscriptionButton } from '../Subscription/SubscriptionButton';

const navContainerStyles = "py-6 hidden lg:block";

/**
 * Navigation in ul list since best practice for accessibility and screen readers (clear structure)
 */
export default function NavigationDesktop({ isActive, hasToken }: { isActive: boolean; hasToken: boolean }) {
  return (
    <nav className={cn(navStickyContainerStyles, navContainerStyles)}>
      <div className="mx-auto flex h-full max-w-full items-center justify-between">
        <ul className="flex w-full list-none items-center justify-between">
          <li>
            <HomeIconLink />
          </li>
          <li>
            <BrandLink />
          </li>
          {/* <li>
            <SubscriptionButton isActive={isActive} hasToken={hasToken} />
          </li> */}
          <li>
            <TextLink href="/search">Search</TextLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}
