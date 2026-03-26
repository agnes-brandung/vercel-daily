import { InfoMessage } from '@/components/ui/InfoMessage';
import { Headline } from '@/ui/Typography';
import Button from '@/components/ui/Button';
import { ArrowRightIcon } from '@/components/ui/icons/arrow-right';
import { Suspense } from 'react';
import { FeaturedArticlesList } from './FeaturedArticlesList';
import LoadingSkeleton from '@/ui/LoadingSkeleton';

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
            <LoadingSkeleton />
          </InfoMessage>
        </>
      }>
        <FeaturedArticlesList />
      </Suspense>
      <Button
        label="View all articles"
        variant="primary"
        href="/articles"
        icon={<ArrowRightIcon />}
      />
    </section>
  );
}
