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
import { Copy } from '@/ui/Typography';
import { searchBarContainerStyles, searchInputContainerStyles } from './styles';
import { CategoryDropdown, CategoryDropdownTrigger } from './CategoryDropdown';
import {
  CATEGORIES_QUERY_KEY,
  MIN_SEARCH_TERM_LENGTH,
  SEARCH_TERM_QUERY_KEY,
} from '@/utils/filterArticlesBySearchParams';

const AUTO_SEARCH_DEBOUNCE_MS = 300;

/** Close category popover after last toggle so the user does not have to click outside the popover to close it. */
const CATEGORY_POPOVER_CLOSE_DEBOUNCE_MS = 1500;

type SearchClientProps = {
  categories: ApiCategory[];
};

/** Repeated query params: `?categories=changelog&categories=engineering`. */
function readCategorySlugsFromUrlSearchParams(searchParams: { getAll: (name: string) => string[] }): string[] {
  return searchParams.getAll(CATEGORIES_QUERY_KEY).map((s) => s.trim()).filter(Boolean);
}

export function SearchClient({ categories }: SearchClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(() => searchParams.get(SEARCH_TERM_QUERY_KEY) ?? '');
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>(() =>
    readCategorySlugsFromUrlSearchParams(searchParams),
  );

  /** Latest category selection for debounced search (updated in handlers + URL sync). */
  const selectedSlugsRef = useRef(selectedSlugs);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeCategoryPopoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [categoryFilterOpen, setCategoryFilterOpen] = useState(false);

  const scheduleCloseCategoryPopover = useCallback(() => {
    if (closeCategoryPopoverTimerRef.current) {
      clearTimeout(closeCategoryPopoverTimerRef.current);
    }
    closeCategoryPopoverTimerRef.current = setTimeout(() => {
      closeCategoryPopoverTimerRef.current = null;
      setCategoryFilterOpen(false);
    }, CATEGORY_POPOVER_CLOSE_DEBOUNCE_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (closeCategoryPopoverTimerRef.current) {
        clearTimeout(closeCategoryPopoverTimerRef.current);
      }
    };
  }, []);

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
    });
  }, [searchParams]);

  const commitSearch = useCallback(
    (nextQuery: string, slugs: string[]) => {
      const params = new URLSearchParams();
      // Normalised search term for the URL only; `query` state keeps spaces as typed.
      const trimmed = nextQuery.trim();
      if (trimmed.length > 0) {
        params.set(SEARCH_TERM_QUERY_KEY, trimmed);
      }
      for (const slug of slugs) {
        params.append(CATEGORIES_QUERY_KEY, slug);
      }
      const queryString = params.toString();
      router.replace(queryString ? `/search?${queryString}` : '/search', { scroll: false });
    },
    [router],
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
    <div className={searchBarContainerStyles}>
      {categories.length === 0 ? (
        <Copy size="sm" color="lightGray">
          No categories found
        </Copy>
      ) : null}

      <div className={searchInputContainerStyles}>
        <div className="relative min-w-0 flex-1">
          <Input
            type="search"
            value={query}
            onChange={handleQueryChange}
            onKeyDown={onKeyDown}
            placeholder="Search articles..."
            autoComplete="off"
            aria-label="Search"
            className="h-12 md:text-base"
          />
        </div>

        <Popover
          open={categoryFilterOpen}
          onOpenChange={(open) => {
            if (open && closeCategoryPopoverTimerRef.current) {
              clearTimeout(closeCategoryPopoverTimerRef.current);
              closeCategoryPopoverTimerRef.current = null;
            }
            setCategoryFilterOpen(open);
          }}
        >
          <CategoryDropdownTrigger selectedCount={selectedCount} categoryFilterOpen={categoryFilterOpen} />
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
          className="h-11 shrink-0"
        />
      </div>

      <Copy size="sm" color="lightGray">
        Press Enter or use Search to run with {MIN_SEARCH_TERM_LENGTH}+ characters. Results update shortly after you stop typing.
      </Copy>
    </div>
  );
}
