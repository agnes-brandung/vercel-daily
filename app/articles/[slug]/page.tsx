import { InfoMessage } from '@/components/ui/InfoMessage';
import { Suspense } from 'react';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import { ArticleBody } from '@/components/Article/ArticleBody';
import Button from '@/components/ui/Button';
import { ArrowRightIcon } from '@/components/ui/icons/arrow-right';

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
}

/**
 * 
 * TODOS:
 * - fix suspense message or replace with loading... ?
 * - Subscribe button logic
 * - Subscribe button in the navigation instead of the article page - add it in a layout specific for here?
 */
export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;

  return (
    <article className="mx-auto max-w-6xl py-block space-y-12">
      <Suspense fallback={
        <InfoMessage type="loading" message="Loading article…">
          <LoadingSkeleton />
        </InfoMessage>
      }>
        <ArticleBody slug={slug} />
      </Suspense>
      <Button
        label="Subscribe"
        variant="primary"
        href="/subscription"
        icon={<ArrowRightIcon />}
      />
    </article>
  );
}
