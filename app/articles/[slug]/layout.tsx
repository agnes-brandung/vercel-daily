import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Article Page - The Vercel Daily",
  description: "Read the latest articles from The Vercel Daily.",
};

export default function ArticleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <article className="mx-auto max-w-6xl py-block space-y-12">
      {children}
    </article>
  );
}
