import type { Metadata } from "next";
import { Copy, Headline } from '@/components/ui/Typography';

export const metadata: Metadata = {
  title: "Search - The Vercel Daily",
  description: "Find articles by keyword in Vercel Daily articles. Combine with one or more categories to narrow results.",
};

export default function SearchLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="section-base-space">
      <Headline styleAs="h1" uppercase>
        Search
      </Headline>
      <Copy className="mb-6 max-w-prose">
        Find articles by keyword. Combine with one or more categories to narrow results.
      </Copy>
      {children}
    </div>
  );
}
