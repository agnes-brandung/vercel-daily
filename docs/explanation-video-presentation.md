# The Vercel Daily — Explanation video (~60 min)

**Purpose:** Script and slide outline for a certification-style walkthrough: how the site was built and why, with emphasis on React Server Components, `"use cache"`, Suspense, Server Actions, and request-level access control (`proxy` + API bypass headers).

**Assignment:** [Vercel Daily News certification](https://vercel-certification-assignments.vercel.app/vercel-daily-news) (open when authenticated).

---

## Timing cheat sheet (~60 min)


| Block                              | Minutes |
| ---------------------------------- | ------- |
| Intro + goals                      | 5       |
| Product tour                       | 6       |
| Architecture                       | 8       |
| `"use cache"` / `cacheLife` / tags | 14      |
| Suspense / streaming               | 10      |
| Server Actions + forms             | 9       |
| Search client/server split         | 5       |
| Proxy + API protection + cookies   | 8       |
| Tradeoffs (OG, errors, a11y)       | 5       |
| Live demo + buffer                 | 10      |


---

## Part 1 — Opening (3–5 min)

### Slide: Title

**The Vercel Daily** — Next.js App Router, server-first news UI, subscription gate, protected upstream API.

### Slide: What you will prove

- Correct layering: `lib/api` (HTTP) vs `lib/server-data` (parse, group, cache).
- Explicit caching: `cacheComponents` + `"use cache"` + `cacheLife` + `cacheTag` / `revalidateTag`.
- Streaming: Suspense boundaries aligned to layout and shaped fallbacks.
- Mutations: Server Actions, cookies, progressive enhancement, a11y-friendly pending states.
- Security: incoming hardening in `proxy.ts`; outgoing `x-vercel-protection-bypass` only on the server; HttpOnly subscription cookie.

### Slide: Stack anchor

- Next.js App Router (e.g. 16.x), TypeScript, Tailwind, remote API `https://vercel-daily-news-api.vercel.app/api` (`lib/api/const.ts`).

---

## Part 2 — Product tour (5–7 min)

Walk `app/` as user journeys:


| Route              | Role                                                                         |
| ------------------ | ---------------------------------------------------------------------------- |
| `/`                | Hero + **Breaking news** (Suspense) + **Featured** grid (Suspense).          |
| `/articles`        | Full catalog; `generateMetadata` can reflect data/errors.                    |
| `/articles/[slug]` | Article detail; outer Suspense; subscription gate on body; trending section. |
| `/search`          | URL-driven: server `SearchResults` + client `SearchClient`.                  |
| `/subscription`    | Async subscription status + `SubscriptionButton` (Server Actions).           |


**Talking point:** Default to **Server Components**; `'use client'` only for hooks, URL sync, drawer state, form status.

---

## Part 3 — Architecture (6–8 min)

### Slide: Data flow (three layers)

1. `**lib/api`** — Plain `fetch`, result types (`ok` / `error`), no React, no `"use cache"`. Example: `fetchNewsApi`, subscription client in `lib/api/subscription/fetchSubscriptionApi.ts`.
2. `**lib/server-data**` — Domain reads: parse/map, `**"use cache"**`, `**cacheLife**`, `**cacheTag**` where needed.
3. `**app/actions**` — `**'use server'**`: cookies, upstream mutations, `**revalidateTag**`.

```text
Browser → RSC (Server Components) → lib/server-data → lib/api → News API
Client islands → forms → Server Actions → lib/api + cookies + revalidateTag
```

### Slide: Why fetch lives next to the list

`FeaturedArticlesGrid` and `ArticlesCatalog` call `getArticleMethods()` themselves instead of prop-drilling from the page — easier to read and aligns with one cached loader shared with metadata (`components/Articles/README.md`).

---

## Part 4 — Cache Components & `"use cache"` (12–15 min)

### Slide: Opt-in model

- `next.config.ts`: `cacheComponents: true` — nothing cached unless marked.
- Comment block in config documents `cacheLife` semantics: stale / revalidate / expire.

### Slide: Named profiles in this repo

- `**articles**`: e.g. 5m fresh → 15m revalidate → 1h expire (catalog, single article, trending).
- `**breakingNews**`: short TTL for homepage hero freshness.

### Slide: Where `"use cache"` appears


| Unit                     | Module                                          | Profile / note                                                             |
| ------------------------ | ----------------------------------------------- | -------------------------------------------------------------------------- |
| All articles + groupings | `getArticleMethods`                             | `articles`                                                                 |
| Breaking payload         | `getBreakingNews`                               | `breakingNews`                                                             |
| Article by id            | `getArticleById`                                | `articles`                                                                 |
| Trending                 | `getTrendingArticles`                           | `articles` (arguments include `excludeArticleId` → separate cache entries) |
| Categories               | `getCategories`                                 | `weeks`                                                                    |
| Subscription by token    | `getSubscriptionStatusByToken`                  | `days` + `**cacheTag(subscriptionTag(token))**`                            |
| Small UI                 | `CurrentYear`, `PublishedDay` / `PublishedTime` | component-level cache                                                      |


### Slide: Subscription — cookie outside cache

`getSubscriptionStatus()` reads the cookie, then calls a cached function **with the token as an argument** so entries are per-user, not one global blob:

- `lib/server-data/getSubscriptionStatus.ts`: `readSubscriptionTokenFromCookie` → `getSubscriptionStatusByToken(token)` with `'use cache'`, `cacheTag(subscriptionTag(token))`.

### Caveat for Q&A

`PublishedDay` / `PublishedTime` combine `"use cache"` with inner `Suspense` — align wording with your Next version’s Cache Components guidance for “current time” style content.

---

## Part 5 — Suspense & streaming (10–12 min)

### Slide: Principles

- Boundaries match **sections** (breaking vs featured vs article body vs trending).
- Fallbacks **match content shape** (`LoadingSkeleton`, `InfoMessage`) — avoid generic spinner soup.

### Slide: Concrete boundaries

1. **Home:** `BreakingNewsBanner` → Suspense → `BreakingNews`.
2. **Home:** `FeaturedArticles` → Suspense → `FeaturedArticlesGrid`.
3. **Article page:** Suspense wraps `ArticlePageInner` so slug resolution + `getArticleMethods` do not block the whole shell (`app/articles/[slug]/page.tsx`).
4. **Article body:** Suspense around `ArticleSubscriptionGate`; separate Suspense for `TrendingArticles` (`components/Article/ArticleBody.tsx`).
5. **Search:** Suspense for `SearchBar` (categories) vs `SearchResults` (`app/search/page.tsx`).
6. **Subscription page:** Suspense around async `Subscription`.

### Slide: Why async child inside Suspense on article route

Keeps params + data loading in an async child so the route can stream per Next “blocking route” guidance (comment on `ArticleBody` / page structure).

### Demo idea

Throttle network in DevTools; show sections appearing independently.

---

## Part 6 — Server Actions & forms (8–10 min)

### Slide: `app/actions/subscription.ts`

- `**'use server'`** only here for mutations.
- `subscribeAction` / `unsubscribeAction`: token from or to HttpOnly cookie, upstream POST/DELETE, then `**revalidateTag(subscriptionTag(token), 'max')**` for SWR-style freshness.

### Slide: Progressive enhancement + a11y

- `SubscriptionButton`: `**useActionState**` + `**<form action={…}>**` — works without enhanced JS; JS adds errors and pending UI.
- Avoid `disabled` on submit for focus order; use `**aria-busy**`, `**aria-disabled**`, and activation guards (`SubscriptionButton.tsx` comments).
- `**GuardedServerActionForm**`: debounce + block submit while `useFormStatus().pending` (ref sync).

### Slide: Invalidation story

`cacheTag` on read path + `revalidateTag` on write path → `ArticleSubscriptionGate` and subscription page see updated status without manual client refetch.

---

## Part 7 — Client islands & search (5–7 min)

### Slide: Search split

- `**SearchClient**`: local state, debounced `router.replace`, category popover — needs hooks and `useSearchParams`.
- `**SearchResults**`: async server component; awaits `searchParams`, calls `**getArticleMethods()**`, filters in memory — shareable URLs, SEO-friendly, single source of truth for article list.

### Slide: Other clients

Navigation drawer (`MobileNavigation`), theme (`ThemeProviders`) — state and animations.

---

## Part 8 — Access control (7–10 min)

### Slide: Two different problems

1. **Incoming requests to your Next app** — `proxy.ts`: log line, **fail fast** if `VERCEL_PROTECTION_BYPASS` missing, set `**X-Frame-Options: DENY`**, `**X-Content-Type-Options: nosniff**`.
2. **Outgoing server `fetch` to protected API** — `vercelProtectionBypassHeaders()` adds `**x-vercel-protection-bypass`** (`lib/api/fetchNewsApi.ts`, subscription API).

### Slide: Subscription token

- HttpOnly cookie `subscription_token`, secure in production, `sameSite: 'lax'` (`lib/api/subscription/utils.ts`).
- Token not exposed to client JS for status reads; `**getSubscriptionStatus**` runs on server.

### Slide: Content gate

- `**ArticleSubscriptionGate**` (async RSC): blur/gradient preview vs full `**ArticleContentRte**` based on `getSubscriptionStatus()`.

### Slide: Naming (`proxy` vs `middleware`)

If rubric says “middleware,” narrate `proxy.ts` as request interception before the route (Next version in this repo uses the `proxy` export pattern).

---

## Part 9 — Tradeoffs & polish (5 min)

### Open Graph

- Branch moved from dynamic `opengraph-image.tsx` routes to **Metadata API** images (article hero URL or static fallback in `lib/og/siteOpenGraphImage.tsx`).
- **Tradeoff:** less bespoke generated OG art; simpler ops; previews use real imagery when available.

### Errors

- Loaders return `{ ok: false, error }`; UI uses `**InfoMessage`** instead of throwing everywhere — predictable UX when API fails.

---

## Part 10 — Live demo script (~10 min)

1. Home: show streaming (breaking vs featured).
2. Article logged out: gate → subscribe → full body after action + revalidation.
3. Search: debounced URL updates → results Suspense; categories.
4. Server terminal: `[Proxy]` logs + fetch full URLs.
5. Optional: mis-set env to show fail-fast vs API errors (only in a safe local setup).

---

## Part 11 — One-minute closing

Separated **transport**, **cached reads**, and **mutations**; used **Cache Components** so catalog and subscription reads are predictable and **tag-invalidatable**; used **Suspense** to stream independent regions; used **Server Actions + forms** for subscription with **HttpOnly cookies** and **bypass headers only on the server**; combined **request-level headers** in `**proxy.ts`** with framing and MIME-sniffing defenses.

---

## Keynote / slides — copy-paste titles + bullets

Use one slide per block below (duplicate slides where you need more room).

**1. The Vercel Daily**  

- Server-first Next.js App Router  
- Certification: Vercel Daily News

**2. Learning goals**  

- `"use cache"` + `cacheLife` + tags  
- Suspense + streaming  
- Server Actions + forms  
- Proxy + API bypass

**3. Route map**  

- `/` `/articles` `/articles/[slug]` `/search` `/subscription`

**4. Three layers**  

- `lib/api` — HTTP, no cache  
- `lib/server-data` — parse + `"use cache"`  
- `app/actions` — `'use server'` + `revalidateTag`

**5. `getArticleMethods`**  

- `"use cache"` + `cacheLife("articles")`  
- Shared with metadata + pages

**6. Subscription cache**  

- Cookie read outside cache  
- `cacheTag` + `revalidateTag` per token

**7. Suspense**  

- Section-aligned boundaries  
- Skeleton-shaped fallbacks

**8. Server Actions**  

- Cookies + upstream API  
- `useActionState` + guarded form

**9. Search**  

- Client: URL + UI state  
- Server: `getArticleMethods` + filter

**10. Security**  

- `proxy.ts` — headers, env fail-fast  
- `x-vercel-protection-bypass` on `fetch` only

**11. Tradeoffs**  

- OG: metadata vs dynamic images  
- Errors: result types vs throws

**12. Demo**  

- Stream → subscribe → search

---

## Optional: Keynote on your Mac

This Cursor environment may not see `/Applications/Keynote.app`. On your machine, if Keynote is installed, create a new deck and paste the “Keynote / slides” section, or run Script Editor with a small AppleScript that loops over slide titles (advanced).

---

*Generated for the vercel-daily repo explanation video.*