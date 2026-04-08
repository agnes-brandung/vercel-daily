import {
  ogImageContentType,
  ogImageSize,
  siteOpenGraphImage,
} from '@/lib/og/siteOpenGraphImage';

export const alt = 'Search articles — The Vercel Daily';

export const size = ogImageSize;

export const contentType = ogImageContentType;

export default async function Image() {
  return siteOpenGraphImage({
    eyebrow: 'The Vercel Daily',
    title: 'Search',
    subtitle: 'Find articles by keyword. Combine with categories to narrow results.',
    accentColor: '#5e35b1',
  });
}
