# `app/actions` — Server Actions (mutations)

This folder holds modules marked with `**'use server'**` that **mutate state** for this deployment: cookies, upstream APIs, and **Next.js cache invalidation**. They are invoked from Client Components (for example via `<form action={…}>` and `useActionState`) or could be called from other server code.

## Why this lives under `app/` (not `lib/`)

1. **App-owned side effects** — These functions use `**cookies()`** from `next/headers` and `**revalidateTag()`** from `next/cache` with tags defined for **this app’s** `lib/server-data` layer (`subscriptionTag`, etc.). That ties them to the same product boundary as routes and layouts.
2. **Clear split under `lib/`** — `**lib/api**` is outbound HTTP + parsing; `**lib/server-data**` is cached reads. Keeping `**lib/**` free of `'use server'` keeps those folders easy to reason about as **libraries** (callable from anywhere) versus **application entrypoints** that participate in forms and cache rules.

## How the stack fits together


| Layer                    | Responsibility                                                                                                   |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| `**lib/api`**            | `fetch` to external backends; no cookies, no `revalidateTag`.                                                    |
| `**lib/server-data**`    | Cached **reads**; may call `lib/api`.                                                                            |
| `**app/actions` (here)** | **Writes**: orchestrate `lib/api`, read/set **cookies**, then `**revalidateTag`** so server-data caches refresh. |


`**subscription.ts`** — `subscribeAction` / `unsubscribeAction`: ensure a subscription token (cookie), call activate/deactivate on the subscription API, clear the cookie on unsubscribe, and revalidate the token-scoped cache tag so UI and `getSubscriptionStatus` stay consistent.

## Conventions

- **Imports from client:** `import { … } from '@/app/actions/<file>'` (path alias).
- **Return shape:** Prefer small serializable state objects for `useActionState` (e.g. `{ ok, error? }`) instead of throwing for expected failures.
- **Shared integration code** stays in `**lib/api`**; actions should stay thin orchestrators so Route Handlers or future callers could reuse the same API client.

## See also

- `[lib/api/README.md](../../lib/api/README.md)` — HTTP clients  
- `[lib/server-data/README.md](../../lib/server-data/README.md)` — cached reads

