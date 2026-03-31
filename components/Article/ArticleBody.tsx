import PublishedDate from '@/components/PublishedDate';
import { getArticles } from '@/app/api/getArticles';
import { InfoMessage } from '@/components/ui/InfoMessage';
import {
  categoryFlashBackground,
  categoryImageRingClassName,
  categoryLabelClassName,
} from '@/utils/mapCategoryColor';
import { Copy, Headline } from '@/ui/Typography';
import { cn } from '@/utils/cn';
import { notFound } from 'next/navigation';
import type { CSSProperties } from 'react';
import { Suspense } from 'react';
import { ArticleContentRte } from './ArticleContentRte';
import { ArticleSubscriptionGate } from './ArticleSubscriptionGate';
import { parseArticle } from '@/utils/parseApiData';
import { getSubscriptionStatus } from '@/lib/subscription';
import { TrendingArticles } from '../TrendingArticles/TrendingArticles';
import LoadingSkeleton from '../ui/LoadingSkeleton';

// TODO: handle promises together?
/**
 * Route params and data loading run inside this async child so they stay within `<Suspense>`
 * and do not block the shell from streaming (see Next.js “blocking route” guidance).
 */
export async function ArticleBody({ slug }: { slug: string }) {
  const allArticles = await getArticles();

  if (!allArticles.ok) {
    return (
      <InfoMessage type="error" message="An error occurred while fetching the articles — try again later." />
    );
  }

  const article = allArticles.data.find((a) => a.slug === slug);
  if (!article) {
    notFound();
  }

  const parsedArticle = parseArticle(article);
  const { id, category, title, publishedAt, excerpt, image, author, categoryLabel } = parsedArticle;

  // Pages using isSubscribed (with cookies()) becomes dynamic (no prerendering)
  const { isActive, hasToken } = await getSubscriptionStatus();

  const accentStyle = {
    '--article-accent': categoryFlashBackground(category),
  } as CSSProperties;

  return (
    <>
      <div className="article-page-frame relative overflow-hidden p-6 sm:p-8 md:p-10" style={accentStyle}>
        <header className="space-y-4">
          <Headline styleAs="category" className={categoryLabelClassName(category)}>
            {categoryLabel}
          </Headline>
          <Headline styleAs="h1" className="article-title-accent text-balance leading-tight">
            {title}
          </Headline>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <div className="flex flex-wrap items-center gap-3">
              {author.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element -- external URLs; skip Image remotePatterns
                <img
                  src={author.avatar}
                  alt="Author avatar"
                  className="h-10 w-10 shrink-0 border border-border object-cover ring-2 ring-[color-mix(in_srgb,var(--article-accent)_35%,transparent)] ring-offset-2 ring-offset-card"
                />
              ) : null}
              <Copy weight="bold" className={categoryLabelClassName(category)}>{author.name}</Copy>
            </div>
            <Suspense fallback={<Copy size="sm" color="lightGray">Loading date…</Copy>}>
              <PublishedDate date={publishedAt} />
            </Suspense>
          </div>
          {excerpt ? (
            <Copy color="gray" size="lg" className="max-w-prose leading-relaxed">
              {excerpt}
            </Copy>
          ) : null}
        </header>

        <figure
          className={cn(
            'article-hero-figure mt-8 overflow-hidden border border-border bg-muted shadow-elevated',
            categoryImageRingClassName(category),
          )}
        >
          <div className="aspect-16/10 w-full overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element -- external URLs; skip Image remotePatterns */}
            <img src={image} alt={title} className="h-full w-full object-cover" />
          </div>
        </figure>

        <div className="article-content-divider" aria-hidden />
        {/** // TODO: maybe this is the issue with the dynamic page? */}
        <ArticleSubscriptionGate isActive={isActive} hasToken={hasToken}>
          <ArticleContentRte content={parsedArticle.content} />
        </ArticleSubscriptionGate>
      </div>
      <Suspense fallback={
        <>
          <InfoMessage type="loading" message="Loading trending articles…">
            <LoadingSkeleton type="card" />
          </InfoMessage>
        </>
      }>
        <TrendingArticles excludeArticleId={id} />
      </Suspense>
    </>
  );
}
