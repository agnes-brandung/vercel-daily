import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { truncate } from '@/utils/truncate';

/** Matches Facebook / Open Graph recommended aspect ratio (see Next.js opengraph-image docs). */
export const ogImageSize = { width: 1200, height: 630 };

export const ogImageContentType = 'image/png';

const background = '#ffffff';
const textPrimary = '#263238';
const textMuted = '#757575';

// TODO: avoid duplications?
const CATEGORY_ACCENT: Record<ApiArticle['category'], string> = {
  changelog: '#0e7490',
  engineering: '#8e24aa',
  customers: '#2e7d32',
  'company-news': '#ad1457',
  community: '#5e35b1',
};

export function categoryAccentColor(category: ApiArticle['category']): string {
  return CATEGORY_ACCENT[category];
}

type SiteOpenGraphImageOptions = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  accentColor?: string;
}

export async function siteOpenGraphImage({
  eyebrow,
  title,
  subtitle,
  accentColor,
}: SiteOpenGraphImageOptions): Promise<ImageResponse> {
  const interBold = await readFile(join(process.cwd(), 'lib/fonts/Inter_18pt-Bold.ttf'));

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          backgroundColor: background,
          position: 'relative',
        }}
      >
        {accentColor ? (
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: 10,
              backgroundColor: accentColor,
            }}
          />
        ) : null}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '72px 80px',
            paddingLeft: accentColor ? 96 : 80,
            gap: 20,
            width: '100%',
            height: '100%',
          }}
        >
          <div
            style={{
              fontSize: 22,
              fontWeight: 600,
              color: textMuted,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              fontSize: 56,
              fontWeight: 600,
              color: textPrimary,
              lineHeight: 1.12,
              fontFamily: 'Inter',
            }}
          >
            {truncate(title, 120)}
          </div>
          {subtitle ? (
            <div
              style={{
                fontSize: 28,
                fontWeight: 600,
                color: textMuted,
                lineHeight: 1.35,
                maxWidth: 920,
                fontFamily: 'Inter',
              }}
            >
              {truncate(subtitle, 180)}
            </div>
          ) : null}
        </div>
      </div>
    ),
    {
      ...ogImageSize,
      fonts: [
        {
          name: 'Inter',
          data: interBold,
          style: 'normal',
          weight: 600,
        },
      ],
    },
  );
}
