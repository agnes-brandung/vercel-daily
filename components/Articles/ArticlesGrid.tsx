import { Copy, Headline } from '@/ui/Typography';
import { cn } from '@/utils/cn';
import Link from 'next/link';

import { categoryCardBorderClassName, categoryLabelClassName } from '@/utils/mapCategoryColor';
import PublishedDate from '@/components/PublishedDate';
import { Suspense } from 'react';
import { ParsedArticle } from '@/utils/parseApiData';

export function ArticlesGrid({
  articles,
  itemClassName,
}: {
  articles: ParsedArticle[];
  itemClassName?: string;
}) {
  return (
    articles.map((article) => {
      return (
        <li key={article.id} className={itemClassName}>
          <Link
            href={`/articles/${article.slug}`}
            className={cn(
              'group block overflow-hidden rounded-lg border border-border bg-card text-typography shadow-elevated transition-[border-color,box-shadow] focus-visible:outline-none',
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
              <Headline styleAs="category" className={categoryLabelClassName(article.category)}>
                {article.categoryLabel}
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
      );
    })
  );
}
