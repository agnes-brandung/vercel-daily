import { FeaturedArticles } from '@/components/Articles/FeaturedArticles';
import { BreakingNewsBanner } from '@/components/BreakingNews/BreakingNewsBanner';
import { Headline } from '@/ui/Typography';

export default async function Home() {
  /**
   * TODOS:
   * Hero Section:
   * - a visual element (featured story image or illustration).
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
      <BreakingNewsBanner />
      <FeaturedArticles />
    </div>
  );
}
