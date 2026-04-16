import { InfoMessage } from '@/components/ui/InfoMessage';
import { Suspense } from 'react';
import LoadingSkeleton from '@/ui/LoadingSkeleton';
import { ArticleBody } from '@/components/Article/ArticleBody';
import { Metadata } from 'next';
import { getArticle } from '@/lib/server-data/getArticle';
import { ogFallbackArticleImageSrc, ogImageSize } from '@/lib/og/siteOpenGraphImage';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/ui/Breadcrumb';
import { TrendingArticles } from '@/components/TrendingArticles/TrendingArticles';

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

/**
 * For accessibility and SEO, metadata reflects fetch outcome (error / not found / article).
 */
export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const articleResult = await getArticle(slug);

  if (!articleResult.ok) {
    if (articleResult.kind === 'not_found') {
      return {
        title: 'Article not found',
        description: 'Article not found.',
        openGraph: {
          images: [
            {
              url: ogFallbackArticleImageSrc,
              ...ogImageSize,
              alt: 'Article not found',
              type: 'article',
            },
          ],
        },
      };
    }
    return {
      title: 'Error article page',
      description: 'An error occurred while fetching the article — Please try again later.',
    };
  }

  const article = articleResult.data;

  return {
    title: article.title,
    description: article.excerpt,
    keywords: article.tags.join(', '),
    authors: [{ name: article.author.name }],
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [
        {
          url: article.image,
          ...ogImageSize,
          alt: article.title,
        },
      ],
      type: 'article',
      authors: [article.author.name],
    },
  };
}

export default function ArticlePage({ params }: ArticlePageProps) {
  return (
    <Suspense
      fallback={
        <InfoMessage type="loading" message="Loading article…">
          <LoadingSkeleton type="article" />
        </InfoMessage>
      }
    >
      <ArticlePageInner params={params} />
    </Suspense>
  );
}

async function ArticlePageInner({ params }: ArticlePageProps) {
  const { slug } = await params;

  const articleResult = await getArticle(slug);

  if (!articleResult.ok) {
    if (articleResult.kind === 'not_found') {
      notFound();
    }
    return (
      <InfoMessage
        type="error"
        message="An error occurred while fetching the article — Please try again later."
      />
    );
  }

  const article = articleResult.data;

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Articles', href: '/articles' },
  ];

  return (
    <>
      <Breadcrumb items={breadcrumbItems} current={article.title} />
      <ArticleBody article={article} />
      <TrendingArticles excludeArticleId={article.id} />
    </>
  );
}
