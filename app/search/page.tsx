import { Suspense } from 'react';

import { SearchClient } from '@/components/Search/SearchClient';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import { InfoMessage } from '@/components/ui/InfoMessage';
import { getCategories } from '@/lib/server-data/getCategories';
import { getArticleMethods } from '@/lib/server-data/getArticlesMethods';
import {
  filterArticlesBySearchTermAndCategories,
  isSpecialShortSearchTerm,
  MIN_SEARCH_TERM_LENGTH,
  readCategorySlugsFromSearchParamsRecord,
  readSearchTermFromSearchParamsRecord,
} from '@/components/Search/utils/filterArticlesBySearchParams';
import { ResultsGrid } from '@/components/Search/ResultsGrid';
import { Copy } from '@/components/ui/Typography';

type SearchPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined | null>>;
};

// TODO: Check what should be in suspense exactly (maybe separate SearchBar from SearchResults so no searchparams in SearchBar?)
async function SearchBar() {
  const categoriesResult = await getCategories();
  if (!categoriesResult.ok) {
    return <InfoMessage type="error" message="An error occurred while fetching the categories - Please try again later." />;
  }

  const categories = categoriesResult.data;

  if (categories.length === 0) {
    return <InfoMessage type="info" message="No categories found." />;
  }

  return (
    <div className="flex w-full flex-col space-y-4">
      <SearchClient categories={categories} />
      <Copy id="search-help-text" size="sm" color="lightGray">
        Press Enter or use Search to run with {MIN_SEARCH_TERM_LENGTH}+ characters (exception: query for “AI” also
        counts). Title, excerpt and tags are searched for. Results update shortly after you stop typing or change categories.
      </Copy>
    </div>
  )
}

async function SearchResults({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const allArticlesResult = await getArticleMethods();
  if (!allArticlesResult.ok) {
    return <InfoMessage type="error" message="An error occurred while fetching the articles - Please try again later." />;
  }

  const allArticles = allArticlesResult.data.allArticles;
  const searchTerm = readSearchTermFromSearchParamsRecord(params);
  const selectedCategories = readCategorySlugsFromSearchParamsRecord(params);
  const filteredArticles = filterArticlesBySearchTermAndCategories({
    allArticles,
    searchTerm,
    selectedCategories,
  });

  const noSearchTerm = searchTerm.length === 0;
  const noCategories = selectedCategories.length === 0;
  const hasFilteredResults = filteredArticles.length > 0;

  if (noSearchTerm && noCategories) {
    return (
      <ResultsGrid 
        articles={allArticles}
        headline="No search term or categories selected. Here are some recent articles handpicked by us:" 
      />
    );
  }

  const searchSpecificEnough =
    searchTerm.length >= MIN_SEARCH_TERM_LENGTH || isSpecialShortSearchTerm(searchTerm);

  if (!searchSpecificEnough && hasFilteredResults) {
    if (noCategories) {
      return (
        <ResultsGrid 
          articles={allArticles}
          infoMessage="Your search is not specific enough (less than 3 characters and no categories selected). Here are some recent articles handpicked by us:"
          headline="Here are some recent articles handpicked by us:" 
        />
      );
    }
    return (
      <ResultsGrid 
        articles={filteredArticles}
        infoMessage="Filtering by categories."
        headline={`Results: ${filteredArticles.length} article${filteredArticles.length === 1 ? '' : 's'} found`}
      />
    );
  }

  if (!hasFilteredResults) {
    return (
      <ResultsGrid
        aria-live="assertive"
        articles={allArticles}
        infoMessage="No articles found for selected search term and categories. Please search for another term or set/reset categories."
        headline="Here are some recent articles handpicked by us:"
      />
    );
  }

  return (
    <ResultsGrid 
      articles={filteredArticles}
      headline={`Results: ${filteredArticles.length} article${filteredArticles.length === 1 ? '' : 's'} found`}
    />
  );
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  return (
    <>
      <Suspense
        fallback={
          <InfoMessage type="loading" message="Loading categories...">
            <LoadingSkeleton type="form" />
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
