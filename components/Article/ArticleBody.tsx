import PublishedDate from '@/components/PublishedDate';
import { getArticleMethods } from '@/app/api/getArticlesMethods';
import { InfoMessage } from '@/components/ui/InfoMessage';
import {
  categoryFlashBackground,
  categoryImageRingClassName,
  categoryLabelClassName,
} from '@/utils/mapCategoryColor';
import { Copy, Headline } from '@/ui/Typography';
import { cn } from '@/utils/cn';
import { notFound } from 'next/navigation';

import { ImageWithFallback } from '@/components/ui/PlaceholderImg';
import type { CSSProperties } from 'react';
import { Suspense } from 'react';
import { ArticleContentRte } from './ArticleContentRte';
import { ArticleSubscriptionGate } from './ArticleSubscriptionGate';
import { getSubscriptionStatus } from '@/app/api/getSubscriptionStatus';
import { TrendingArticles } from '../TrendingArticles/TrendingArticles';
import LoadingSkeleton from '../ui/LoadingSkeleton';

// TODO: handle promises together?
/**
 * Route params and data loading run inside this async child so they stay within `<Suspense>`
 * and do not block the shell from streaming (see Next.js “blocking route” guidance).
 */
export async function ArticleBody({ slug }: { slug: string }) {
  const articlesResult = await getArticleMethods();
  if (!articlesResult.ok) {
    return <InfoMessage type="error" message="An error occurred while fetching the articles - try again later." />;
  }
  const { allArticles } = articlesResult.data;

  if (allArticles.length === 0) {
    return (
      <InfoMessage type="info" message="No articles available yet." />
    );
  }

  const article = allArticles.find((a) => a.slug === slug);
  if (!article) {
    notFound();
  }

  const { id, category, title, publishedAt, excerpt, image, author, categoryLabel } = article;

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
                <ImageWithFallback
                  src={author.avatar}
                  alt="Author avatar"
                  width={40}
                  height={40}
                  sizes="40px"
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
          <div className="relative aspect-16/10 w-full overflow-hidden">
            <ImageWithFallback
              src={image}
              alt={title}
              fill
              preload
              loading="eager"
              sizes="(max-width: 768px) 100vw, min(896px, 92vw)"
              className="object-cover"
            />
          </div>
        </figure>

        <div className="article-content-divider" aria-hidden />
        <ArticleSubscriptionGate isActive={isActive} hasToken={hasToken} hideUnsubscribe>
          <ArticleContentRte content={article.content} />
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
