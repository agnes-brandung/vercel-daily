import { Headline } from '@/components/ui/Typography';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All developer news under one roof",
  description: "Read all articles from The Vercel Daily. Changelogs, engineering deep-dives, customer stories and community updates - all in one place.",
};

export default function ArticlesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="section-base-space">
    <header className="space-y-1">
      <Headline styleAs="h1">All developer news under one roof</Headline>
      <Headline styleAs="h4">
        Changelogs, engineering deep-dives, customer stories and community updates - all in one
        place.
      </Headline>      
    </header>
    {children}
  </section>
  );
}
