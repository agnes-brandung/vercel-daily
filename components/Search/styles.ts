import { cn } from '@/lib/utils';

export const searchBarContainerStyles = 'flex w-full max-w-2xl flex-col gap-4'

export const searchInputContainerStyles = 'flex flex-col gap-3 sm:flex-row sm:items-stretch sm:gap-2'

export const categoryFilterTriggerButtonStyles = cn(
  'inline-flex h-11 shrink-0 items-center justify-between gap-2 rounded-lg border border-input bg-transparent px-3 text-sm outline-none cursor-pointer transition-colors',
  'hover:bg-muted/50 focus-ring',
  'dark:bg-input/30',
)

export const categoryFilterNumberStyles = "inline-block min-w-[1ch] text-center tabular-nums"

export const categoryFilterSelectLabelStyles =
  'flex cursor-pointer items-center gap-3 rounded-md p-2.5 hover:bg-muted/60'

export const categoryFilterChevronIconStyles = "opacity-60 transition-transform duration-200 ease-out"