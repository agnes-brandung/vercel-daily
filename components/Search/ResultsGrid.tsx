import { SEARCH_FIRST_RESULTS_MAX } from '@/utils/filterArticlesBySearchParams';
import { ArticlesGrid } from '../Articles/ArticlesGrid';
import { InfoMessage } from '@/ui/InfoMessage';
import { Headline } from '@/ui/Typography';
import { MoreResults } from './MoreResults';
import { type ParsedArticle } from '@/utils/parseApiData';

type ResultsGridProps = {
  articles: ParsedArticle[];
  headline?: string;
  infoMessage?: string;
};

const articlesGridStyles = "w-full shrink-0 sm:w-[calc(50%-0.75rem)] lg:w-[calc((100%-3rem)/3)]";

export function ResultsGrid({ articles, headline, infoMessage }: ResultsGridProps) {
  const hasMoreThanFirstPage = articles.length > SEARCH_FIRST_RESULTS_MAX;
  /** Remount `MoreResults` when the result set changes so expanded state resets. */
  const moreResultsKey = articles.map((article) => article.id).join(',');
  const gridUlClassName = 'flex flex-wrap justify-center gap-6';

  const Grid = (
    <ul className={gridUlClassName}>
      <ArticlesGrid articles={articles} itemClassName={articlesGridStyles} />
    </ul>
  );

  return (
    <div className="space-y-4">
      {infoMessage && <InfoMessage type="info" message={infoMessage} />}
      {headline && <Headline type="h5">{headline}</Headline>}
      {hasMoreThanFirstPage ? (
        <MoreResults key={moreResultsKey}>{Grid}</MoreResults>
      ) : (
        Grid
      )}
    </div>
  );
}