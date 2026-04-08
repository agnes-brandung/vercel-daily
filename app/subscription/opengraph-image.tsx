import {
  ogImageContentType,
  ogImageSize,
  siteOpenGraphImage,
} from '@/lib/og/siteOpenGraphImage';

export const alt = 'Subscribe — The Vercel Daily';

export const size = ogImageSize;

export const contentType = ogImageContentType;

export default async function Image() {
  return siteOpenGraphImage({
    eyebrow: 'The Vercel Daily',
    title: 'Subscribe for full access',
    subtitle:
      'Platform updates, engineering stories, and ideas you can ship on your next deploy — free.',
    accentColor: '#2e7d32',
  });
}
