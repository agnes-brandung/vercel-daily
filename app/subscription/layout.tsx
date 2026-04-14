import type { Metadata } from "next";

import { Copy, Headline } from '@/components/ui/Typography';
import { cn } from '@/utils/cn';
import { HeroGradient } from '@/components/ui/HeroGradient';
import { getSubscriptionStatus } from '@/lib/server-data/getSubscriptionStatus';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

type SubscriptionPerkProps = {
  title: string;
  description: string;
  accentClassName?: string;
}

/**
 * For Accessibility, we update the metadata for the Subscription page if an error occurs while fetching the subscription.
 */
export async function generateMetadata(
): Promise<Metadata> {
  const { error } = await getSubscriptionStatus();
  
  if (error) {
    return {
      title: 'Error Subscription Page - The Vercel Daily',
      description: 'An error occurred while fetching your subscription status - Please try again later.',
    }  
  }

  return {
    title: 'Subscribe to the Vercel Daily',
    description: "Full access at no cost—platform updates, engineering stories, and ideas you can ship on your next deploy.",
  }
}

function SubscriptionPerk({ title, description, accentClassName }: SubscriptionPerkProps) {
  return (
    <li
      className={cn(
        'staggered-card-alive surface-elevated flex flex-col gap-2 border-l-4 p-4 text-left shadow-none',
        accentClassName,
      )}
    >
      <Headline styleAs="h5" className="text-gray">
        {title}
      </Headline>
      <Copy size="sm" color="gray" className="leading-snug">
        {description}
      </Copy>
    </li>
  );
}

export default function SubscriptionLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <section role="region" aria-label="Subscription perks with The Vercel Daily" className="section-base-space">
      <Breadcrumb items={[{ label: 'Home', href: '/' }]} current="Subscription" />
      <HeroGradient>
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
          <Headline styleAs="category" className="text-emerald mb-0">
            Free forever
          </Headline>
          <span className="hidden text-light-gray sm:inline" aria-hidden>
            ·
          </span>
          <Headline styleAs="category" className="mb-0 text-light-gray">
            No credit card
          </Headline>
        </div>

        <div className="space-y-3">
          <Headline styleAs="h1">Subscribe to the Vercel Daily</Headline>
          <Headline styleAs="h4" className="max-w-2xl text-pretty">
            Full access at no cost—platform updates, engineering stories, and ideas you can ship on your next deploy.
          </Headline>
        </div>

        <ul role="list" className="staggered-card-list grid list-none gap-4 p-0 sm:grid-cols-3">
          <SubscriptionPerk
            accentClassName="border-l-cyan"
            title="Everything unlocked"
            description="Read the full archive: changelogs, deep dives, and customer stories in one place."
          />
          <SubscriptionPerk
            accentClassName="border-l-magenta"
            title="Stay ahead"
            description="Support independent coverage and keep your team aligned as the Vercel ecosystem evolves."
          />
          <SubscriptionPerk
            accentClassName="border-l-violet"
            title="On your terms"
            description="Takes a moment to start, and you can cancel your subscription whenever you like."
          />
        </ul>

        <div className="flex flex-col items-center">{children}</div>
      </HeroGradient>
    </section>
  );
}
