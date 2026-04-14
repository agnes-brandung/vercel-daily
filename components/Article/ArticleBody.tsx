import { PublishedDay } from '@/components/PublishedDate';
import { InfoMessage } from '@/components/ui/InfoMessage';
import {
  categoryFlashBackground,
  categoryImageRingClassName,
  categoryLabelClassName,
} from '@/utils/mapCategoryColor';
import { Copy, Headline } from '@/ui/Typography';
import { cn } from '@/utils/cn';

import { ImageWithFallback } from '@/components/ui/PlaceholderImg';
import type { CSSProperties } from 'react';
import { Suspense } from 'react';
import { ArticleContentRte } from './ArticleContentRte';
import { ArticleSubscriptionGate } from './ArticleSubscriptionGate';
import { TrendingArticles } from '@/components/TrendingArticles/TrendingArticles';
import LoadingSkeleton from '@/ui/LoadingSkeleton';
import { ParsedArticle } from '@/utils/parseApiData';

// TODO: handle promises together?
/**
 * Route params and data loading run inside this async child so they stay within `<Suspense>`
 * and do not block the shell from streaming (see Next.js “blocking route” guidance).
 */
export async function ArticleBody({ article }: { article: ParsedArticle }) {
  const { id, category, title, content, publishedAt, excerpt, image, author, categoryLabel, tags } = article;
  const accentStyle = {
    '--article-accent': categoryFlashBackground(category),
  } as CSSProperties;

  return (
    <>
      <section role="region" aria-label="Article body" className="article-page-frame relative overflow-hidden p-6 sm:p-8 md:p-10" style={accentStyle}>
        <header className="space-y-4">
          <Headline styleAs="category" className={categoryLabelClassName(category)}>
            {categoryLabel}
            {tags.length > 0 && (
              <span className="flex flex-wrap items-center gap-2">
                <Copy size="sm" color='gray'>Tags:</Copy>
                {tags.map((tag) => (
                  <Copy key={tag} size="sm" className={categoryLabelClassName(category)} weight="bold">{tag}</Copy>
                ))}
              </span>
            )}
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
            <PublishedDay date={publishedAt} />
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
              key={`image-article-${id}`}
              src={image}
              alt={title}
              fill
              preload
              fetchPriority="high"
              loading="eager"
              sizes="(max-width: 768px) 100vw, min(896px, 92vw)"
              className="object-cover"
            />
          </div>
        </figure>

        <div className="article-content-divider" aria-hidden />
        <Suspense fallback={<LoadingSkeleton type="article" />}>
          <ArticleSubscriptionGate hideUnsubscribe>
            <ArticleContentRte content={content} />
          </ArticleSubscriptionGate>
        </Suspense>
        
      </section>
      <section role="region" aria-label="Trending articles" className="section-base-space">
        <Suspense fallback={
          <InfoMessage type="loading" message="Loading trending articles…">
            <LoadingSkeleton type="card" />
          </InfoMessage>
        }>
          <TrendingArticles excludeArticleId={id} />
        </Suspense>
      </section>
    </>
  );
}
