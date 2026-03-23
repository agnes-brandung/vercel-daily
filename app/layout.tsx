import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { fontPrimary, fontSecondary } from './fonts';
import { cn } from '@/utils/cn';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: "The Daily Delivery",
  description: "Professional and neutral news website delivering proven and reliable reports from around the globe.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(fontPrimary.variable, fontSecondary.variable, 'h-full antialiased')}
      suppressHydrationWarning
    >
      <body className="flex min-h-dvh flex-col p-base">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navigation />
          <main className="bg-body text-typography flex flex-1 flex-col">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
