import { FeaturedArticles } from '@/components/Articles/FeaturedArticles';
import { BreakingNewsBanner } from '@/components/BreakingNews/BreakingNewsBanner';
import { InfoMessage } from '@/components/ui/InfoMessage';
import { Headline } from '@/ui/Typography';
import { Suspense } from 'react';

export default async function Home() {
  /**
   * TODOS:
   * Hero Section:
   * - a visual element (featured story image or illustration).
   * Breaking News Banner: 
   * - make category styles in typography for headlines
   * - Change TextLink for article link
   * - Fix on top of navigation
   * Featured Articles:
   * - Fix hover effect on cards on top of navigation
   */
  return (
    <div className="page-section-stack">
      <div className="space-y-4">
        <Headline styleAs="h1">News and insights for modern web developers.</Headline>
        <Headline styleAs="h4">
          Changelogs, engineering deep-dives, customer stories and community updates - all in one
          place.
        </Headline>
        {/* TODO: add a visual element ...? */}
      </div>

      <Suspense
        fallback={<InfoMessage type="loading" message="Loading breaking news…" />}
      >
        <BreakingNewsBanner />
      </Suspense>

      <Suspense
        fallback={<InfoMessage type="loading" message="Loading articles…" />}
      >
        <FeaturedArticles />
      </Suspense>
    </div>
  );
}
