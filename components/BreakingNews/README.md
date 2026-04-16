# Breaking news

This slice is the **“one big story”** strip on the home page: headline, summary, optional ticker, and a card that can pull extra detail from the article API.

## What lives here

- `**BreakingNewsBanner.tsx`** — Static section title + `Suspense` around the async payload. Same pattern as featured articles: **show the frame immediately**, stream the data when ready.
- `**BreakingNews.tsx`** — Async server component: loads breaking-news metadata, then loads the **linked full article** (slug, hero image) when that id is present.
- `**BreakingNewsTicker.tsx`** — Urgent-only marquee strip under the card.

The breaking-news **card** uses a plain split layout: image on top (mobile), text ~70% + image ~30% on the right (desktop)—no full-bleed backdrop or scrims.

## Architectural decisions

Breaking news is **visually prominent** but **not** required for the rest of the page to make sense. Putting only the data-heavy tree inside `Suspense` keeps the home hero and other sections from waiting on the newsroom API.

We keep **fetching in the server component** that owns the UI so errors map cleanly to `InfoMessage` without a client-side loading spinner for the initial HTML.

## Related code

- `lib/server-data/getBreakingNews.ts`, `getArticle.ts`

