export default function ArticleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <article className="mx-auto max-w-7xl py-block space-y-12">
      {children}
    </article>
  );
}
