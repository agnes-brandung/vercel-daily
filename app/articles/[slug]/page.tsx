import { InfoMessage } from '@/components/ui/InfoMessage';
import { Suspense } from 'react';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import { ArticleBody } from '@/components/Article/ArticleBody';
import { Metadata } from 'next';
import { getArticleMethods } from '@/lib/server-data/getArticlesMethods';
import { ogFallbackArticleImageSrc, ogImageSize } from '@/lib/og/siteOpenGraphImage';
import { notFound } from 'next/navigation';

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
}

/**
 * For Accessibility, we update the metadata for the Article page if an error occurs while fetching the articles.
 */
export async function generateMetadata(
  { params }: ArticlePageProps,
): Promise<Metadata> {
  const { slug } = await params
  const articlesResult = await getArticleMethods();

  if (!articlesResult.ok) {
    return {
      title: 'Error article Page - The Vercel Daily',
      description: 'An error occurred while fetching the articles - Please try again later.',
    }  
  }
  const { allArticles } = articlesResult.data;

  const article = allArticles.find((a) => a.slug === slug);

  if (allArticles.length === 0 || !article) {
    return {
      title: 'Article not found - The Vercel Daily',
      description: 'Article not found.',
      openGraph: {
        images: [
          {
            url: ogFallbackArticleImageSrc,
            ...ogImageSize,
            alt: 'Article not found — The Vercel Daily',
          },
        ],
      },
    }
  }

  return {
    title: `${article.title} - The Vercel Daily`,
    description: article.excerpt,
    openGraph: {
      images: [
        {
          url: article.image,
          ...ogImageSize,
          alt: article.title,
        },
      ],
    },
  }
}
 
export default function ArticlePage({ params }: ArticlePageProps) {
  return (
    <Suspense fallback={
      <InfoMessage type="loading" message="Loading article…">
        <LoadingSkeleton type="article" />
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
  const articlesResult = await getArticleMethods();
  if (!articlesResult.ok) {
    return <InfoMessage type="error" message="An error occurred while fetching the articles - Please try again later." />;
  }
  const { allArticles } = articlesResult.data;

  if (allArticles.length === 0) {
    return (
      <InfoMessage type="info" message="No articles available yet." />
    );
  }

  const article = allArticles.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  return <ArticleBody article={article} />;
}
