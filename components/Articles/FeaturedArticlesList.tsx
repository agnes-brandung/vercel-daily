import { InfoMessage } from '@/components/ui/InfoMessage';
import { Copy, Headline } from '@/ui/Typography';
import { cn } from '@/utils/cn';
import Link from 'next/link';

import { getArticles } from './getArticles';
import { categoryCardBorderClassName, categoryLabelClassName } from '@/utils/mapCategoryColor';
import PublishedDate from '@/components/PublishedDate';
import { Suspense } from 'react';

/** Featured first, then others, up to 6 (or fewer if the API returns less). */
function pickGridArticles(all: ApiArticle[]): ApiArticle[] {
  const featured = all.filter((a) => a.featured);
  if (featured.length >= 6) return featured.slice(0, 6);
  const rest = all.filter((a) => !a.featured);
  return [...featured, ...rest].slice(0, Math.min(6, all.length));
}

export async function FeaturedArticlesList() {
  const data = await getArticles();

  if (!data.ok) {
    return <InfoMessage type="error" message={data.error} />;
  }

  const articles = pickGridArticles(data.allArticles);

  if (articles.length === 0) {
    return <InfoMessage type="info" message="No articles available yet." />;
  }

  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <li key={article.id}>
          <Link
            href={`/articles/${article.slug}`}
            className={cn(
              'group block overflow-hidden rounded-lg border border-border bg-card text-typography shadow-elevated transition-[border-color,box-shadow] focus-visible:outline-none focus-visible:ring-2',
              categoryCardBorderClassName(article.category),
            )}
          >
            <div className="aspect-16/10 bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element -- external URLs; skip Image remotePatterns */}
              <img
                src={article.image}
                alt={article.title}
                className="h-full w-full object-cover transition-transform md:group-hover:scale-[1.02]"
              />
            </div>
            <div className="space-y-2 p-4">
              <Headline
                styleAs="category"
                className={categoryLabelClassName(article.category)}
              >
                {article.category.replace(/-/g, ' ')}
              </Headline>
              <Copy size="lg" weight="bold">
                {article.title}
              </Copy>
              <Suspense fallback={<Copy size="sm" color="lightGray">Loading date…</Copy>}>
                <PublishedDate date={article.publishedAt} />
              </Suspense>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
