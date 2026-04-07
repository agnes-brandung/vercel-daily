import ArticleError from '@/components/Article/ArticleError';
import { TrendingArticles } from '@/components/TrendingArticles/TrendingArticles';

/** Shown when `notFound()` is called from the article route (unknown slug). */
export default function ArticleNotFound() {
  return (
    <> 
      <ArticleError
        headline="404"
        subline="Article not found"
        description="We couldn't find an article at this address. It may have been moved or removed."
      />
     <TrendingArticles />
    </>
  );
}
