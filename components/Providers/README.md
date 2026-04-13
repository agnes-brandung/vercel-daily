# Providers

Right now this folder is intentionally tiny: **one client boundary** for theming.

## What lives here

- `**ThemeProviders.tsx`** — `'use client'` wrapper around `next-themes` `ThemeProvider`. It toggles the `class` on `<html>` for light/dark/system and must run in the browser.

## Architectural decisions

Theme switching needs **React context** and **DOM access**, so it cannot be a Server Component. We **isolate** that in a single provider mounted once from `app/layout.tsx` instead of sprinkling `'use client'` across random UI—matches the guidance to **keep client islands small** ([client–server boundaries](https://vercel.com/academy/nextjs-foundations/client-server-boundaries)).

## Related

- `app/layout.tsx` — Wraps `{children}` with `ThemeProviders`.

