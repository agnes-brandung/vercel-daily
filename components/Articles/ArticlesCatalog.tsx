import { InfoMessage } from '@/components/ui/InfoMessage';
import { ReadArticleButton } from '@/components/ReadArticleButton';
import { Copy, Headline } from '@/ui/Typography';
import {
  type ArticlesCatalogSectionCategory,
  categoryCatalogDotClassName,
  categoryCatalogSectionHeaderClassName,
  categoryLabelClassName,
  categoryLeftBorderClassName,
} from '@/utils/mapCategoryColor';
import { cn } from '@/utils/cn';
import { formatArticleCategoryLabel, type ParsedArticle } from '@/utils/parseApiData';
import Link from 'next/link';

import { ImageWithFallback } from '@/components/ui/PlaceholderImg';
import { getArticleMethods } from '@/lib/server-data/getArticlesMethods';

function ArticleLink({ article, imagePrefetch = false }: { article: ParsedArticle, imagePrefetch?: boolean }) {
  return (
    <Link
      prefetch={false}
      href={`/articles/${article.slug}`}
      className={cn(
        'group flex flex-col gap-3 px-4 py-5 sm:px-5 sm:py-6 no-underline lg:flex-row lg:items-start lg:gap-4 focus-ring',
      )}
    >
      <figure className="relative order-1 h-[200px] w-full shrink-0 overflow-hidden rounded-md lg:order-2 lg:w-[200px]">
        <ImageWithFallback
          src={article.image}
          alt={article.title}
          fill
          sizes="(max-width: 1024px) 100vw, 200px"
          className="object-cover"
          preload={imagePrefetch}
          fetchPriority={imagePrefetch ? 'high' : 'auto'}
          loading={imagePrefetch ? 'eager' : 'lazy'}
        />
      </figure>
      <div className="order-2 flex min-w-0 flex-1 flex-col gap-2 lg:order-1">
        <Headline type="h3" styleAs="h4" className="text-balance text-typography">
          {article.title}
        </Headline>
        {article.excerpt ? (
          <Copy color="lightGray" className="text-pretty">
            {article.excerpt}
          </Copy>
        ) : null}
        <ReadArticleButton />
      </div>
    </Link>
  );
}

function articlesCatalogSectionLabel(section: ArticlesCatalogSectionCategory): string {
  if (section === 'most-recent') {
    return 'Most recent';
  }
  return formatArticleCategoryLabel(section);
}

const paddings = 'px-4 py-3 sm:px-5 sm:py-4';

function ArticlesCatalogSection({
  section,
  articles,
  categoryIndex,
}: {
  section: ArticlesCatalogSectionCategory;
  articles: ParsedArticle[];
  categoryIndex: number;
}) {
  return (
    <section
      aria-labelledby={`catalog-category-${section}`}
      className={cn('surface-elevated overflow-hidden', categoryLeftBorderClassName(section))}
    >
      <header className={cn(paddings, categoryCatalogSectionHeaderClassName(section))}>
        <div className="flex items-center gap-2.5">
          <span className={categoryCatalogDotClassName(section)} aria-hidden />
          <Headline
            id={`catalog-category-${section}`}
            type="h2"
            styleAs="h3"
            uppercase
            className={cn('mb-0 tracking-wide', categoryLabelClassName(section))}
          >
            {articlesCatalogSectionLabel(section)}
          </Headline>
        </div>
      </header>
      {articles.length > 0 ? (
        <ul className="m-0 list-none divide-y divide-border p-0">
          {articles.map((article, index) => (
            <li key={`${article.id}-${section}`} className="transition-colors hover:bg-muted/40">
              <ArticleLink article={article} imagePrefetch={categoryIndex === 0 && index < 3} />
            </li>
          ))}
        </ul>
      ) : (
        <div className={paddings}>
          <Copy color="lightGray">No articles for this category yet</Copy>
        </div>
      )}
    </section>
  );
}

export async function ArticlesCatalog() {
  const allArticles = await getArticleMethods();
  
  if (!allArticles.ok) {
    return <InfoMessage type="error" message="An error occurred while fetching the articles - Please try again later." />;
  }

  const { articlesByCategory, mostRecentArticles } = allArticles.data;

  return (
    <div className="flex flex-col gap-10 sm:gap-12">
      {articlesByCategory.length > 0 ? (
        articlesByCategory.map(({ category, articles }, index) => (
          <ArticlesCatalogSection key={category} categoryIndex={index} section={category} articles={articles} />
        ))
      ) : (
        <ArticlesCatalogSection categoryIndex={0} section="most-recent" articles={mostRecentArticles} />
      )}
    </div>
  );
}
