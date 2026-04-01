'use client';

import { ChevronDownIcon } from '@/ui/icons/chevron-down';
import {
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Copy } from '@/ui/Typography';
import { categoryFilterChevronIconStyles, categoryFilterNumberStyles, categoryFilterSelectLabelStyles, categoryFilterTriggerButtonStyles } from './styles';

export function CategoryDropdownTrigger({ selectedCount, categoryFilterOpen }: { selectedCount: number, categoryFilterOpen: boolean }) {
  return (
    <PopoverTrigger asChild>
      <button
        type="button"
        className={categoryFilterTriggerButtonStyles}
      >
        <span className="truncate">
          Categories
          <span className="text-muted-foreground">
            {' '}(<span className={categoryFilterNumberStyles}>{selectedCount}</span>)
          </span>
        </span>
        <ChevronDownIcon
          className={cn(
            categoryFilterChevronIconStyles,
            categoryFilterOpen && 'rotate-180',
          )}
        />
      </button>
    </PopoverTrigger>
  )
}

export function CategoryDropdown({ categories, SelectAllCheckbox, CategoryCheckbox }: { categories: ApiCategory[], SelectAllCheckbox: () => React.ReactNode, CategoryCheckbox: (category: ApiCategory) => React.ReactNode }) {
  return (
    <>
      <PopoverContent align="start" className="w-80 max-h-72 overflow-y-auto">
        <div className="flex flex-col gap-2">
          <PopoverTitle className="px-0.5 text-xs font-medium text-muted-foreground">
            Filter by category (multi-select)
          </PopoverTitle>
          {categories.length === 0 ? (
            <Copy size="sm" color="lightGray">
              No categories available.
            </Copy>
          ) : (
            <>
              <label
                htmlFor="search-category-select-all"
                className={cn(categoryFilterSelectLabelStyles, 'border-b border-border')}
              >
                {SelectAllCheckbox()}
                <span className="text-sm font-medium leading-none">Select all</span>
              </label>
              <div className="flex flex-col gap-0.5 pt-0.5">
                {categories.map((category) => {
                  const id = `search-category-${category.slug}`;
                  return (
                    <label
                      key={id}
                      htmlFor={id}
                      className={categoryFilterSelectLabelStyles}
                    >
                      {CategoryCheckbox(category)}
                      <span className="text-sm leading-none">{category.name}</span>
                    </label>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </>
    )
}
