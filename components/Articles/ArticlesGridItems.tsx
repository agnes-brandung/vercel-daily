import { Copy, Headline } from '@/ui/Typography';
import { cn } from '@/utils/cn';
import Link from 'next/link';

import { ImageWithFallback } from '@/components/ui/PlaceholderImg';

import { categoryCardBorderClassName, categoryLabelClassName } from '@/utils/mapCategoryColor';
import { PublishedDay } from '@/components/PublishedDate';
import type { ParsedArticle } from '@/utils/parseApiData';

/**
 * Server-side component that renders articles grid items. The grid itseld is defined in parents components, enabling a flexible grid layout.
 * The first three images are loaded eagerly if `loadFirstImagesEagerly` is set to true,
 * like in the Search page because the first three images appear above the fold.
 * 
 * Only PublishedDay is streamed through Suspense since it is using Date and cacheLife.
 */
export function ArticlesGridItems({
  articles,
  loadFirstImagesEagerly = false,
  itemClassName,
}: {
  articles: ParsedArticle[];
  loadFirstImagesEagerly?: boolean;
  itemClassName?: string;
}) {
  return (
    articles.map((article, index) => {
      const { id, slug, category, categoryLabel, title, publishedAt, image } = article;
      const loadEagerly = loadFirstImagesEagerly && index < 3;
      
      return (
        <li key={id} className={itemClassName}>
          <Link
            href={`/articles/${slug}`}
            className={cn(
              'group block overflow-hidden rounded-lg border border-border bg-card text-typography shadow-elevated transition-[border-color,box-shadow] focus-visible:outline-none',
              categoryCardBorderClassName(category),
            )}
          >
            <div className="relative aspect-16/10 bg-muted">
              <ImageWithFallback
                src={image}
                alt={title}
                preload={loadEagerly ?? undefined}
                fetchPriority={loadEagerly ? 'high' : 'auto'}
                loading={loadEagerly ? 'eager' : 'lazy'}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform md:group-hover:scale-[1.02]"
              />
            </div>
            <div className="space-y-2 p-4">
              <Headline styleAs="category" className={categoryLabelClassName(category)}>
                {categoryLabel}
              </Headline>
              <Copy size="lg" weight="bold">
                {title}
              </Copy>
              <PublishedDay date={publishedAt} />
            </div>
          </Link>
        </li>
      );
    })
  );
}
