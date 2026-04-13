# Articles (lists & grids)

This folder is for **listing** articles: home featured grid, shared card markup, and the full **by-category catalog**. It is all **server-first**—no `'use client'` here. Buttons and links are still interactive because Next ships minimal JS for those primitives; we do not pull whole trees into the client bundle unnecessarily.

## Files (rough top-to-bottom flow)


| File                       | What it does                                                                                                                                     |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `FeaturedArticles.tsx`     | Section shell for the home page: title copy, `**Suspense`** around the grid, skeleton fallback, then “View all” as a regular link button.        |
| `FeaturedArticlesGrid.tsx` | **Async** piece that calls `getArticleMethods()`, handles errors/empty states, outputs the `<ul>` of cards.                                      |
| `ArticlesGridItems.tsx`    | Maps `ParsedArticle[]` to card `<li>`s (image, title, category, date). Optional eager loading for the first rows when LCP matters (e.g. search). |
| `ArticlesCatalog.tsx`      | **Async** full catalog: one `getArticleMethods()` pass, sections per category, thumbnails, a few **prefetch** hints for the first images.        |


## Architecture choices

- **Default to Server Components** — Data and HTML for lists stay on the server; we only add client components elsewhere when we need hooks or browser-only APIs ([Academy: boundaries](https://vercel.com/academy/nextjs-foundations/client-server-boundaries)).
- **Fetch next to the list** — `FeaturedArticlesGrid` and `ArticlesCatalog` call the loader themselves instead of the parent page doing one giant fetch and passing props through five layers. Easier to read, easier to cache.
- **Suspense where it hurts** — Slow work sits inside `Suspense` with **skeleton-shaped** fallbacks so we do not flash a dozen spinners ([Academy: streaming](https://vercel.com/academy/nextjs-foundations/suspense-and-streaming)).
- **One cached loader** — `getArticleMethods` is cached (`"use cache"` + `cacheLife` in `lib/server-data/getArticlesMethods.ts`), so metadata + page can reuse work in the same request when the runtime allows it ([parallel + cache mindset](https://vercel.com/academy/nextjs-foundations/data-fetching-without-waterfalls)).

## Related code

- `lib/server-data/getArticlesMethods.ts`, `lib/api/fetchNewsApi.ts`
- `utils/parseApiData.ts`, `types/api.d.ts`
- `utils/mapCategoryColor.ts`

