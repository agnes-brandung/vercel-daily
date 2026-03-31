import { cn } from '@/utils/cn';

export type LoadingSkeletonType = 'default' | 'article' | 'card' | 'excerpt';

type LoadingSkeletonProps = {
  type?: LoadingSkeletonType;
};

const bar = 'rounded-md bg-muted';

function ArticleSkeleton() {
  return (
    <div className="w-full max-w-3xl animate-pulse space-y-6">
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

// TODO: fix position of thumbnail
function ExcerptSkeleton() {
  return (
    <div className="w-full max-w-2xl animate-pulse">
      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-[minmax(0,5fr)_auto] sm:gap-4">
        {/* Mobile: row 2; sm+: column 1 (~flexible) */}
        <div className="col-start-1 row-start-2 min-w-0 space-y-2 sm:row-start-1 sm:col-start-1">
          <div className={cn(bar, 'h-2.5 w-20')} />
          <div className={cn(bar, 'h-8 w-full')} />
          <div className={cn(bar, 'h-3 w-full')} />
          <div className={cn(bar, 'h-3 w-11/12')} />
        </div>
        {/* Mobile: row 1; sm+: second column is auto width, thumb flush to container’s right edge */}
        <div
          className={cn(
            'surface-bordered col-start-1 row-start-1 aspect-4/3 w-full overflow-hidden sm:col-start-5 sm:row-start-1 sm:aspect-square sm:w-28 sm:shrink-0',
            bar,
          )}
        />
      </div>
    </div>
  );
}

function CardGridSkeleton() {
  return (
    <div className="grid w-full animate-pulse grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="surface-elevated flex w-full min-w-0 flex-col overflow-hidden"
        >
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
    case 'excerpt':
      return <ExcerptSkeleton />;
    case 'card':
      return <CardGridSkeleton />;
    default:
      return <DefaultSkeleton />;
  }
}
