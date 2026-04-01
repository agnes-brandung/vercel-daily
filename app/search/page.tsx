import { Suspense } from 'react';

import { SearchBar } from '@/components/Search/SearchBar';
import { ArticlesGrid } from '@/components/Articles/ArticlesGrid';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import { InfoMessage } from '@/components/ui/InfoMessage';
import { getCategories } from '@/app/api/getCategories';
import { Copy, Headline } from '@/ui/Typography';
import { getArticleMethods } from '../api';
import {
  filterArticlesBySearchTermAndCategories,
  readCategorySlugsFromSearchParamsRecord,
  readSearchTermFromSearchParamsRecord,
} from '@/utils/filterArticlesBySearchParams';

type SearchPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined | null>>;
};

/**
 * TODOS:
 * - Bonus: add breadcrumb?
 */
export default function SearchPage({ searchParams }: SearchPageProps) {
  return (
    <div className="section-base-space">
      <Headline styleAs="h1" uppercase>
        Search
      </Headline>
      <Copy className="mb-6 max-w-prose">
        Find articles by keyword. Combine with one or more categories to narrow results.
      </Copy>
      <Suspense
        fallback={
          <InfoMessage type="loading" message="Loading search by categories">
            <LoadingSkeleton type="card" />
          </InfoMessage>
        }
      >
        <SearchResults searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

const SEARCH_RESULTS_MAX = 5;

async function SearchResults({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const categoriesResult = await getCategories();
  const allArticlesResult = await getArticleMethods();
  if (!categoriesResult.ok && !allArticlesResult.ok) {
    return <InfoMessage type="error" message="An error occurred while fetching the categories or articles - try again later." />;
  }

  const categories = categoriesResult.ok ? categoriesResult.data : [];
  const allArticles = allArticlesResult.ok ? allArticlesResult.data.allArticles : [];

  const defaultArticles = allArticles.slice(0, SEARCH_RESULTS_MAX);
  const searchTerm = readSearchTermFromSearchParamsRecord(params);
  const selectedCategories = readCategorySlugsFromSearchParamsRecord(params);
  const filteredArticles = filterArticlesBySearchTermAndCategories({allArticles, searchTerm, selectedCategories});

 
  let displayArticles = defaultArticles;

  // TODO VD-005: check this, seems incorrect
  if (!searchTerm || searchTerm.length < 3) {
    displayArticles = filteredArticles.slice(0, SEARCH_RESULTS_MAX);
  }

  const noArticlesFound = displayArticles.length === 0
  if (noArticlesFound) {
    return (
      <>
        <SearchBar categories={categories} />
        <InfoMessage type="info" message="No articles found for search term and categories. Please search for another term or reset categories." />
      </>
    )
  }

  return (
    <>
      <SearchBar categories={categories} />

      <ul className="mt-10 flex flex-wrap justify-center gap-6">
        <ArticlesGrid
          articles={displayArticles}
          itemClassName="w-full shrink-0 sm:w-[calc(50%-0.75rem)] lg:w-[calc((100%-3rem)/3)]"
        />
      </ul>
    </>
  );
}
