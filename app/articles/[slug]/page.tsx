import { InfoMessage } from '@/components/ui/InfoMessage';
import { Suspense } from 'react';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import { ArticleBody } from '@/components/Article/ArticleBody';

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
}

/**
 * 
 * TODOS:
 * - fix suspense message or replace with loading... ?
 * - Subscribe button in the navigation instead of the article page - add it in a layout specific for here?
 */

// TODO: do we really need this Inner??
export default function ArticlePage({ params }: ArticlePageProps) {
  return (
    <article className="mx-auto max-w-6xl py-block space-y-12">
      <Suspense fallback={
        <InfoMessage type="loading" message="Loading article…">
          <LoadingSkeleton />
        </InfoMessage>
      }>
        <ArticlePageInner params={params} />
      </Suspense>
    </article>
  );
}

async function ArticlePageInner({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ArticleBody slug={slug} />;
}
