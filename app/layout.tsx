import type { Metadata } from "next";
import "./globals.css";
import { fontPrimary, fontSecondary } from '../lib/fonts';
import { cn } from '@/utils/cn';
import Navigation from '@/components/Navigation/Navigation';
import Footer from '@/components/Footer';
import { ThemeProviders } from '@/components/Providers/ThemeProviders';
import { ogFallbackArticleImageSrc } from '@/lib/og/siteOpenGraphImage';

function metadataBaseUrl(): URL {
  const site = process.env.NEXT_PUBLIC_SITE_URL;
  if (site) {
    return new URL(site);
  }
  return new URL('http://localhost:3000');
}

export const metadata: Metadata = {
  metadataBase: metadataBaseUrl(),
  title: "The Vercel Daily",
  description: "News and insights for modern web developers.",
  openGraph: {
    siteName: 'The Vercel Daily',
    locale: 'en',
    type: 'website',
    images: [
      {
        url: ogFallbackArticleImageSrc,
        width: 1200,
        height: 630,
        alt: 'The Vercel Daily',
      },
    ],
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
            </main>
            <Footer />
          </div>
        </ThemeProviders>
      </body>
    </html>
  );
}
