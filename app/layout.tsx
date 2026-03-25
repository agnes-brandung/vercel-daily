import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Suspense } from "react";
import "./globals.css";
import { fontPrimary, fontSecondary } from '../lib/fonts';
import { cn } from '@/utils/cn';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: "The Vercel Daily",
  description: "News and insights for modern web developers.",
};


// TODO: suspense for navigation and children??
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
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex min-h-dvh flex-col p-base">
            <Suspense fallback={<div className="mb-8 h-20 shrink-0" aria-hidden />}>
              <Navigation />
            </Suspense>
            <main className="flex flex-1 flex-col bg-body text-typography">
              <Suspense>{children}</Suspense>
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
