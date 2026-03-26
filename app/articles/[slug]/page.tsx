import { InfoMessage } from '@/components/ui/InfoMessage';
import { Headline } from '@/ui/Typography';
import { Suspense } from 'react';

// type ArticlePageProps = {
//   params: Promise<{ slug: string }>;
// }

// TODO: PLACEHOLDER FOR NOW 
export default async function ArticlePage(/*{ params }: ArticlePageProps*/) {
  // // TODO: do we need this?
  // const { slug } = await params;
  // const title = decodeURIComponent(slug).replace(/-/g, ' ');

  return (
    <article className="mx-auto max-w-3xl py-8">
      <Suspense fallback={<InfoMessage type="loading" message="Loading article…" />}>
        <Headline styleAs="h1">Article Title</Headline>
      </Suspense>
    </article>
  );
}
