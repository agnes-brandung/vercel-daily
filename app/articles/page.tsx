import { ArticlesCatalog } from '@/components/Articles/ArticlesCatalog';
import { InfoMessage } from '@/components/ui/InfoMessage';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import { Headline } from '@/components/ui/Typography';
import { Suspense } from 'react';

/**
 * TODOS
 * - CTA "Subscribe" for non subscribed users: logic isSubscribed
 * - Use Promise.all to load the articles and the trending articles in parallel?
 * - For Catalog: add image as thumbnail
 * - Avoid Spinner Soup
 * Too many nested Suspense boundaries create confusing loading states. Keep boundaries shallow and strategic:
 * ✅ 2-3 boundaries for independent slow sections
 * ❌ Suspense around every component - creates "spinner soup"
 * ✅ Fallbacks match content shape (skeleton loaders)
 * ❌ Generic spinners everywhere
 */
export default function ArticlesPage() {
  return (
    <section className="section-base-space">
      <header className="space-y-1">
        <Headline styleAs="h1">All developer news under one roof</Headline>
        <Headline styleAs="h4">
          Changelogs, engineering deep-dives, customer stories and community updates - all in one
          place.
        </Headline>      
      </header>
      <Suspense fallback={
        <>
          <InfoMessage type="loading" message="Loading articles…">
            <LoadingSkeleton />
          </InfoMessage>
        </>
      }>
        <ArticlesCatalog />
      </Suspense>
    </section>
  );
}