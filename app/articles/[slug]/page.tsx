import { Headline } from '@/ui/Typography';
import { connection } from 'next/server';

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  // TODO: do we need this?
  await connection();
  const { slug } = await params;
  const title = decodeURIComponent(slug).replace(/-/g, ' ');

  return (
    <article className="mx-auto max-w-3xl py-8">
      <Headline styleAs="h1">{title}</Headline>
    </article>
  );
}
