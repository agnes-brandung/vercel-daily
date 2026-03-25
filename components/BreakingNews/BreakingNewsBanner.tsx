import { InfoMessage } from '@/components/ui/InfoMessage';
import PublishedDate from '@/components/PublishedDate';
import {
  categoryCardBorderClassName,
  categoryFlashBackground,
  categoryLabelClassName,
  categoryLeftBorderClassName,
} from '@/utils/mapCategoryColor';
import { Copy, Headline, TextLink } from '@/ui/Typography';
import { cn } from '@/utils/cn';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { Suspense } from 'react';
import { getBreakingNews } from './getBreakingNews';
import { ArrowRightIcon } from '../ui/icons/arrow-right';

export async function BreakingNewsBanner() {
  const data = await getBreakingNews();

  if (!data.ok) {
    return <InfoMessage type="error" message={data.error} />;
  }

  const { articleId, headline, summary, category, publishedAt, urgent } = data.breakingNews;

  if (!headline?.trim()) {
    return <InfoMessage type="info" message="No breaking news right now." />;
  }

  const categoryLabel = category.replace(/-/g, ' ');

  return (
    <section className="section-base-space">
      <header className="space-y-1">
        <Headline styleAs="h2">Breaking news</Headline>
        <Headline styleAs="h5">Latest update from the newsroom</Headline>
      </header>

      <Link
        href={`/articles/${articleId}`}
        className={cn(
          'breaking-news-card group block overflow-hidden rounded-xl border-2 border-border bg-card text-typography shadow-nav transition-[border-color,box-shadow] focus-visible:outline-none focus-visible:ring-2',
          categoryCardBorderClassName(category),
          categoryLeftBorderClassName(category),
        )}
        style={
          {
            '--breaking-flash-color': categoryFlashBackground(category),
          } as CSSProperties
        }
      >
        {/** TODO Uncaught Error: Hydration failed */}
        <div className="breaking-news-card-inner space-y-4 p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-3">
            {urgent ? (
              <span className="rounded-md bg-error px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white">
                Urgent
              </span>
            ) : null}
            <Copy
              size="sm"
              className={cn(
                'mb-0! font-semibold uppercase tracking-wide',
                categoryLabelClassName(category),
              )}
            >
              {categoryLabel}
            </Copy>
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
          <TextLink href={`/articles/${articleId}`}>Read full story <ArrowRightIcon className="inline-flex items-center transition-transform group-hover:translate-x-0.5"/></TextLink>
        </div>
      </Link>
    </section>
  );
}
