import { SEARCH_FIRST_RESULTS_MAX } from '@/components/Search/utils/filterArticlesBySearchParams';
import { ArticlesGridItems } from '../Articles/ArticlesGridItems';
import { InfoMessage } from '@/ui/InfoMessage';
import { Headline } from '@/ui/Typography';
import { MoreResults } from './MoreResults';
import { type ParsedArticle } from '@/utils/parseApiData';

type ResultsGridProps = {
  articles: ParsedArticle[];
  headline?: string;
  infoMessage?: string;
};

const ArticlesGridItemsStyles = "w-full shrink-0 sm:w-[calc(50%-0.75rem)] lg:w-[calc((100%-3rem)/3)]";

export function ResultsGrid({ articles, headline, infoMessage }: ResultsGridProps) {
  const hasMoreThanFirstPage = articles.length > SEARCH_FIRST_RESULTS_MAX;
  /** Remount `MoreResults` when the result set changes so expanded state resets. */
  const moreResultsKey = articles.map((article) => article.id).join(',');
  const gridUlClassName = 'flex flex-wrap justify-center gap-6';

  const Grid = (
    <ul className={gridUlClassName}>
      <ArticlesGridItems articles={articles} loadFirstImagesEagerly itemClassName={ArticlesGridItemsStyles} />
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