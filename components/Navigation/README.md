# Navigation

Site chrome: **desktop bar**, **mobile drawer**, links, and the subscription slot in the header.

## What lives here

- `**Navigation.tsx`** — Server component that composes desktop + mobile. Each branch wraps `**Subscription`** in `Suspense` with a small skeleton so the **nav shell paints even if** the subscription status request is slow.
- `**Desktop.tsx`** — Desktop layout and links (server-friendly).
- `**Mobile/MobileNavigation.tsx`** — **Client** drawer (open state, focus, Vaul/Radix). Only this file needs `'use client'`.
- `**Mobile/MobileNavigationLinks.tsx`**, `**MobileNavigationDrawerHeader.tsx`**, `**MobileNavigationFooter.tsx**`, `**MobileNavigationSkeleton.tsx**` — Split so the **client bundle stays small**: drawer behavior in one place; link lists and skeletons stay easy to test and reuse.
- `**NavigationLinks.tsx`** — Shared link set / styling for desktop (and patterns aligned with mobile).
- `**navStickyStyles.ts`** — Shared sticky + forced-colors border tokens. **Why a `.ts` file:** mobile client code can import **class strings only** without pulling in heavy server-only modules—keeps the client/server split clean ([boundaries](https://vercel.com/academy/nextjs-foundations/client-server-boundaries)).

## Architectural decisions

**Persistence:** Nested routes reuse the root layout’s nav ([nested layouts](https://vercel.com/academy/nextjs-foundations/nested-layouts)); this folder is the implementation of that chrome.

**Streaming:** Subscription status is async; wrapping it in `Suspense` avoids blocking the entire header on one cookie/API round-trip.

**Accessibility:** Mobile nav uses a **modal** drawer with focus management so keyboard users stay inside the menu while it is open.

## Related

- `app/layout.tsx` mounts `Navigation` and global providers.

