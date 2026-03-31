import Button from '@/components/ui/Button';
import { Copy, Headline } from '@/ui/Typography';

export default function NotFound() {
  return (
    <section className="section-base-space">
      <div className="surface-elevated flex w-full min-h-[50vh] flex-col items-center justify-center space-y-4 p-6 text-center text-typography sm:p-8">
        <Headline styleAs="h1" color="red">
          404
        </Headline>
        <Headline styleAs="h3">Page not found</Headline>
        <Copy color="gray" className="max-w-md">
          This page could not be found. Check the URL or return to the homepage.
        </Copy>
        <Button label="Go home" href="/" />
      </div>
    </section>
  );
}
