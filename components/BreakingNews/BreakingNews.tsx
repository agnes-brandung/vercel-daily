import { InfoMessage } from '@/components/ui/InfoMessage';
import PublishedDate from '@/components/PublishedDate';
import {
  categoryCardBorderClassName,
  categoryFlashBackground,
  categoryLabelClassName,
  categoryLeftBorderClassName,
} from '@/utils/mapCategoryColor';
import { Copy, Headline } from '@/ui/Typography';
import { cn } from '@/utils/cn';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { Suspense } from 'react';
import { getBreakingNews } from './getBreakingNews';
import { ArrowRightIcon } from '@/ui/icons/arrow-right';
import Button from '../ui/Button';

export async function BreakingNews() {
  const data = await getBreakingNews();

  if (!data.ok) {
    return <InfoMessage type="error" message={data.error} />;
  }

  const { articleId, headline, summary, category, publishedAt, urgent } = data.breakingNews;

  if (!headline?.trim()) {
    return <InfoMessage type="info" message="No breaking news right now." />;
  }

  const categoryLabel = category.replace(/-/g, ' ');
  
  const breakingNewsCardContainerStyles = cn(
    'breaking-news-card group block overflow-hidden rounded-xl border-2 border-border bg-card text-typography shadow-elevated transition-[border-color,box-shadow] focus-visible:outline-none focus-visible:ring-2',
    categoryCardBorderClassName(category),
    categoryLeftBorderClassName(category),
  );

  const breakingNewsCardAnimationStyle = {
    '--breaking-flash-color': categoryFlashBackground(category),
  } as CSSProperties;

  const urgentBadgeStyles = 'rounded-md bg-error px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white';
  const breakingNewsCardReadMoreAnimationStyles = 'inline-flex items-center transition-transform group-hover:translate-x-0.5';

  return (
    <Link
      href={`/articles/${articleId}`}
      className={breakingNewsCardContainerStyles}
      style={breakingNewsCardAnimationStyle}
    >
      <div className="breaking-news-card-inner space-y-4 p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-3">
          {urgent ? (
            <span className={urgentBadgeStyles}>Urgent</span>
          ) : null}
          <Headline styleAs="category" className={categoryLabelClassName(category)}>
            {categoryLabel}
          </Headline>
          <Suspense fallback={<Copy size="sm" color="lightGray">Loading date…</Copy>}>
            <PublishedDate date={publishedAt} />
          </Suspense>
        </div>

        <Headline
          type="h3"
          styleAs="h1"
          className="text-balance normal-case leading-tight"
        >
          {headline}
        </Headline>

        {summary?.trim() ? (
          <Copy size="lg" color="lightGray" className="max-w-3xl leading-relaxed">
            {summary}
          </Copy>
        ) : null}
        <Button variant="tertiary" label="Read full story" alignleft icon={<ArrowRightIcon className={breakingNewsCardReadMoreAnimationStyles}/>} />
      </div>
    </Link>
  );
}
