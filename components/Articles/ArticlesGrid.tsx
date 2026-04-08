import { Copy, Headline } from '@/ui/Typography';
import { cn } from '@/utils/cn';
import Link from 'next/link';

import { ImageWithFallback } from '@/components/ui/PlaceholderImg';

import { categoryCardBorderClassName, categoryLabelClassName } from '@/utils/mapCategoryColor';
import PublishedDate from '@/components/PublishedDate';
import { Suspense } from 'react';
import type { ParsedArticle } from '@/utils/parseApiData';

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
            <div className="relative aspect-16/10 bg-muted">
              <ImageWithFallback
                src={article.image}
                alt={article.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform md:group-hover:scale-[1.02]"
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
