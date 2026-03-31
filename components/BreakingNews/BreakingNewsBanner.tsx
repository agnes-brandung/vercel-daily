import { InfoMessage } from '@/components/ui/InfoMessage';
import { Headline } from '@/ui/Typography';
import { Suspense } from 'react';
import { BreakingNews } from './BreakingNews';
import LoadingSkeleton from '../ui/LoadingSkeleton';

export function BreakingNewsBanner() {
  return (
    <section className="section-base-space">
      <header className="space-y-1">
        <Headline styleAs="h2" uppercase>
          Breaking news
        </Headline>
        <Headline styleAs="h5">Latest update from the newsroom</Headline>
      </header>

      <Suspense
        fallback={
          <InfoMessage type="loading" message="Loading breaking news…">
            <LoadingSkeleton type="excerpt" />
          </InfoMessage>}
        >
        <BreakingNews />
      </Suspense>
    </section>
  );
}
