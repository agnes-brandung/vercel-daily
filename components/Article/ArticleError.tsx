import Button from '@/components/ui/Button';
import { Copy, Headline } from '@/ui/Typography';

type ArticleErrorProps = {
  headline: string;
  subline?: string;
  description: string;
  reset?: () => void;
};

/** Shown when not found or an error occurs while loading an article. */
export default function ArticleError({ headline, subline, description, reset }: ArticleErrorProps) {
  return (
    <section className="section-base-space">
      <div className="surface-elevated flex w-full min-h-[50vh] flex-col items-center justify-center space-y-5 p-6 text-center text-typography sm:p-8 md:space-y-6">
        <div className="space-y-2">
          <Headline styleAs="h1" color="red">
            {headline}
          </Headline>
          {subline ? <Headline styleAs="h3">{subline}</Headline> : null}
        </div>
        <Copy color="gray" className="max-w-md">
          {description}
        </Copy>
        <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:justify-center">
          {reset ? <Button type="button" onClick={reset} label="Try again" /> : null}
          <Button label="Browse articles" href="/articles" fullWidth className="sm:w-auto" />
          <Button variant="secondary" label="Go home" href="/" fullWidth className="sm:w-auto" />
        </div>
      </div>
    </section>
  );
}
