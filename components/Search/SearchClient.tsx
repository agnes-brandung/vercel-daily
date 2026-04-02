'use client';

import {
  type ChangeEvent,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SearchIcon } from '@/ui/icons/search';

import Button from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Popover,
} from '@/components/ui/popover';
import { searchInnerContainerStyles } from './styles';
import { useCloseCategoryPopover } from './hooks/useCloseCategoryPopover';
import { CategoryDropdown, CategoryDropdownTrigger } from './CategoryDropdown';
import {
  buildSearchQueryString,
  CATEGORIES_QUERY_KEY,
  parseCategorySlugsFromSearchParam,
  SEARCH_TERM_QUERY_KEY,
} from '@/utils/filterArticlesBySearchParams';
import { CloseIcon } from '@/ui/icons/close';

const AUTO_SEARCH_DEBOUNCE_MS = 600;

/** Match category trigger + buttons: fixed height, override Button `py-4` here only (does not change global Button styles). */
const searchBarControlClassName = 'h-12 min-h-12 shrink-0 box-border py-0';

type SearchClientProps = {
  categories: ApiCategory[];
};

type UrlSearchParamsLike = Pick<URLSearchParams, 'get'>;

function readCategorySlugsFromUrlSearchParams(searchParams: UrlSearchParamsLike): string[] {
  return parseCategorySlugsFromSearchParam(searchParams.get(CATEGORIES_QUERY_KEY));
}

/** Stable string for comparing “search URL state” (term + category slugs, order-independent). */
function serializeSearchUrlState(trimmedSearchTerm: string, categorySlugs: string[]): string {
  return `${trimmedSearchTerm}|${[...categorySlugs].sort().join(',')}`;
}

function serializeSearchParamsRecord(sp: UrlSearchParamsLike): string {
  const term = (sp.get(SEARCH_TERM_QUERY_KEY) ?? '').trim();
  return serializeSearchUrlState(term, readCategorySlugsFromUrlSearchParams(sp));
}

