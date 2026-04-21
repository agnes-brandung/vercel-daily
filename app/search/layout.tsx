import type { Metadata } from "next";
import { Copy, Headline } from '@/components/ui/Typography';
import { getArticleMethods } from '@/lib/server-data/getArticles';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

/**
 * For Accessibility, we update the metadata for the Search page if an error occurs while fetching the articles.
 */
export async function generateMetadata(
): Promise<Metadata> {
  const allArticlesResult = await getArticleMethods();
  // Simulate an error
  // allArticlesResult.ok = false;

  if (!allArticlesResult.ok) {
    return {
      title: 'Error Search Page - The Vercel Daily',
      description: 'An error occurred while searching the articles - Please try again later.',
    }  
  }

  return {
    title: `Search through all Vercel Daily articles - The Vercel Daily`,
    description: "Find articles by keyword in Vercel Daily articles. Combine with one or more categories to narrow results.",
  }
}

export default async function SearchLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="section-base-space">
      <Breadcrumb items={[{ label: 'Home', href: '/' }]} current="Search" />
      <Headline styleAs="h1" uppercase>
        Search through all Vercel Daily articles
      </Headline>
      <Copy className="mb-6 max-w-prose">
        Find articles by keyword. Combine with one or more categories to narrow results.
      </Copy>
      {children}
    </section>
  );
}
