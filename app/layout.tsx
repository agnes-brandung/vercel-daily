import type { Metadata } from "next";
import "./globals.css";
import { fontPrimary, fontSecondary } from '../lib/fonts';
import { cn } from '@/utils/cn';
import Navigation from '@/components/Navigation/Navigation';
import Footer from '@/components/Footer';
import { ThemeProviders } from '@/components/Providers/ThemeProviders';
// import { ogFallbackArticleImageSrc } from '@/lib/og/siteOpenGraphImage';
import { ScrollRestoration } from '@/components/ScrollRestoration';
import { Suspense } from 'react';

function metadataBaseUrl(): URL {
  return new URL(
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000'
  );
}

export const metadata: Metadata = {
  metadataBase: metadataBaseUrl(),
  title: {
    template: '%s | The Vercel Daily',
    default: 'The Vercel Daily - Website',
  },
  description: 'News and insights for modern web developers.',
  openGraph: {
    siteName: 'The Vercel Daily',
    locale: 'en_GB',
    type: 'website',
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(fontPrimary.variable, fontSecondary.variable, 'h-full antialiased', "font-sans")}
      suppressHydrationWarning
    >
      <body className="flex min-h-dvh flex-col">
        <ThemeProviders>
          <div className="flex min-h-dvh flex-col p-base">
            <Navigation />
            <main className="relative z-base flex flex-1 flex-col bg-body text-typography">
              {children}
              <Suspense fallback={null}>
                <ScrollRestoration />
              </Suspense>
            </main>
            <Footer />
          </div>
        </ThemeProviders>
      </body>
    </html>
  );
}
