import { notFound } from 'next/navigation';

import { getArticleMethods } from '@/lib/server-data/getArticlesMethods';
import {
  ogImageContentType,
  ogImageSize,
  siteOpenGraphImage,
} from '@/lib/og/siteOpenGraphImage';
import { CATEGORY_COLOR_MAP } from '@/utils/mapCategoryColor';

export const alt = 'Article on The Vercel Daily';

export const size = ogImageSize;

export const contentType = ogImageContentType;

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
    accentColor: CATEGORY_COLOR_MAP[article.category],
  });
}
