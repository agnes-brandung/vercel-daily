import { FeaturedArticles } from '@/components/Articles/FeaturedArticles';
import { BreakingNewsBanner } from '@/components/BreakingNews/BreakingNewsBanner';
import { HeroGradient } from '@/components/ui/HeroGradient';
import { Headline } from '@/ui/Typography';

export default async function Home() {
  return (
    <div className="section-base-space">
      <HeroGradient>
        <Headline styleAs="h1">News and insights for modern web developers.</Headline>
        <Headline styleAs="h4">
          Changelogs, engineering deep-dives, customer stories and community updates - all in one
          place.
        </Headline>
      </HeroGradient>
      <BreakingNewsBanner />
      <FeaturedArticles />
    </div>
  );
}
