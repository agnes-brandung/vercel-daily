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
import { getBreakingNews, getArticleById } from '@/app/api';
import { ReadArticleButton } from '@/components/ReadArticleButton';
import { BreakingNewsTicker } from './BreakingNewsTicker';
import { parseBreakingNews } from '@/utils/parseApiData';

export async function BreakingNews() {
  const breakingNewsData = await getBreakingNews();

  if (!breakingNewsData.ok) {
    return <InfoMessage type="error" message={"An error occurred while fetching the breaking news - try again later."} />;
  }

  const parsedBreakingNews = parseBreakingNews(breakingNewsData.data);
  const { articleId, headline, summary, category, publishedAt, urgent, categoryLabel } = parsedBreakingNews;

  const articleById = await getArticleById({ articleId });
  if (!articleById.ok) {
    return <InfoMessage type="error" message={"An error occurred while fetching the breaking news - try again later."} />;
  }

  const breakingNewsSlug = articleById.data?.slug;

  if (!breakingNewsSlug || !headline) {
    return <InfoMessage type="info" message="No breaking news right now." />;
  }

  const breakingNewsCardContainerStyles = cn(
    'breaking-news-card group block overflow-hidden rounded-xl border-2 border-border bg-card text-typography shadow-elevated transition-[border-color,box-shadow] focus-visible:outline-none focus-visible:ring-2',
    categoryCardBorderClassName(category),
    categoryLeftBorderClassName(category),
  );

  const breakingNewsCardAnimationStyle = {
    '--breaking-flash-color': categoryFlashBackground(category),
  } as CSSProperties;

  const urgentBadgeStyles = 'rounded-md bg-error px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white';

  return (
    <Link
      href={`/articles/${breakingNewsSlug}`}
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
          className="text-balance leading-tight"
        >
          {headline}
        </Headline>
        {summary ? (
          <Copy size="lg" color="lightGray" className="max-w-3xl leading-relaxed">
            {summary}
          </Copy>
        ) : null}
        <ReadArticleButton />
      </div>
      {urgent ? <BreakingNewsTicker /> : null}
    </Link>
  );
}
