import { ArticlesCatalog } from '@/components/Articles/ArticlesCatalog';
import { InfoMessage } from '@/components/ui/InfoMessage';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import { Suspense } from 'react';

/**
 * TODOS
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
    <Suspense fallback={
      <InfoMessage type="loading" message="Loading articles…">
        <LoadingSkeleton type="default" />
      </InfoMessage>
    }>
      <ArticlesCatalog />
    </Suspense>
  );
}