# `lib/api` — outbound HTTP clients (integration layer)

This folder is the **only place that performs `fetch` to the external Vercel Daily backends** (news JSON API and subscription API). It is **not** where we attach Next.js route caching or build “page-ready” data structures—that lives in **`lib/server-data`**.

## Purpose

- **Single integration surface** for env-specific concerns (base URL, protection-bypass header).
- **Predictable errors**: wrap network and parsing failures in **`ApiBackendResult<T>`** (`ok` + `data` or `error`) instead of throwing, so callers decide how to surface failures.
- **No React, no `"use cache"`**: these modules are plain async functions usable from **Server Components**, **`lib/server-data`**, and **`app/actions`** alike.

## How it is built

| Piece | Role |
|-------|------|
| **`const.ts`** | Base URL for the news/subscription host (`BASE_URL`). |
| **`vercelProtectionHeaders.ts`** | Shared **`x-vercel-protection-bypass`** header for protected deployments; used by every outbound call. |
| **`parseBackendJson.ts`** | Reads `Response` as text, parses JSON, validates the backend envelope (`success` + `data`), returns **`ApiBackendResult`**. |
| **`fetchNewsApi.ts`** | Generic GET helper for news endpoints: builds URL + query string, attaches protection headers, delegates parsing. |
| **`subscription/fetchSubscriptionApi.ts`** | Subscription-specific **`fetch`** (status, activate, deactivate, create): adds **`x-subscription-token`** when needed, same result pattern. |
| **`subscription/utils.ts`** | **Cross-cutting constants** for subscription: cookie name, cookie options, **`subscriptionTag()`** for cache invalidation (used by **`lib/server-data`** and **`app/actions`**, not only by HTTP code). |
| **`readClientApiError.ts`** | Helper for **client-side** `fetch` to **this app’s** Route Handlers (`/api/...`) when you return `{ error }` JSON—keeps UI thin; unrelated to the external news host unless you add such routes. |

Imports typically use the `@/lib/api/...` alias.

## Architecture vs `lib/server-data`

| | **`lib/api`** | **`lib/server-data`** |
|---|----------------|------------------------|
| **Job** | Talk HTTP to **remote** APIs; parse their JSON contract. | **App reads**: compose `lib/api`, **parse/map** domain objects (e.g. `parseArticle`), **group/sort** for UI, apply **`"use cache"` / `cacheLife` / `cacheTag`**. |
| **Caching** | None (each call is a fresh `fetch` unless the runtime dedupes). | Declares Next cache semantics per use case. |
| **Consumers** | `lib/server-data`, `app/actions`, tests, or future Route Handlers. | Server Components, layouts, `opengraph-image`, etc. |

Keeping them **separate** avoids:

- **Duplicating cache rules** inside low-level `fetch` helpers.
- **Pulling HTTP details** into every page-level function.
- **Circular or fuzzy boundaries**: “API” here means **external integration**, not “everything data-related.”

**`app/actions`** stays the right place for **mutations** (cookies + `revalidateTag`); actions call **`lib/api/subscription/...`** directly for writes while reads go through **`lib/server-data`** + cache where appropriate.

## Summary

**`lib/api`** = *how we call the backends*.  
**`lib/server-data`** = *what we cache and shape for the app’s server render*.  
That split keeps integration code small, reusable, and easy to test without dragging in the full RSC/cache story.

See also: [`lib/server-data/README.md`](../server-data/README.md) for the cached read layer above this one.
