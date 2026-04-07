'use client';

import { ChevronDownIcon } from '@/ui/icons/chevron-down';
import {
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Copy } from '@/ui/Typography';
import { categoryFilterChevronIconStyles, categoryFilterNumberStyles, categoryFilterSelectLabelStyles, categoryFilterTriggerButtonDisabledStyles, categoryFilterTriggerButtonStyles } from './styles';

type CategoryDropdownTriggerProps = {
  selectedCount: number;
  categoryFilterOpen: boolean;
  isLoading?: boolean;
}

export function CategoryDropdownTrigger({ selectedCount, categoryFilterOpen, isLoading = false }: CategoryDropdownTriggerProps) {
  return (
    <PopoverTrigger asChild>
      <button
        type="button"
        className={isLoading ? cn(categoryFilterTriggerButtonStyles, categoryFilterTriggerButtonDisabledStyles) : cn(categoryFilterTriggerButtonStyles, 'bg-transparent')}
        disabled={isLoading}
      >
        <span className="truncate">
          Categories
          <span className="text-muted-foreground">
            {' '}(<span className={categoryFilterNumberStyles}>{selectedCount}</span>)
          </span>
        </span>
        <span className="inline-flex size-4 shrink-0 items-center justify-center" aria-hidden>
          <ChevronDownIcon
            className={cn(
              'size-4',
              categoryFilterChevronIconStyles,
              categoryFilterOpen && 'rotate-180',
            )}
          />
        </span>
      </button>
    </PopoverTrigger>
  )
}

export function CategoryDropdown({ categories, SelectAllCheckbox, CategoryCheckbox }: { categories: ApiCategory[], SelectAllCheckbox: () => React.ReactNode, CategoryCheckbox: (category: ApiCategory) => React.ReactNode }) {
  return (
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
            <label className={cn(categoryFilterSelectLabelStyles, 'border-b border-border')}>
              {SelectAllCheckbox()}
              <span className="text-sm font-medium leading-none">Select all</span>
            </label>
            <div className="flex flex-col gap-0.5 pt-0.5">
              {categories.map((category) => {
                return (
                  <label
                    key={category.slug}
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
  )
}
