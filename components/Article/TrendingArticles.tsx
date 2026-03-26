import Link from 'next/link';
import { Suspense } from 'react';

import type { ArticlesResult } from '@/app/api/getTrendingArticles';
import PublishedDate from '@/components/PublishedDate';
import { Copy, Headline } from '@/ui/Typography';
import { categoryCardBorderClassName, categoryLabelClassName } from '@/utils/mapCategoryColor';
import { cn } from '@/utils/cn';
import { parseArticle } from '@/utils/parseApiData';
import { InfoMessage } from '../ui/InfoMessage';

const MAX_TRENDING = 4;

export function TrendingArticles({ result }: { result: ArticlesResult }) {
  
  if (!result.ok) {
    return <InfoMessage type="error" message="An error occurred while fetching the trending articles — try again later." />;
  }

  if (result.data.length === 0) {
    return <InfoMessage type="info" message="No trending articles available yet." />;
  }

  const listedArticles = result.data.slice(0, MAX_TRENDING);

  return (
    <div className="border-t border-border/50">
      <section aria-labelledby="trending-articles-heading" className="space-y-6">
        <Headline
          id="trending-articles-heading"
          type="h2"
          styleAs="h4"
          uppercase
          className="mt-4 w-full max-w-none text-balance"
        >
          Trending now
        </Headline>
        <ul className="grid list-none grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {listedArticles.map((article) => {
            const parsedArticle = parseArticle(article);
            return (
              <li key={parsedArticle.id} className="min-w-0">
                <Link
                  href={`/articles/${parsedArticle.slug}`}
                  className={cn(
                    'group flex h-full min-h-48 flex-col overflow-hidden rounded-md border border-border bg-card text-typography shadow-elevated transition-[border-color,box-shadow,transform] focus-visible:outline-none focus-visible:ring-2 md:hover:-translate-y-0.5',
                    categoryCardBorderClassName(parsedArticle.category),
                  )}
                >
                  <div className="aspect-5/3 shrink-0 bg-muted lg:aspect-4/3">
                    {/* eslint-disable-next-line @next/next/no-img-element -- external URLs; skip Image remotePatterns */}
                    <img
                      src={parsedArticle.image}
                      alt={`${parsedArticle.title} image`}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
                    <Headline styleAs="category" className={categoryLabelClassName(parsedArticle.category)}>
                      {parsedArticle.categoryLabel}
                    </Headline>
                    <Copy size="sm" weight="bold" className="line-clamp-2 leading-snug text-typography sm:text-base">
                      {parsedArticle.title}
                    </Copy>
                    {parsedArticle.excerpt ? (
                      <Copy size="xs" color="lightGray" className="line-clamp-2 leading-relaxed">
                        {parsedArticle.excerpt}
                      </Copy>
                    ) : null}
                    <div className="mt-auto pt-1">
                      <Suspense fallback={<Copy size="xs" color="lightGray">…</Copy>}>
                        <PublishedDate date={parsedArticle.publishedAt} />
                      </Suspense>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
