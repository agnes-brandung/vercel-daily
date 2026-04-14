import { searchInnerContainerStyles } from '@/components/Search/styles';
import { cn } from '@/utils/cn';

export type LoadingSkeletonType =
  | 'article'
  | 'button'
  | 'card'
  | 'default'
  | 'excerpt'
  | 'form'
  /** Matches `IconButton` default (`size-10`, circular) — e.g. mobile nav menu trigger. */
  | 'icon-button'
  | 'list';

type LoadingSkeletonProps = {
  type?: LoadingSkeletonType;
};

const bar = 'rounded-md bg-muted';

function ArticleSkeleton() {
  return (
    <div className="w-full mx-auto max-w-3xl animate-pulse space-y-6">
      <div className="space-y-3">
        <div className={cn(bar, 'h-3 w-28')} />
        <div className={cn(bar, 'h-10 w-full max-w-xl')} />
        <div className={cn(bar, 'h-4 w-full')} />
        <div className={cn(bar, 'h-4 w-4/5')} />
      </div>
      <div className={cn('surface-bordered aspect-16/10 w-full overflow-hidden', bar)} />
      <div className="space-y-3">
        <div className={cn(bar, 'h-4 w-full')} />
        <div className={cn(bar, 'h-4 w-full')} />
        <div className={cn(bar, 'h-4 w-[92%]')} />
        <div className={cn(bar, 'h-4 w-full')} />
        <div className={cn(bar, 'h-4 w-3/4')} />
        <div className={cn(bar, 'h-4 w-full')} />
        <div className={cn(bar, 'h-4 w-5/6')} />
        <div className={cn(bar, 'h-4 w-2/3')} />
      </div>
    </div>
  );
}

/** Primary CTA shape + staggered “alive” motion like card grid; inner `animate-pulse` for shimmer. */
function ButtonSkeleton() {
  return (
    <div className="flex w-full justify-center">
      <div className="staggered-card-alive w-full md:w-auto">
        <div
          className={cn(
            'animate-pulse flex h-min w-full flex-nowrap items-center justify-center rounded-md border border-border bg-muted px-8 py-4 md:w-fit',
          )}
          aria-busy
        >
          <span className="sr-only">Loading</span>
          <div
            className="h-4 w-30 shrink-0 rounded-md bg-muted-foreground/25"
            aria-hidden
          />
        </div>
      </div>
    </div>
  );
}

function CardGridSkeleton() {
  return (
    <div className="staggered-card-list grid w-full grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="staggered-card-alive surface-elevated flex w-full min-w-0 flex-col overflow-hidden"
        >
          <div className="animate-pulse flex min-h-0 w-full flex-1 flex-col">
            <div
              className={cn('h-28 w-full shrink-0 border-b border-border sm:h-32', bar)}
            />
            <div className="flex flex-1 flex-col gap-1.5 p-3">
              <div className={cn(bar, 'h-4 w-4/5')} />
              <div className={cn(bar, 'h-2.5 w-full')} />
              <div className={cn(bar, 'h-2.5 w-full')} />
              <div className={cn(bar, 'h-2.5 w-2/3')} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/** One excerpt row: mobile = thumbnail on top, text below; sm+ = text ~70% (7fr), thumbnail ~30% (3fr). */
function ExcerptRowSkeleton() {
  return (
    <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-[minmax(0,7fr)_minmax(0,3fr)] sm:items-center sm:gap-4">
      <div
        className={cn(
          'surface-bordered order-1 aspect-3/1 w-full min-w-0 overflow-hidden sm:order-2',
          bar,
        )}
      />
      <div className="order-2 min-w-0 space-y-2 sm:order-1">
        <div className={cn(bar, 'h-2.5 w-20')} />
        <div className={cn(bar, 'h-8 w-full')} />
        <div className={cn(bar, 'h-3 w-full')} />
        <div className={cn(bar, 'h-3 w-11/12')} />
      </div>
    </div>
  );
}

function ExcerptSkeleton() {
  return (
    <div className="w-full animate-pulse">
      <ExcerptRowSkeleton />
    </div>
  );
}

/**
 * Search-bar-shaped row: long control, category-style block, two `h-12` actions.
 * `staggered-card-list` + `staggered-card-alive` reuse subscription.css delays (0 / 0.14s / 0.28s / 0.42s).
 */
function FormSkeleton() {
  return (
    <div
      className={cn('staggered-card-list', searchInnerContainerStyles)}
      aria-busy
      aria-label="Loading search form"
    >
      <div className="staggered-card-alive relative min-w-0 flex-1">
        <div
          className={cn(
            'animate-pulse border border-border bg-muted',
            'h-12 w-full rounded-md md:min-h-12',
          )}
          aria-hidden
        />
      </div>

      <div className="staggered-card-alive shrink-0">
        <div
          className={cn(
            'animate-pulse border border-border bg-muted',
            'h-12 w-full rounded-md md:min-h-12 md:w-44',
          )}
          aria-hidden
        />
      </div>

      <div className="staggered-card-alive shrink-0">
        <div
          className={cn(
            'animate-pulse border border-border bg-muted',
            'h-12 min-h-12 w-full rounded-md md:min-w-28 md:max-w-40',
          )}
          aria-hidden
        />
      </div>

      <div className="staggered-card-alive shrink-0">
        <div
          className={cn(
            'animate-pulse border border-border bg-muted/90',
            'h-12 min-h-12 w-full rounded-md md:min-w-28 md:max-w-36',
          )}
          aria-hidden
        />
      </div>
    </div>
  );
}

/** Same footprint as `IconButton` default: `size-10`, round, bordered (mobile nav menu trigger). */
function IconButtonSkeleton() {
  return (
    <div
      className="size-10 shrink-0 animate-pulse rounded-sm border border-border bg-muted"
      aria-busy
      aria-label="Loading"
    >
      <span className="sr-only">Loading</span>
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="list-skeleton-feed flex w-full max-w-2xl flex-col gap-8" aria-busy aria-label="Loading article list">
      {[0, 1, 2].map((i) => (
        <div key={i} className="list-feed-row min-w-0 overflow-hidden rounded-lg">
          <div className="animate-pulse">
            <ExcerptRowSkeleton />
          </div>
        </div>
      ))}
    </div>
  );
}

function DefaultSkeleton() {
  return (
    <div className="w-full max-w-xl animate-pulse space-y-3">
      <div className={cn(bar, 'h-8 w-1/3')} />
      <div className={cn(bar, 'h-4 w-full')} />
      <div className={cn(bar, 'h-4 w-2/3')} />
    </div>
  );
}

export default function LoadingSkeleton({ type = 'default' }: LoadingSkeletonProps) {
  switch (type) {
    case 'article':
      return <ArticleSkeleton />;
    case 'button':
      return <ButtonSkeleton />;
    case 'card':
      return <CardGridSkeleton />;
    case 'excerpt':
      return <ExcerptSkeleton />;
    case 'form':
      return <FormSkeleton />;
    case 'icon-button':
      return <IconButtonSkeleton />;
    case 'list':
      return <ListSkeleton />;
    case 'default':
      return <DefaultSkeleton />;
  }
}
