import { cn } from '@/utils/cn';

export const searchInnerContainerStyles = 'flex flex-col gap-4 md:flex-row md:items-stretch w-full'

export const categoryFilterTriggerButtonStyles = cn(
  'inline-flex h-12 min-h-12 shrink-0 items-center justify-between gap-2 rounded-lg border border-input px-3 text-sm outline-none cursor-pointer transition-colors box-border',
  'hover:bg-muted/50 focus-ring',
  'dark:bg-input/30',
)

export const categoryFilterTriggerButtonDisabledStyles = 'text-muted-foreground bg-muted/50 cursor-not-allowed'

export const categoryFilterNumberStyles = "inline-block min-w-[1ch] text-center tabular-nums"

export const categoryFilterSelectLabelStyles =
  'flex cursor-pointer items-center gap-3 rounded-md p-2.5 hover:bg-muted/60'

export const categoryFilterChevronIconStyles = "opacity-60 transition-transform duration-200 ease-out"