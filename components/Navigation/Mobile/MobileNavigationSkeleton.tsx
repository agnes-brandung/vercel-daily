import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import { navStickyContainerStyles } from '../navStickyStyles';
import { cn } from '@/lib/utils';
import { BrandLink, HomeIconLink } from '../NavigationLinks';

export function MobileNavigationSkeleton() {
  return (
    <div className={cn(navStickyContainerStyles, "flex items-center justify-between py-6")}>
      <HomeIconLink />
      <BrandLink size="2xl" />
      <LoadingSkeleton type="icon-button" />
    </div>
  );
}