# The Vercel Daily

A small editorial site that surfaces **Vercel news, changelogs, engineering deep-dives, customer stories and community updates** behind a single, fast UI. Built as a hands-on playground for **Next.js 16.2 with Cache Components**.

- **Home** — hero + breaking news ticker + featured articles grid.
- **Articles catalog** (`/articles`) — full catalog grouped by category.
- **Article detail** (`/articles/[slug]`) — article body, breadcrumbs, trending sidebar; preview is gated behind a (mock) subscription.
- **Search** (`/search`) — client-driven filtering of the cached article list by term + categories.
- **Subscription** (`/subscription`) — server-action driven activate / deactivate flow keyed by a cookie token.

The remote news/subscription APIs are accessed through a thin HTTP layer; everything else (parsing, caching, page rendering) is local Next.js work.

---

## Tech stack

- **Next.js 16.2** (App Router, Turbopack, Cache Components enabled).
- **React 19.2** with the React Compiler (`babel-plugin-react-compiler`).
- **TypeScript 5**, strict mode.
- **Tailwind CSS v4** + a few headless primitives (`radix-ui`, `vaul`, `lucide-react`).
- **shadcn**-style local primitives under `components/ui/lib`, themed via `next-themes`.
- **Vercel Analytics** + **Speed Insights**.

Scripts:

```bash
npm run dev     # next dev (Turbopack)
npm run build   # next build
npm run start   # next start (after build)
npm run lint    # eslint
```

---

## Folder layout

```text
app/                Routes (App Router), Server Actions, error/not-found, layout, globals.css
  actions/          'use server' mutations (subscription) + revalidateTag
  articles/         /articles + /articles/[slug] (with generateStaticParams + generateMetadata)
  search/           /search (server shell + client filter)
  subscription/     subscription page

components/         Server-first components; 'use client' only where needed
  Article/          Single-article body, RTE, subscription gate
  Articles/         Lists, grids, catalog (server-rendered)
  BreakingNews/     Banner + ticker
  Navigation/       Desktop + mobile nav
  Search/           Server shell + client interactive controls
  Subscription/     Subscribe/unsubscribe button (uses useFormStatus)
  TrendingArticles/ Sidebar list
  ui/               Local primitives (Button, Breadcrumb, Typography, icons, themed shadcn)

lib/
  api/              Outbound HTTP only — no React, no caching
  server-data/      Cached reads ('use cache' + cacheLife + cacheTag)
  fonts/            next/font setup
  og/               OG image fallbacks for metadata

utils/              Pure helpers (parseApiData, mapCategoryColor, cn, …)
styles/components/  Per-feature CSS (article frame gradient, navigation, …)
```



---

## Architectural decisions

### 1. Three-layer data flow (reads vs writes)

```text
┌────────────────────────┐   reads     ┌────────────────────────┐    HTTP    ┌──────────────┐
│  Server Components,    │ ──────────► │  lib/server-data       │ ─────────► │  lib/api     │ ──► remote APIs
│  generateMetadata,     │             │  ('use cache' here)    │            │  (no React,  │
│  generateStaticParams  │             │                        │            │   no cache)  │
└────────────────────────┘             └────────────────────────┘            └──────────────┘
            │                                       ▲
            │ writes                                │  revalidateTag
            ▼                                       │
       ┌──────────────────────────┐                 │
       │  app/actions ('use server')               │
       │  cookies() + lib/api + revalidateTag ─────┘
       └──────────────────────────┘
```

- `**lib/api**` is the only place that calls `fetch` against the external news/subscription backends. It returns `{ ok, data } | { ok, error }`, knows nothing about React or caching.
- `**lib/server-data**` composes those clients into **domain reads** (`getArticles`, `getArticle`, `getBreakingNews`, `getTrendingArticles`, `getCategories`, `getSubscriptionStatus`). This is the **single layer that owns cache rules** (`'use cache'`, `cacheLife`, `cacheTag`).
- `**app/actions`** holds `'use server'` mutations. They orchestrate `lib/api` writes, set/clear cookies, then `revalidateTag(...)` so the cached reads above see fresh data.

### 2. Server-first components

