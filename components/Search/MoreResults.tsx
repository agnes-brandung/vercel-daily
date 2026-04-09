'use client';

import { type ReactNode, useId, useState } from 'react';

import Button from '@/components/ui/Button';
import { SEARCH_FIRST_RESULTS_MAX } from '@/components/Search/utils/filterArticlesBySearchParams';

type MoreResultsProps = {
  children: ReactNode;
  reset?: () => void;
}

/**
 * One server-rendered grid (`ArticlesGrid` with all items). Collapsed state hides list items after
 * {@link SEARCH_FIRST_RESULTS_MAX} via scoped CSS; expand is client-only and sticky.
 */
export function MoreResults({ children, reset }: MoreResultsProps) {
  const [showRest, setShowRest] = useState(false);
  const scopeClass = `more-results-scope-${useId().replace(/:/g, '')}`;
  const nthStart = SEARCH_FIRST_RESULTS_MAX + 1;

  function handleReset() {
    setShowRest(false);
    reset?.();
  }

  return (
    <div className="space-y-4">
      {!showRest ? (
        <style>{`.${scopeClass} > ul > li:nth-child(n+${nthStart}) { display: none !important; }`}</style>
      ) : null}
      <div className={!showRest ? scopeClass : undefined}>{children}</div>
      {!showRest ? (
        <div className="flex justify-center pt-2">
          <Button variant="tertiary" label="View more results" onClick={() => setShowRest(true)} />
        </div>
      ) : null}
    </div>
  );
}
