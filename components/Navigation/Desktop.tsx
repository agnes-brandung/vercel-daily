import { TextLink } from "@/ui/Typography";
import { BrandLink, HomeIconLink } from './NavigationLinks';
import { navStickyContainerStyles } from './navStickyStyles';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

const navContainerStyles = "py-6 hidden lg:block";
const innerContainerStyles = "mx-auto flex h-full w-full max-w-full items-center justify-between gap-4";

export default function NavigationDesktop({ children }: { children: ReactNode }) {
  return (
    <nav className={cn(navStickyContainerStyles, navContainerStyles)} aria-labelledby="navigation">
      <div className={innerContainerStyles}>
        <HomeIconLink />

        <BrandLink />

        <ul role="list" className="flex list-none items-center gap-6">
          <li>
            {children}
          </li>
          <li>
            <TextLink href="/search">Search</TextLink>
          </li>
          <li>
            <TextLink href="/subscription">Subscription</TextLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}