- All components default to **Server Components**. `'use client'` is added only where there is real browser need: theme toggle, mobile nav drawer, search controls, subscription form (`useFormStatus`), error boundaries, scroll restoration.
- Lists, grids and the article body are server components — no client JS shipped for the catalog.
- Client wrappers receive Server Component **children** when interactivity needs to wrap server-rendered content (see Vercel Academy: [Server and Client Components](https://vercel.com/academy/nextjs-foundations/server-and-client-components)).

### 3. Static-by-default routing

- `cacheComponents: true` in `next.config.ts` enables Next 16’s “everything prerenders” model.
- `app/articles/[slug]/page.tsx` declares `generateStaticParams()` (dedup over `getArticles().allArticles[].slug`) so every known article is **prerendered at build time**, while `dynamicParams` stays at the default (`true`) for slugs published later. See [Next.js dynamic routes](https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes#with-generatestaticparams).

### 4. Dynamic metadata, done from the server data layer

`generateMetadata` reads through the **same cached function** as the page (`getArticle(slug)`) — no relative `fetch`, no duplicated request, and the open-graph payload reflects fetch outcome (error / not-found / article). `metadataBase` is resolved from `NEXT_PUBLIC_BASE_URL` → `VERCEL_URL` → `localhost:3000` in `app/layout.tsx`, so OG/Twitter images always serialize as absolute URLs (per Vercel Academy: [Dynamic Metadata Done Right](https://vercel.com/academy/nextjs-foundations/dynamic-metadata-done-right)).

### 5. Suspense + streaming for slow holes only

Following Vercel Academy: [Suspense and Streaming](https://vercel.com/academy/nextjs-foundations/suspense-and-streaming):

- The **route shell** (header, layout, footer, breadcrumbs) prerenders.
- Slow areas — featured grid, article body, trending sidebar, search results — sit inside their own `<Suspense>` boundaries with **skeleton-shaped** fallbacks (`LoadingSkeleton`, `InfoMessage`).
- Boundaries are deliberately shallow (2–3 per route) to avoid “spinner soup”.

---

## Cache Components — how this app uses Next.js 16.2

### `next.config.ts` — opt in + named profiles

```ts
const nextConfig: NextConfig = {
  cacheComponents: true,
  cacheLife: {
    articles:     { stale: 300,  revalidate: 900,  expire: 3600     }, // 5m / 15m / 1h
    trending:     { stale: 600,  revalidate: 1800, expire: 3 * 3600 }, // 10m / 30m / 3h
    breakingNews: { stale: 30,   revalidate: 60,   expire: 120      }, // 30s / 1m / 2m
  },
  // … turbopack, images, logging, output: 'standalone'
};
```

Three custom profiles cover the three editorial tempos in the app: **catalog** (slow), **trending** (medium), **breaking news** (fast). Built-ins (`'days'`, `'hours'`, …) are also used (e.g. `cacheLife('days')` for subscription status).

### `'use cache'` placed on the read layer

Cached reads live in `lib/server-data/`*. Each one declares its **profile** and a **tag** for invalidation:

- `getArticles()` → `cacheLife('articles')` + `cacheTag('articles')`
- `getTrendingArticles()` → `cacheLife('trending')` + `cacheTag('trending-articles')`
- `getBreakingNews()` → `cacheLife('breakingNews')` + `cacheTag('breaking-news')`
- `getArticle(slugOrId)` → `cacheLife('articles')` + `cacheTag('articles', 'article:<key>')`
- `getCategories()` → longer profile (categories rarely change)
- `getSubscriptionStatus()` → see below (cookie-aware)

This matches the rule from Vercel Academy: [Cache Components for Instant and Fresh Pages](https://vercel.com/academy/nextjs-foundations/cache-components):

> `"use cache"` caches the **return value** of async functions — pair it with `cacheLife()` for time and `cacheTag()` for invalidation.

### Dynamic APIs stay **outside** the cache

`getSubscriptionStatus()` shows the canonical pattern: `cookies()` is awaited **outside** the cached function, and the resolved token is passed as a serializable argument so the inner `'use cache'` function can be safely cached per token:

```ts
async function getSubscriptionStatusByToken(token: string) {
  'use cache';
  cacheLife('days');
  cacheTag(subscriptionTag(token));
  // … fetch + parse
}

export async function getSubscriptionStatus() {
  const token = await readSubscriptionTokenFromCookie(); // dynamic, OUTSIDE cache
  if (!token) return { isActive: false, hasToken: false };
  return getSubscriptionStatusByToken(token);
}
```

Keeping `cookies()`, `headers()` and `searchParams` outside `'use cache'` is required: dynamic APIs inside a cached scope throw at build/run time.

### Tag-based invalidation from Server Actions

`app/actions/subscription.ts` performs the write, then invalidates the **per-token** cache tag with the Next 16 two-argument form:

```ts
'use server';
revalidateTag(subscriptionTag(tokenResponse.token), 'max'); // stale-while-revalidate
```

`'max'` marks the cache stale and serves the previous value while the revalidation runs in the background — UI updates feel instant, the next request gets fresh data.

### Partial prerendering in practice

Per route, the static shell renders immediately and dynamic holes stream in:

- **Home** (`app/page.tsx`) — static hero; `BreakingNewsBanner` and `FeaturedArticles` resolve cached reads, each behind its own `Suspense`.
- **Articles catalog** (`/articles`) — static page chrome + Suspense around the catalog server component that calls `getArticles()`.
- **Article detail** (`/articles/[slug]`) — prerendered for known slugs via `generateStaticParams`; runtime path used for new slugs. Body and trending sidebar each have their own Suspense fallback.
- **Search** (`/search`) — server shell with `<SearchBar>` (categories from `getCategories`) and `<SearchResults>` (cached `getArticleMethods` + filter), each suspended; the actual filter UI is a small Client Component that drives URL state.
- **Subscription gate** — the article body inside `ArticleSubscriptionGate` is preview-faded (CSS mask) until `getSubscriptionStatus()` reports `isActive`.

### What is intentionally NOT cached

- Anything that depends on `cookies()` directly in the page (the subscription gate reads cookies on every request, but only the **derived status** is cached per token).
- Server Actions — they are mutations, not reads.
- Search filtering itself — it is a pure function over a cached list, so the cost is negligible without an extra cache layer.

---

## References

- Vercel Academy — [Cache Components for Instant and Fresh Pages](https://vercel.com/academy/nextjs-foundations/cache-components)
- Vercel Academy — [Suspense and Streaming](https://vercel.com/academy/nextjs-foundations/suspense-and-streaming)
- Vercel Academy — [Server and Client Components](https://vercel.com/academy/nextjs-foundations/server-and-client-components)
- Vercel Academy — [Dynamic Metadata Done Right](https://vercel.com/academy/nextjs-foundations/dynamic-metadata-done-right)
- Next.js — `[use cache](https://nextjs.org/docs/app/api-reference/directives/use-cache)`, `[cacheLife](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheLife)`, `[revalidateTag](https://nextjs.org/docs/app/api-reference/functions/revalidateTag)`, [Dynamic Routes](https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes)

