import { InfoMessage } from '@/components/ui/InfoMessage';
import { getArticles } from '@/app/api/getArticles';
import { ReadArticleButton } from '@/components/ReadArticleButton';
import { Copy, Headline } from '@/ui/Typography';
import {
  categoryCatalogDotClassName,
  categoryCatalogSectionHeaderClassName,
  categoryLabelClassName,
  categoryLeftBorderClassName,
} from '@/utils/mapCategoryColor';
import { cn } from '@/utils/cn';
import { formatArticleCategoryLabel, parseArticle, type ParsedArticle } from '@/utils/parseApiData';
import Link from 'next/link';

/** Display order for category sections (API may return articles in any order). */
const CATEGORY_SECTION_ORDER: ApiArticle['category'][] = [
  'changelog',
  'engineering',
  'customers',
  'company-news',
  'community',
];

function groupArticlesByCategory(articles: ParsedArticle[]): Array<{
  category: ApiArticle['category'];
  articles: ParsedArticle[];
}> {
  const byCategory = new Map<ApiArticle['category'], ParsedArticle[]>();
  for (const article of articles) {
    const list = byCategory.get(article.category) ?? [];
    list.push(article);
    byCategory.set(article.category, list);
  }
  for (const list of byCategory.values()) {
    list.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }
  return CATEGORY_SECTION_ORDER.filter((c) => (byCategory.get(c)?.length ?? 0) > 0).map((c) => ({
    category: c,
    articles: byCategory.get(c)!,
  }));
}

export async function ArticlesCatalog() {
  const allArticles = await getArticles();

  if (!allArticles.ok) {
    return <InfoMessage type="error" message={"An error occurred while fetching the articles - try again later."} />;
  }
  if (allArticles.data.length === 0) {
    return <InfoMessage type="info" message="No articles available yet." />;
  }

  const parsedArticles = allArticles.data.map((article) => parseArticle(article));
  const sections = groupArticlesByCategory(parsedArticles);

  return (
    <div className="flex flex-col gap-10 sm:gap-12">
      {sections.map(({ category, articles }) => (
        <section
          key={category}
          aria-labelledby={`catalog-category-${category}`}
          className={cn(
            'overflow-hidden rounded-md border border-border bg-card shadow-elevated',
            categoryLeftBorderClassName(category),
          )}
        >
          <header className={cn('px-4 py-3 sm:px-5 sm:py-4', categoryCatalogSectionHeaderClassName(category))}>
            <div className="flex items-center gap-2.5">
              <span className={categoryCatalogDotClassName(category)} aria-hidden />
              <Headline
                id={`catalog-category-${category}`}
                type="h2"
                styleAs="h3"
                uppercase
                className={cn('mb-0 tracking-wide', categoryLabelClassName(category))}
              >
                {formatArticleCategoryLabel(category)}
              </Headline>
            </div>
          </header>
          <ul className="m-0 list-none divide-y divide-border p-0">
            {articles.map((article) => (
              <li key={article.id} className="transition-colors hover:bg-muted/40">
                <Link
                  href={`/articles/${article.slug}`}
                  className="group flex flex-col gap-2 px-4 py-5 sm:px-6 sm:py-6 no-underline outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-blue)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--body)]"
                >
                  <Headline type="h3" styleAs="h4" className="text-balance text-typography">
                    {article.title}
                  </Headline>
                  {article.excerpt ? (
                    <Copy color="lightGray" className="text-pretty">
                      {article.excerpt}
                    </Copy>
                  ) : null}
                  <ReadArticleButton />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
