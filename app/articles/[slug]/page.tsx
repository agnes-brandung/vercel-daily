import PublishedDate from '@/components/PublishedDate';
import { getArticles } from '@/components/Articles/getArticles';
import { InfoMessage } from '@/components/ui/InfoMessage';
import { categoryLabelClassName } from '@/utils/mapCategoryColor';
import { Copy, Headline } from '@/ui/Typography';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

// TODO: PLACEHOLDER FOR NOW
/**
 * TODOS
 * - Article Header	The article headline, author name, publish date, and category.
 * - Featured Image	A large hero image for the article.
 * - Article Content	The full article body text.
 * - Trending Articles	A section displaying 3-4 trending articles fetched dynamically from the provided API.
 * - Subscribe CTA	If the user is not subscribed, display a call-to-action to subscribe.

 * Route params and data loading run inside this async child so they stay within `<Suspense>`
 * and do not block the shell from streaming (see Next.js “blocking route” guidance).
 */
async function ArticleBody({ params }: ArticlePageProps) {
  const { slug } = await params;
  const data = await getArticles();

  if (!data.ok) {
    return <InfoMessage type="error" message={data.error} />;
  }

  const article = data.allArticles.find((a) => a.slug === slug);
  if (!article) {
    notFound();
  }

  return (
    <>
      <Headline styleAs="category" className={categoryLabelClassName(article.category)}>
        {article.category.replace(/-/g, ' ')}
      </Headline>
      <Headline styleAs="h1" className="mt-2 text-balance">
        {article.title}
      </Headline>
      <Suspense fallback={<Copy size="sm" color="lightGray">Loading date…</Copy>}>
        <PublishedDate date={article.publishedAt} />
      </Suspense>
      {article.excerpt?.trim() ? (
        <Copy color="gray" className="mt-6">
          {article.excerpt}
        </Copy>
      ) : null}
      {article.content?.text?.trim() ? (
        <Copy className="mt-4 max-w-prose whitespace-pre-wrap">{article.content.text}</Copy>
      ) : null}
    </>
  );
}

export default function ArticlePage({ params }: ArticlePageProps) {
  return (
    <article className="mx-auto max-w-3xl py-8">
      <Suspense fallback={<InfoMessage type="loading" message="Loading article…" />}>
        <ArticleBody params={params} />
      </Suspense>
    </article>
  );
}
