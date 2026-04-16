# `lib/server-data` — server data layer

This folder holds **async functions that load and shape data for the Next.js app on the server**. They sit between **UI / route code** (Server Components, layouts, `**generateMetadata`**, etc.) and the **remote backends** reached through `lib/api`.

See also: `[lib/api/README.md](../api/README.md)` for the outbound HTTP layer below this one.

## How the stack is built

Data flows in one direction for reads:

1. `**lib/api`** — Thin HTTP clients: build URLs, attach shared headers (e.g. Vercel protection bypass), `fetch`, parse JSON. They return a simple **result type** (`ok` + `data` or `error`) and do not know about React or pages.
2. `**lib/server-data` (here)** — **Domain reads**: call `lib/api`, map responses into **parsed / grouped** structures the UI expects, and declare **caching** with Next.js (`"use cache"`, `cacheLife`, and where needed `cacheTag`) so repeated work is avoided and cache invalidation stays predictable.
3. `**app/actions`** — **Writes** (`'use server'`): mutations (cookies, subscription API calls), then `**revalidateTag`** so cached reads in this layer see fresh data after a user action.

Mutations are not implemented here; they live next to forms and server actions so reads and writes stay clearly separated.

## Why these functions instead of HTTP Route Handlers?

Server Components and `**generateMetadata`** already run on the server: they can `await` these modules directly. Exposing the same reads under `app/api/.../route.ts` would add a **self-HTTP hop** (extra latency, duplication) without a new consumer.

**Direct calls** keep typed results and colocate `**"use cache"` / `cacheLife` / `cacheTag`** with the read—aligned with `**revalidateTag`** from Server Actions. **Route Handlers** are for callers that **must** use HTTP (webhooks, mobile apps, third-party integrations); they widen your public surface and usually aren’t needed for internal RSC data.

## What each module does


| Module                       | Responsibility                                                                                                                                                                                                      |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `**getArticlesMethods`**     | Fetches all articles once, returns **parsed** articles plus **derived lists** (via pure helpers in `articleListDerivations.ts`) — home, catalog, search.                                                            |
| `**articleListDerivations`** | **Pure** functions: `pickFeaturedArticles`, `groupArticlesByCategory`, `selectMostRecentArticles` — same inputs/outputs as before; easy to unit test without touching the cache layer.                              |
| `**getArticle`**             | Fetches a **single article** by **slug or id** from `GET /articles/{key}` (parsed `ParsedArticle`), cached **per key** on the **articles** lifetime (`cacheTag` includes `article:…`).                              |
| `**getTrendingArticles`**    | Fetches trending articles, **parses** them, sorts by date; supports excluding the current article’s id.                                                                                                             |
| `**getBreakingNews`**        | Fetches the **breaking news** payload; uses a **short** cache profile suited to urgent updates.                                                                                                                     |
| `**getCategories`**          | Fetches **category metadata** for filters; uses a **longer** cache profile (categories change rarely).                                                                                                              |
| `**getSubscriptionStatus`**  | Reads the **subscription cookie** on the request, then resolves **active vs inactive** via the subscription API inside a **tagged** cached function so `revalidateTag` from `app/actions` can invalidate per token. |


Together, these are the **single entry points** server code should use for “load X for the page” instead of calling `lib/api` directly from many components (keeps caching and parsing rules in one place).

## Conventions

- **Imports:** `import { … } from '@/lib/server-data/<file>'` (no extension).
- **Results:** Prefer explicit unions like `{ ok: true, data } | { ok: false, error }`
- **This app’s HTTP APIs:** add `app/api/<segment>/route.ts` only when something outside this flow must call the app over HTTP; keep shared logic in `lib/api` so handlers don’t duplicate these reads.

