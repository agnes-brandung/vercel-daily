import { Suspense } from 'react';

import { Headline } from '@/ui/Typography';
import { InfoMessage } from '@/ui/InfoMessage';
import { TrendingArticlesList } from './TrendingArticlesList';
import LoadingSkeleton from '@/ui/LoadingSkeleton';

export function TrendingArticles({ excludeArticleId }: { excludeArticleId: ApiArticle['id'] }) {
  return (
    <div className="border-t border-border/50">
      <section aria-labelledby="trending-articles-heading" className="space-y-6">
        <Headline
          id="trending-articles-heading"
          type="h2"
          styleAs="h4"
          uppercase
          className="mt-4 w-full max-w-none text-balance"
        >
          Trending now
        </Headline>
        <Suspense fallback={
            <>
              <InfoMessage type="loading" message="Loading trending articles…">
                <LoadingSkeleton type="card" />
              </InfoMessage>
            </>
          }>
          <TrendingArticlesList excludeArticleId={excludeArticleId} />
        </Suspense>
      </section>
    </div>
  );
}
