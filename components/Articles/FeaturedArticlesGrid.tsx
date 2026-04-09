import { InfoMessage } from '@/components/ui/InfoMessage';
import { getArticleMethods } from '@/lib/server-data/getArticlesMethods';
import { ArticlesGrid } from './ArticlesGrid';

export async function FeaturedArticlesGrid() {
  const articlesResult = await getArticleMethods();
  if (!articlesResult.ok) {
    return <InfoMessage type="error" message="An error occurred while fetching the featured articles - try again later." />;
  }
  const { featuredArticles } = articlesResult.data;

  if (featuredArticles.length === 0) {
    return <InfoMessage type="info" message="No featured articles available yet." />;
  }

  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <ArticlesGrid articles={featuredArticles} />
    </ul>
  );
}
