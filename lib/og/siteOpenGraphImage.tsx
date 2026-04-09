import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { truncate } from '@/utils/truncate';

/** Matches Facebook / Open Graph recommended aspect ratio (see Next.js opengraph-image docs). */
export const ogImageSize = { width: 1200, height: 630 };

export const ogImageContentType = 'image/png';

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
          backgroundColor: 'var(--background)',
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
              color: 'var(--text-muted)',
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
              color: 'var(--text-primary)',
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
                color: 'var(--text-muted)',
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
