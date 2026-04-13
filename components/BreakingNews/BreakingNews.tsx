import { InfoMessage } from '@/components/ui/InfoMessage';
import { PublishedTime } from '@/components/PublishedDate';
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
import { getArticleById } from '@/lib/server-data/getArticleById';
import { BreakingNewsResult, getBreakingNews } from '@/lib/server-data/getBreakingNews';
import { ReadArticleButton } from '@/components/ReadArticleButton';
import {
  BreakingNewsCardImageBackdrop,
  BREAKING_NEWS_DESKTOP_TEXT_COLUMN_MAX,
} from './BreakingNewsCardImageBackdrop';
import { BreakingNewsTicker } from './BreakingNewsTicker';
import { parseBreakingNews, ParsedBreakingNews } from '@/utils/parseApiData';

// TODO check of parallel promiseAll is the best here https://vercel.com/academy/nextjs-foundations/query-performance-patterns
export async function BreakingNews() {
  const breakingNewsData: BreakingNewsResult = await getBreakingNews();

  if (!breakingNewsData.ok) {
    return <InfoMessage type="error" message={"An error occurred while fetching the breaking news - Please try again later."} />;
  }

  const parsedBreakingNews: ParsedBreakingNews = parseBreakingNews(breakingNewsData.data);
  const { articleId, headline, summary, category, publishedAt, urgent, categoryLabel } = parsedBreakingNews;

  const [articleById] = await Promise.all([
    getArticleById({ articleId }),
  ]);

  if (!articleById.ok) {
    return <InfoMessage type="error" message={"An error occurred while fetching the breaking news - Please try again later."} />;
  }

  const breakingNewsSlug = articleById.data?.slug;
  const breakingNewsImage = articleById.data?.image;

  if (!breakingNewsSlug || !headline) {
    return <InfoMessage type="info" message="No breaking news right now." />;
  }

  const breakingNewsCardContainerStyles = cn(
    'breaking-news-card group block overflow-hidden rounded-xl border-2 border-border bg-card text-typography shadow-elevated transition-[border-color,box-shadow] focus-visible:outline-none',
    categoryCardBorderClassName(category),
    categoryLeftBorderClassName(category),
  );

  const breakingNewsCardAnimationStyle = {
    '--breaking-flash-color': categoryFlashBackground(category),
  } as CSSProperties;

  const urgentBadgeStyles = 'rounded-md bg-error px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white';

  /** With image: mobile = text in lower band under clear photo (vertical mirror of desktop); desktop unchanged. */
  const textBlockWithImageStyles = cn(
    'flex min-h-96 flex-col sm:min-h-104 lg:w-[80%]',
    'max-lg:justify-start max-lg:pt-50',
    `lg:${BREAKING_NEWS_DESKTOP_TEXT_COLUMN_MAX}`,
    'lg:min-h-76 lg:flex-none lg:justify-center lg:pr-4 xl:pr-8',
  );

  const textBlock = (
    <div
      role="marquee"
      className={cn(
        'relative z-content space-y-4 p-6 sm:p-8',
        breakingNewsImage ? textBlockWithImageStyles : 'lg:flex-1 lg:min-w-0 lg:order-1',
      )}
    >
      <div
        className={cn(
          'flex flex-wrap items-center gap-3',
          breakingNewsImage ? 'max-lg:pt-6' : null,
        )}
      >
        {urgent ? (
          <span className={urgentBadgeStyles}>Urgent</span>
        ) : null}
        <Headline styleAs="category" className={categoryLabelClassName(category)}>
          {categoryLabel}
        </Headline>
        <Suspense fallback={<Copy size="sm" color="lightGray">Loading date…</Copy>}>
          <PublishedTime date={publishedAt} />
        </Suspense>
      </div>

      <Headline type="h3" styleAs="h1" className="text-balance leading-tight">
        {headline}
      </Headline>
      {summary ? (
        <Copy size="lg" color="gray" className="max-w-3xl leading-relaxed">
          {summary}
        </Copy>
      ) : null}
      <ReadArticleButton />
    </div>
  );

  return (
    <Link
      href={`/articles/${breakingNewsSlug}`}
      className={breakingNewsCardContainerStyles}
      style={breakingNewsCardAnimationStyle}
    >
      {breakingNewsImage ? (
        <BreakingNewsCardImageBackdrop imageSrc={breakingNewsImage} imageAlt={headline}>
          {textBlock}
        </BreakingNewsCardImageBackdrop>
      ) : (
        textBlock
      )}
      {urgent ? <BreakingNewsTicker /> : null}
    </Link>
  );
}
