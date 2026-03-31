import { FeaturedArticles } from '@/components/Articles/FeaturedArticles';
import { BreakingNewsBanner } from '@/components/BreakingNews/BreakingNewsBanner';
import { Headline } from '@/ui/Typography';

export default async function Home() {
  return (
    <div className="page-section-stack">
      <div className="home-hero-gradient">
        <div className="home-hero-gradient__bg" aria-hidden />
        <div className="home-hero-gradient__content space-y-4">
          <Headline styleAs="h1">News and insights for modern web developers.</Headline>
          <Headline styleAs="h4">
            Changelogs, engineering deep-dives, customer stories and community updates - all in one
            place.
          </Headline>
        </div>
      </div>
      <BreakingNewsBanner />
      <FeaturedArticles />
    </div>
  );
}
