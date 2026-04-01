import { InfoMessage } from '@/components/ui/InfoMessage';
import { Headline } from '@/ui/Typography';
import Button from '@/components/ui/Button';
import { ArrowRightIcon } from '@/components/ui/icons/arrow-right';
import { Suspense } from 'react';
import { FeaturedArticlesGrid } from './FeaturedArticlesGrid';
import LoadingSkeleton from '@/ui/LoadingSkeleton';

/**
 * TODO check if suspense is placed correctly
 * PPR: Place Suspense Close to Dynamic Content
 * PPR (Partial Prerendering) maximizes the static shell by placing Suspense boundaries close to dynamic content
 */
export function FeaturedArticles() {
  return (
    <section className="section-base-space">
      <header className="space-y-1">
        <Headline styleAs="h2" uppercase>
          Featured Articles
        </Headline>
        <Headline styleAs="h5">Handpicked stories from the team</Headline>
      </header>
      <Suspense fallback={
        <>
          <InfoMessage type="loading" message="Loading articles…">
            <LoadingSkeleton type="card" />
          </InfoMessage>
        </>
      }>
        <FeaturedArticlesGrid />
      </Suspense>
      <Button
        label="View all articles"
        href="/articles"
        icon={<ArrowRightIcon />}
      />
    </section>
  );
}
