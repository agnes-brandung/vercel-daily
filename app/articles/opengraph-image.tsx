import {
  ogImageContentType,
  ogImageSize,
  siteOpenGraphImage,
} from '@/lib/og/siteOpenGraphImage';

export const alt = 'Articles catalog — The Vercel Daily';

export const size = ogImageSize;

export const contentType = ogImageContentType;

export default async function Image() {
  return siteOpenGraphImage({
    eyebrow: 'The Vercel Daily',
    title: 'All developer news under one roof',
    subtitle:
      'Changelogs, engineering deep-dives, customer stories and community updates — all in one place.',
    accentColor: '#1a237e',
  });
}
