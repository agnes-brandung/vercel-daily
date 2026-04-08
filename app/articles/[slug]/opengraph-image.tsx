import { notFound } from 'next/navigation';

import { getArticleMethods } from '@/app/api/getArticlesMethods';
import {
  categoryAccentColor,
  ogImageContentType,
  ogImageSize,
  siteOpenGraphImage,
} from '@/lib/og/siteOpenGraphImage';

export const alt = 'Article on The Vercel Daily';

export const size = ogImageSize;

export const contentType = ogImageContentType;

// TODO: check if we should fetch here or pass it from the page component?
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await getArticleMethods();

  if (!result.ok) {
    return siteOpenGraphImage({
      eyebrow: 'The Vercel Daily',
      title: 'Read the latest developer news',
      subtitle: 'Preview unavailable — open the article to read.',
    });
  }

  const article = result.data.allArticles.find((a) => a.slug === slug);
  if (!article) {
    notFound();
  }

  return siteOpenGraphImage({
    eyebrow: article.categoryLabel,
    title: article.title,
    subtitle: article.excerpt,
    accentColor: categoryAccentColor(article.category),
  });
}
