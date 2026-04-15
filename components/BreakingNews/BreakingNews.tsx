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
import { BreakingNewsTicker } from './BreakingNewsTicker';
import { parseBreakingNews, ParsedBreakingNews } from '@/utils/parseApiData';
import { ImageWithFallback } from '@/components/ui/PlaceholderImg';

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
    'breaking-news-card group flex flex-col overflow-hidden rounded-xl border-2 border-border bg-card text-typography shadow-elevated transition-[border-color,box-shadow] focus-visible:outline-none',
    categoryCardBorderClassName(category),
    categoryLeftBorderClassName(category),
  );

  const breakingNewsCardAnimationStyle = {
    '--breaking-flash-color': categoryFlashBackground(category),
  } as CSSProperties;

  const urgentBadgeStyles = 'rounded-md bg-error px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white';

  const textColumn = (
    <div
      className={cn(
        'relative z-content flex flex-col space-y-4 p-6 sm:p-8',
        breakingNewsImage
          ? 'order-2 min-h-0 lg:order-1 lg:w-[70%] lg:min-w-0 lg:justify-center'
          : 'lg:min-w-0 lg:flex-1',
      )}
    >
      <div className="flex flex-wrap items-center gap-3">
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

      <Headline
        type="h3"
        styleAs="h1"
        className="text-balance leading-tight text-2xl sm:text-3xl md:text-[3.5rem]"
      >
        {headline}
      </Headline>
      {summary ? (
        <Copy size="base" color="gray" className="max-w-3xl leading-relaxed text-base lg:text-lg">
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
        <div className="flex min-h-0 flex-1 flex-col lg:flex-row lg:items-stretch">
          <div className="relative order-1 aspect-3/1 w-full shrink-0 overflow-hidden bg-muted lg:order-2 lg:aspect-auto lg:w-[30%] lg:min-w-0 lg:max-w-[30%] lg:self-stretch lg:min-h-0">
            <ImageWithFallback
              src={breakingNewsImage}
              alt={headline}
              fill
              preload
              loading="eager"
              fetchPriority="high"
              sizes="(max-width: 1023px) 100vw, 30vw"
              className="object-cover transition-transform duration-300 ease-out motion-safe:group-hover:scale-[1.02]"
            />
          </div>
          {textColumn}
        </div>
      ) : (
        textColumn
      )}
      {urgent ? <BreakingNewsTicker /> : null}
    </Link>
  );
}
