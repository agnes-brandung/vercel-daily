# Trending articles

A **sidebar-style block** of small cards (“Trending now”), usually shown under an article or in contexts where you want related reading—not the full catalog.

## What lives here

- **`TrendingArticles.tsx`** — Wrapper with heading + `Suspense` + skeleton fallback. It does **not** fetch; it only defines **where** streaming starts so the parent page stays simple.
- **`TrendingArticlesList.tsx`** — Async server component: calls `getTrendingArticles()` (optionally excluding the current article id), maps to a responsive grid of links with images and dates.

## Architectural decisions

**Same Suspense recipe as Featured / Breaking news:** keep static chrome outside, wrap the async list inside `Suspense` so slow API work does not delay unrelated parts of the page ([streaming](https://vercel.com/academy/nextjs-foundations/suspense-and-streaming)).

**Exclude current article:** The optional `excludeArticleId` prop avoids recommending the story you are already reading—logic stays in the data call, presentation stays dumb.

**All server for the list:** No client JS required to render trending cards; `PublishedDay` still handles its own caching/streaming internally.

## Related

- `lib/server-data/getTrendingArticles.ts`
- Used from `ArticleBody` (and anywhere else you import `TrendingArticles`)
