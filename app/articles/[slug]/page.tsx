import { InfoMessage } from '@/components/ui/InfoMessage';
import { Suspense } from 'react';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import { ArticleBody } from '@/components/Article/ArticleBody';

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
}

export default function ArticlePage({ params }: ArticlePageProps) {
  return (
    <Suspense fallback={
      <InfoMessage type="loading" message="Loading article…">
        <LoadingSkeleton />
      </InfoMessage>
    }>
      <ArticlePageInner params={params} />
    </Suspense>
  );
}

async function ArticlePageInner({ params }: ArticlePageProps) {
  const { slug } = await params;
  // Simulate an error
  // throw new Error('Simulated error');
  return <ArticleBody slug={slug} />;
}
