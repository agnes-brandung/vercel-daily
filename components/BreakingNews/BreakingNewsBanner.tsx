import { InfoMessage } from '@/components/ui/InfoMessage';
import { Headline } from '@/ui/Typography';
import { Suspense } from 'react';
import { BreakingNews } from './BreakingNews';

export function BreakingNewsBanner() {
  return (
    <section className="section-base-space">
      <header className="space-y-1">
        <Headline styleAs="h2">Breaking news</Headline>
        <Headline styleAs="h5">Latest update from the newsroom</Headline>
      </header>

      <Suspense
        fallback={<InfoMessage type="loading" message="Loading breaking news…" />}
      >
        <BreakingNews />
      </Suspense>
    </section>
  );
}
