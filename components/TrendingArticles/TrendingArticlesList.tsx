import Link from 'next/link';
import { Suspense } from 'react';
import PublishedDate from '@/components/PublishedDate';
import { Copy, Headline } from '@/ui/Typography';
import { categoryCardBorderClassName, categoryLabelClassName } from '@/utils/mapCategoryColor';
import { cn } from '@/utils/cn';
import { parseArticle } from '@/utils/parseApiData';
import { InfoMessage } from '@/ui/InfoMessage';
import { getTrendingArticles } from '@/app/api/getTrendingArticles';

const MAX_TRENDING = 4;

export async function TrendingArticlesList({ excludeArticleId }: { excludeArticleId: ApiArticle['id'] }) {
  const trendingResult = await getTrendingArticles({ excludeArticleId });
  if (!trendingResult.ok) {
    return <InfoMessage type="error" message="An error occurred while fetching the trending articles — try again later." />;
  }

  if (trendingResult.data.length === 0) {
    return <InfoMessage type="info" message="No trending articles available yet." />;
  }

  const listedArticles = trendingResult.data.slice(0, MAX_TRENDING);

  return (
    <ul className="grid list-none grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {listedArticles.map((article) => {
        const parsedArticle = parseArticle(article);
        return (
          <li key={parsedArticle.id} className="min-w-0">
            <Link
              href={`/articles/${parsedArticle.slug}`}
              className={cn(
                'group surface-elevated flex h-full min-h-48 flex-col overflow-hidden text-typography transition-[border-color,box-shadow,transform] focus-visible:outline-none md:hover:-translate-y-0.5',
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
  );
}
