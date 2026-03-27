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
 * - still an issue with Route "/articles/[slug]": Runtime data such as `cookies()`, `headers()`, `params`, or `searchParams` was accessed outside of `<Suspense>`. This delays the entire page from rendering, resulting in a slow user experience. 
 * - fix suspense message or replace with loading... ?
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
    </article>
  );
}
