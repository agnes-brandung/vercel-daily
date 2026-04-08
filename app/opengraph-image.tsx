import {
  ogImageContentType,
  ogImageSize,
  siteOpenGraphImage,
} from '@/lib/og/siteOpenGraphImage';

export const alt =
  'The Vercel Daily — news and insights for modern web developers';

export const size = ogImageSize;

export const contentType = ogImageContentType;

export default async function Image() {
  return siteOpenGraphImage({
    eyebrow: 'The Vercel Daily',
    title: 'News and insights for modern web developers',
    subtitle: 'Changelogs, engineering deep-dives, customer stories, and community updates.',
  });
}