export function SearchClient({ categories }: SearchClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(() => searchParams.get(SEARCH_TERM_QUERY_KEY) ?? '');
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>(() =>
    readCategorySlugsFromUrlSearchParams(searchParams),
  );
  const [isResultsLoading, setIsResultsLoading] = useState(false);

  /** Latest category selection for debounced search (updated in handlers + URL sync). */
  const selectedSlugsRef = useRef(selectedSlugs);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [categoryFilterOpen, setCategoryFilterOpen] = useState(false);
  const { scheduleCloseCategoryPopover, clearCloseCategoryPopoverTimer } = useCloseCategoryPopover({
    setCategoryFilterOpen,
  });

  /**
   * When the URL changes, align local state.
   * Debouncing stays in `handleQueryChange`; `useEffect` is only for this external sync.
   */
  useEffect(() => {
    const nextQueryFromUrl = searchParams.get(SEARCH_TERM_QUERY_KEY) ?? '';
    const nextCategories = readCategorySlugsFromUrlSearchParams(searchParams);
    // Defer state updates out of the effect’s synchronous body (avoids cascading-render lint;
    // still runs immediately after the current commit).
    queueMicrotask(() => {
      setQuery((prev) => {
        // Keep leading/trailing spaces in the input; the URL only stores trimmed text.
        if (nextQueryFromUrl === prev.trim()) {
          return prev;
        }
        return nextQueryFromUrl;
      });
      setSelectedSlugs(nextCategories);
      selectedSlugsRef.current = nextCategories;
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
      setIsResultsLoading(false);
    });
  }, [searchParams]);

  const commitSearch = useCallback(
    (nextQuery: string, slugs: string[]) => {
      // Normalised search term for the URL only; `query` state keeps spaces as typed.
      const trimmed = nextQuery.trim();
      const queryString = buildSearchQueryString(trimmed, slugs);
      const nextSerialized = serializeSearchUrlState(trimmed, slugs);
      const currentSerialized = serializeSearchParamsRecord(searchParams);
      if (nextSerialized !== currentSerialized) {
        setIsResultsLoading(true);
      }
      router.replace(queryString ? `/search?${queryString}` : '/search', { scroll: false });
    },
    [router, searchParams],
  );

  const runManualSearch = useCallback(() => {
    commitSearch(query, selectedSlugs);
  }, [commitSearch, query, selectedSlugs]);

  function handleQueryChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setQuery(value);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    debounceTimerRef.current = setTimeout(() => {
      debounceTimerRef.current = null;
      commitSearch(value, selectedSlugsRef.current);
    }, AUTO_SEARCH_DEBOUNCE_MS);
  }

  function applyCategorySelection(next: string[]) {
    setSelectedSlugs(() => {
      selectedSlugsRef.current = next;
      queueMicrotask(() => commitSearch(query, next));
      return next;
    });
    scheduleCloseCategoryPopover();
  }

  function toggleCategory(slug: string, checked: boolean) {
    setSelectedSlugs((prev) => {
      const next = checked
        ? prev.includes(slug)
          ? prev
          : [...prev, slug]
        : prev.filter((categorySlug) => categorySlug !== slug);
      selectedSlugsRef.current = next;
      queueMicrotask(() => commitSearch(query, next));
      return next;
    });
    scheduleCloseCategoryPopover();
  }

  const allCategorySlugs = categories.map((category) => category.slug);
  const allSelected =
    categories.length > 0 &&
    allCategorySlugs.length === selectedSlugs.length &&
    allCategorySlugs.every((slug) => selectedSlugs.includes(slug));

  function toggleSelectAll(checked: boolean) {
    applyCategorySelection(checked ? [...allCategorySlugs] : []);
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      runManualSearch();
    }
  }

  const selectedCount = selectedSlugs.length;

  function SelectAllCheckbox() {
    return (
      <Checkbox
        id="search-category-select-all"
        checked={allSelected}
        onCheckedChange={(value) => {
          if (value === 'indeterminate') return;
          toggleSelectAll(value);
        }}
      />
    );
  }

  function CategoryCheckbox(category: ApiCategory) {
    return (
      <Checkbox
        id={`search-category-${category.slug}`}
        checked={selectedSlugs.includes(category.slug)}
        onCheckedChange={(value) => toggleCategory(category.slug, value === true)}
      />
    )
  }

  return (
    <div className={searchInnerContainerStyles}>
      <div className="relative min-w-0 flex-1">
        <Input
          type="search"
          value={query}
          onChange={handleQueryChange}
          onKeyDown={onKeyDown}
          placeholder="Search articles..."
          autoComplete="off"
          aria-label="Search"
          disabled={isResultsLoading}
          className="h-12 md:text-base"
        />
      </div>

      <Popover
        open={categoryFilterOpen}
        onOpenChange={(open) => {
          if (open) {
            clearCloseCategoryPopoverTimer();
          }
          setCategoryFilterOpen(open);
        }}
      >
        <CategoryDropdownTrigger selectedCount={selectedCount} categoryFilterOpen={categoryFilterOpen} isLoading={isResultsLoading} />
        <CategoryDropdown 
          categories={categories} 
          SelectAllCheckbox={SelectAllCheckbox}
          CategoryCheckbox={(category) => CategoryCheckbox(category)}
        />
      </Popover>

      <Button
        type="button"
        label="Search"
        icon={<SearchIcon />}
        onClick={runManualSearch}
        isLoading={isResultsLoading}
        disabled={isResultsLoading}
        className={searchBarControlClassName}
      />

      <Button
        type="button"
        variant="secondary"
        label="Reset"
        icon={<CloseIcon className="size-4" />}
        onClick={() => {
          setQuery('');
          setSelectedSlugs([]);
          commitSearch('', []);
        }}
        isLoading={isResultsLoading}
        disabled={isResultsLoading}
        className={searchBarControlClassName}
      />
    </div>
  );
}
