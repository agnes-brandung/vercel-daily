import type { Metadata } from "next";
import "./globals.css";
import { fontPrimary, fontSecondary } from '../lib/fonts';
import { cn } from '@/utils/cn';
import Navigation from '@/components/Navigation/Navigation';
import Footer from '@/components/Footer';
import { ThemeProviders } from '@/components/Providers/ThemeProviders';
import { ScrollRestoration } from '@/components/ScrollRestoration';
import { Suspense } from 'react';

function metadataBaseUrl(): URL {
  const publicUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (publicUrl) {
    return new URL(publicUrl);
  }

  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) {
    return new URL(`https://${vercelUrl}`);
  }

  return new URL('http://localhost:3000');
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
    locale: 'en',
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
      data-scroll-behavior="smooth"
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
