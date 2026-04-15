import { InfoMessage } from '@/components/ui/InfoMessage';
import { Suspense } from 'react';
import LoadingSkeleton from '@/ui/LoadingSkeleton';
import { ArticleBody } from '@/components/Article/ArticleBody';
import { Metadata } from 'next';
import { getArticleMethods } from '@/lib/server-data/getArticlesMethods';
import { ogFallbackArticleImageSrc, ogImageSize } from '@/lib/og/siteOpenGraphImage';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/ui/Breadcrumb';
import { TrendingArticles } from '@/components/TrendingArticles/TrendingArticles';

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
      title: 'Error article Page',
      description: 'An error occurred while fetching the articles - Please try again later.',
    }  
  }
  const { allArticles } = articlesResult.data;

  const article = allArticles.find((a) => a.slug === slug);

  if (!article) {
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
    }
  }

  return {
    title: article.title,
    description: article.excerpt,
    keywords: article.tags.join(', '),
    authors: [{ name: article.author.name }],
    alternates: {
      canonical: `/${slug}`, // metadataBase resolves to absolute URL
    },
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
  console.log('slug in ArticlePageInner:', slug);

  // Simulate an error in DEV
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

  console.log('allArticles in ArticlePageInner:', allArticles);

  const article = allArticles.find((a) => a.slug === slug);

  console.log('article in ArticlePageInner:', article);

  if (!article) {
    console.log('article not found in ArticlePageInner:');
    // notFound();
    return <InfoMessage type="info" message="Article not found." />;
  }

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
