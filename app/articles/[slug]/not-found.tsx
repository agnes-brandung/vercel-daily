import Button from '@/components/ui/Button';
import { Copy, Headline } from '@/ui/Typography';

/** Shown when `notFound()` is called from the article route (unknown slug). */
export default function ArticleNotFound() {
  return (
    <section className="section-base-space">
      <div className="surface-elevated flex w-full min-h-[50vh] flex-col items-center justify-center space-y-5 p-6 text-center text-typography sm:p-8 md:space-y-6">
        <div className="space-y-2">
          <Headline styleAs="h1" color="red">
            404
          </Headline>
          <Headline styleAs="h3">Article not found</Headline>
        </div>
        <Copy color="gray" className="max-w-md">
          We couldn&apos;t find an article at this address. It may have been moved or removed.
        </Copy>
        <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:justify-center">
          <Button label="Browse articles" href="/articles" fullWidth className="sm:w-auto" />
          <Button variant="secondary" label="Go home" href="/" fullWidth className="sm:w-auto" />
        </div>
      </div>
    </section>
  );
}
