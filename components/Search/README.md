# Search

Search is split on purpose: **the URL is the source of truth**, the **server** owns articles + filtering rules, and a **small client** bar handles typing, debouncing, and pushing updates into the query string.

## What lives here

- `**SearchClient.tsx`** — Client component: controlled inputs, `useRouter` / `useSearchParams`, debounced navigation, category popover behavior. Everything shareable or testable without the DOM lives in utils/hooks instead of inline.
- `**utils/filterArticlesBySearchParams.ts`** — **Pure functions**: read term + category slugs from `searchParams`, build query strings, filter `ParsedArticle[]`. Used from **both** the client (when building URLs) and the server (when computing results) so **rules never drift** ([params vs searchParams](https://vercel.com/academy/nextjs-foundations/params-vs-searchparams): path = identity, query = filter state).
- `**CategoryDropdown.tsx`**, `**hooks/useCloseCategoryPopover.ts`**, `**styles.ts**` — UI and interaction details for the category picker.
- `**ResultsGrid.tsx**` — Server component: renders headings, `InfoMessage`, and reuses `**ArticlesGridItems**` for the card markup.
- `**MoreResults.tsx**` — **Client** “show more” control. The grid HTML is still produced on the server; we only hide extra rows with scoped CSS until the user expands—so we do not duplicate card rendering in JS.

## Architectural decisions

**Shareable logic:** Putting filter rules in `utils/` means the search page’s async `SearchResults` and the browser bar always agree on what “counts” as a match.

**Two Suspense regions on the page** (`app/search/page.tsx`): categories can resolve independently from the article list, which improves perceived speed ([Suspense and streaming](https://vercel.com/academy/nextjs-foundations/suspense-and-streaming)).

**Minimal client surface:** Only the controls that must react on every keystroke are client components; heavy lists stay server-rendered.

## Related

- `app/search/page.tsx` — `searchParams` as a **Promise** (App Router), awaited before filtering.

