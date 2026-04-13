# Subscription

Subscribe / unsubscribe flows using **Server Actions**, with a **tiny client** button form.

## What lives here

- `**Subscription.tsx`** — Async **server** component: calls `getSubscriptionStatus()`, shows an error `InfoMessage` if the status **fetch** failed, otherwise renders `SubscriptionButton` with booleans. Intended to be dropped inside `Suspense` (see `Navigation`) so headers do not block on this call.
- `**SubscriptionButton.tsx`** — **Client** component: `useActionState` + `useFormStatus` wired to `subscribeAction` / `unsubscribeAction` from `app/actions/subscription`. Uses `GuardedServerActionForm` to avoid double submits **without** relying on `disabled` (better for focus and screen readers—see file comment).

## Architectural decisions

**Security and simplicity:** Mutations run on the server as actions; the client only posts form data and shows pending/error UI—no API keys in the browser. The `subscription_token` cookie is **HttpOnly** and **`Secure` in production** (`lib/api/subscription/utils.ts`); seeing its value under **Network → Request Headers** in DevTools is normal (every cookie is sent in plain form on the wire). HttpOnly means **in-page scripts cannot read it** from `document.cookie`, which is what matters for XSS. `__next_hmr_refresh_hash__` is a Next.js **dev-only** HMR cookie, not your subscription secret.

**Clear split:** Reading “are they subscribed?” is cheap server work; clicking is interactive client work. That is the same mental model as the Academy’s [client–server boundaries](https://vercel.com/academy/nextjs-foundations/client-server-boundaries) lesson: default server, client only for hooks and progressive enhancement.

**Composability:** `Navigation` passes `<Subscription />` as **children** into mobile and desktop shells so both layouts share one implementation.