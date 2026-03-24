import { Suspense } from 'react';

import { CurrentYear } from '@/components/CurrentYear';
import ThemeToggle from '@/ui/ThemeToggle';
import { Copy, Headline } from './ui/Typography';

export default function Footer() {
  return (
    <footer className="bg-body text-typography mt-12 border-t -mx-(--base-pad-x) w-[calc(100%+2*var(--base-pad-x))] px-(--base-pad-x) py-6">
      <div className="mx-auto flex flex-col flex-wrap lg:flex-row  h-full items-center justify-end gap-4">
        <Headline type="p" styleAs="brand" size="sm">The Daily Delivery</Headline>
        <Copy>©&nbsp;
          <Suspense fallback={<span className="inline-block min-w-[4ch] tabular-nums" aria-hidden> </span>}>
            <CurrentYear />
          </Suspense>
          &nbsp;All rights reserved.
        </Copy>
        <ThemeToggle />
      </div>
    </footer>
  );
}