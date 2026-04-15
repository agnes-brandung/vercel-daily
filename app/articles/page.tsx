import { ArticlesCatalog } from '@/components/Articles/ArticlesCatalog';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { InfoMessage } from '@/components/ui/InfoMessage';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import { ogFallbackArticleImageSrc, ogImageSize } from '@/lib/og/siteOpenGraphImage';
import { getArticleMethods } from '@/lib/server-data/getArticlesMethods';
import { Metadata } from 'next';
import { Suspense } from 'react';

/**
 * For Accessibility, we update the metadata for the Articles Catalog page if an error occurs while fetching the articles.
 */
export async function generateMetadata(
): Promise<Metadata> {
  const allArticles = await getArticleMethods();

  const metadataTitle = "All developer news under one roof";
  const vercelImage = {
    url: ogFallbackArticleImageSrc,
    ...ogImageSize,
    alt: 'Articles Catalog - The Vercel Daily',
  }
  
  if (!allArticles.ok) {
    return {
      title: metadataTitle,
      description: "An error occurred while fetching the articles - Please try again later.",
      openGraph: {
        images: [
          vercelImage,
        ],
      },
    }
  }

  const { articlesByCategory, mostRecentArticles } = allArticles.data;

  if (articlesByCategory.length === 0 && mostRecentArticles.length === 0) {
    return {
      title: metadataTitle,
      description: "No articles available yet.",
      openGraph: {
        images: [
          vercelImage,
        ],
      },
    }
  }

  const firstArticle = articlesByCategory.length > 0 ? articlesByCategory[0].articles[0] : mostRecentArticles[0];

  return {
    title: metadataTitle,
    description: "Articles Catalog - The Vercel Daily",
    openGraph: {
      images: [
        {
          url: firstArticle.image,
          ...ogImageSize,
          alt: "Articles Catalog - The Vercel Daily",
          type: 'article',
        },
      ],
    },
  }
}

export default function ArticlesPage() {
  return (
    <>  
      <Breadcrumb items={[{ label: 'Home', href: '/' }]} current="Articles" />
      <Suspense fallback={
        <InfoMessage type="loading" message="Loading articles…">
          <LoadingSkeleton type="list" />
        </InfoMessage>
      }>
        <ArticlesCatalog />
      </Suspense>
    </>
  );
}