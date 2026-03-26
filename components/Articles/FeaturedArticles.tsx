import { InfoMessage } from '@/components/ui/InfoMessage';
import { Headline } from '@/ui/Typography';
import Button from '@/components/ui/Button';
import { ArrowRightIcon } from '@/components/ui/icons/arrow-right';
import { Suspense } from 'react';
import { FeaturedArticlesList } from './FeaturedArticlesList';

export function FeaturedArticles() {
  return (
    <section className="section-base-space">
      <header className="space-y-1">
        <Headline styleAs="h2">Featured Articles</Headline>
        <Headline styleAs="h5">Handpicked stories from the team</Headline>
      </header>
      <Suspense fallback={<InfoMessage type="loading" message="Loading articles…" />}>
        <FeaturedArticlesList />
      </Suspense>
      <Button
        label="View all articles"
        variant="primary"
        href="/"
        icon={<ArrowRightIcon />}
      />
    </section>
  );
}
