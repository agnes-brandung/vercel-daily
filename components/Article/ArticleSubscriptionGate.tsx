import Button from '@/components/ui/Button';
import { cn } from '@/utils/cn';
import { Copy, TextLink } from '@/ui/Typography';

interface ArticleSubscriptionGateProps {
  isSubscribed: boolean;
  children: React.ReactNode;
}

const subscriptionGateBgStyles = 'relative max-h-[min(28rem,55vh)] overflow-hidden rounded-sm';
const subscriptionGateGradientBgStyles = 'after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:z-raised after:h-[min(11rem,45%)] after:bg-linear-to-t after:from-body after:via-[color-mix(in_srgb,var(--body)_88%,transparent)] after:to-transparent';

// TODO: improve this and use our designs!
/**
 * When `isSubscribed` is false, shows a preview of article body with a gradient + CTA overlay.
 * When true, renders children unchanged.
 */
export function ArticleSubscriptionGate({ isSubscribed, children }: ArticleSubscriptionGateProps) {
  if (isSubscribed) {
    return children;
  }

  return (
    <div className="relative">
      <div className={cn(subscriptionGateBgStyles, subscriptionGateGradientBgStyles)}>
        <div className="pointer-events-none select-none opacity-92 filter-blur-0.45">{children}</div>
      </div>
      <div className="relative z-overlay -mt-2 flex flex-col items-center gap-3 px-4 pt-6 sm:px-6">
        <Copy size="lg" weight="bold" color="yellow" className="uppercase">Subscribe to read more</Copy>
        <Button label="Subscribe" href="/subscription" />
        <TextLink
          href="/subscription"
          className="text-sm text-light-gray"
        >
          View subscription options
        </TextLink>
      </div>
    </div>
  );
}
