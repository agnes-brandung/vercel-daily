import { Suspense } from 'react';

import { SearchClient } from '@/components/Search/SearchClient';
import { ArticlesGrid } from '@/components/Articles/ArticlesGrid';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import { InfoMessage } from '@/components/ui/InfoMessage';
import { getCategories } from '@/app/api/getCategories';
import { getArticleMethods } from '@/app/api/getArticlesMethods';
import {
  filterArticlesBySearchTermAndCategories,
  isSpecialShortSearchTerm,
  MIN_SEARCH_TERM_LENGTH,
  readCategorySlugsFromSearchParamsRecord,
  readSearchTermFromSearchParamsRecord,
} from '@/utils/filterArticlesBySearchParams';
import { Headline } from '@/ui/Typography';
import { ParsedArticle } from '@/utils';

const articlesGridStyles = "w-full shrink-0 sm:w-[calc(50%-0.75rem)] lg:w-[calc((100%-3rem)/3)]";

type SearchPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined | null>>;
};

const SEARCH_RESULTS_MAX = 5;

async function SearchBar() {
  const categoriesResult = await getCategories();
  if (!categoriesResult.ok) {
    return <InfoMessage type="error" message="An error occurred while fetching the categories - try again later." />;
  }

  const categories = categoriesResult.data;

  if (categories.length === 0) {
    return <InfoMessage type="info" message="No categories found." />;
  }

  return <SearchClient categories={categories} />
}

async function SearchResults({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const allArticlesResult = await getArticleMethods();
  if (!allArticlesResult.ok) {
    return <InfoMessage type="error" message="An error occurred while fetching the articles - try again later." />;
  }

  const allArticles = allArticlesResult.data.allArticles;
  const defaultArticles = allArticles.slice(0, SEARCH_RESULTS_MAX);
  const searchTerm = readSearchTermFromSearchParamsRecord(params);
  const selectedCategories = readCategorySlugsFromSearchParamsRecord(params);
  const filteredArticles = filterArticlesBySearchTermAndCategories({
    allArticles,
    searchTerm,
    selectedCategories,
  });

  const resultsGrid = (
    articles: ParsedArticle[],
  ) => (
      <ul className="flex flex-wrap justify-center gap-6">
        <ArticlesGrid articles={articles} itemClassName={articlesGridStyles} />
      </ul>
  );

  if (searchTerm.length === 0) {
    return resultsGrid(defaultArticles);
  }

  const searchSpecificEnough =
    searchTerm.length >= MIN_SEARCH_TERM_LENGTH || isSpecialShortSearchTerm(searchTerm);

  if (!searchSpecificEnough) {
    return (
      <div className="space-y-4">
        <InfoMessage
          type="info"
          message="Your search is not specific enough (less than 3 characters). Here are some recent articles handpicked by us:"
        />
        {resultsGrid(defaultArticles)}
      </div>
    );
  }

  // TODO: sometimes not updated correclty when deselected categories
  if (filteredArticles.length === 0) {
    return (
      <div className="space-y-4">
        <InfoMessage
          type="info"
          message="No articles found for search term and categories. Please search for another term or reset categories."
        />
        <Headline type="h5">Here are some recent articles handpicked by us:</Headline>
        {resultsGrid(defaultArticles)}
      </div>
    );
  }

  return (
    <div className="space-y-4" >
      <Headline type="h5" className="text-green">Results: {filteredArticles.length} article{filteredArticles.length === 1 ? '' : 's'} found</Headline>
      {resultsGrid(filteredArticles.slice(0, SEARCH_RESULTS_MAX))}
    </div>
  );
}

/**
 * TODOS:
 * - Bonus: add breadcrumb?
 */
export default function SearchPage({ searchParams }: SearchPageProps) {
  return (
    <>
      <Suspense
        fallback={
          <InfoMessage type="loading" message="Loading categories...">
            <LoadingSkeleton type="card" />
          </InfoMessage>
        }
      >
        <SearchBar />
      </Suspense>
    
      <Suspense
        fallback={
          <InfoMessage type="loading" message="Loading search results...">
            <LoadingSkeleton type="card" />
          </InfoMessage>
        }
      >
        <SearchResults searchParams={searchParams} />
      </Suspense>
    </>
  );
}
