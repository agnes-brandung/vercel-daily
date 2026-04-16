import { Headline } from '@/components/ui/Typography';

export default function ArticlesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section id="articles-catalog" className="section-base-space">
      <header className="space-y-1">
        <Headline styleAs="h1">All developer news under one roof</Headline>
        <Headline type="h2" styleAs="h4">
          Changelogs, engineering deep-dives, customer stories and community updates - all in one
          place.
        </Headline>      
      </header>
      {children}
    </section>
  );
}
