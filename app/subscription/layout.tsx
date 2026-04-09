import type { Metadata } from "next";

import { Copy, Headline } from '@/components/ui/Typography';
import { cn } from '@/utils/cn';
import { HeroGradient } from '@/components/ui/HeroGradient';

export const metadata: Metadata = {
  title: "Subscription - The Vercel Daily",
  description: "Subscribe to the Vercel Daily to get the latest news and insights for modern web developers.",
};

interface SubscriptionPerkProps {
  title: string;
  description: string;
  accentClassName: string;
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
    <div className="section-base-space">
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

          <ul className="staggered-card-list grid list-none gap-4 p-0 sm:grid-cols-3">
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
    </div>
  );
}
