# Article (single article)

Everything here is about **one article page**: hero, body copy, paywall-style gate and errors.

## What lives here

- `**ArticleBody.tsx`** — Async server component that lays out the article (category, title, author, hero image, excerpt). 
  - It wraps the long-form body and subscription logic in `Suspense` so the **shell streams first** and slow bits (subscription check + RTE) do not block the whole page. 
  - Trending Articles section sits in its own `Suspense` so it can load in parallel with the main column.
- `**ArticleContentRte.tsx`** — Turns API content (blocks or plain text) into readable sections on the **server**. Keeps parsing and mapping out of the gate and the page file.
- `**ArticleSubscriptionGate.tsx`** — Async server component: reads subscription status, then either shows full content or a **preview + gradient + CTA**. The actual “Subscribe” click lives in a small client `SubscriptionButton`; only status + layout stay here.
- `**ArticleError.tsx`** — Dedicated error UI for article routes (copy and structure separate from generic errors).

## Architectural decision

**Streaming first:** Heavy or permission-dependent work sits behind `Suspense` inside `ArticleBody` so users see header, image, and metadata quickly—same idea as [Suspense and streaming](https://vercel.com/academy/nextjs-foundations/suspense-and-streaming): avoid one slow subtree freezing the entire view.

**Thin client boundary:** Subscription **state** is resolved on the server; **interaction** is delegated to `SubscriptionButton`. That follows [client–server boundaries](https://vercel.com/academy/nextjs-foundations/client-server-boundaries)—no secrets in the client, smaller JS where possible.

## Related routes

- `app/articles/[slug]/page.tsx` — Resolves the article (and `notFound()`), then renders `ArticleBody` inside a top-level `Suspense` for the route.

