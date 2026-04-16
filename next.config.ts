import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Avoid picking a parent lockfile as workspace root.
    root: new URL(".", import.meta.url).pathname,
  },
  output: 'standalone', // for vercel deployment
  reactStrictMode: true,
  /**
   * Purpose: Disables the X-Powered-By: Next.js HTTP header in responses.
   * Why use it?
   * Security best practice: Hiding server technology reduces information leakage, making it slightly harder for attackers to target known vulnerabilities.
   * Minimal impact on performance or functionality.
   */
  poweredByHeader: false,
  /**
   * Purpose: Configures logging for server-side data fetches (e.g., fetch calls in getServerSideProps, API routes, or server components).
   * Why use it?
   * When fullUrl: true, Next.js will log the full URL of outgoing requests in the server console. This is useful for debugging, especially if you need to inspect API calls or external requests.
   * Without this, only the path (not the full URL) is logged.
   */
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.public.blob.vercel-storage.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  /**
   * Nothing is cached by default. 
   * Instead, you explicitly mark what should be cached using cacheComponents config here and
   * the "use cache" directive, at component, function and file level
   * 
   * For example:
   * "use cache";
   * cacheLife('hours'); // Built-in profile: cache for hours
   * Also for seonds, minutes, days, weeks..
   * 
   * "use cache";
   * cacheLife({ 
   *   stale: 60,        // Serve stale for 60s
   *   revalidate: 300,  // Revalidate after 5min
   *   expire: 3600      // Expire after 1hr
   * });
   * 
   * Semantics:
   * stale: Data is fresh for this duration (served from cache, no revalidation)
   * revalidate: After this period, revalidate in the background using stale-while-revalidate (serve cached content while fetching fresh data in the background)
   * expire: Maximum time before forced synchronous regeneration
   * 
   * You can also use the cacheTag directive to cache based on a tag:
   * "use cache";
   * cacheTag('my-tag');
   * 
   */
  cacheComponents: true,
  cacheLife: {
    // Featured, Trending, Most recent articles - moderate cache
    articles: {
      stale: 300, // 5 minutes fresh 
      revalidate: 900, // 15 minutes before revalidation
      expire: 3600, // 1 hour max
    },
    trending: {
      stale: 600, // 10 minutes fresh
      revalidate: 1800, // 30 minutes before revalidation
      expire: 3 * 3600, // 3 hours max
    },
    // Real-time data (breaking news) - minimal cache
    breakingNews: {
      stale: 30, // 30 seconds fresh
      revalidate: 60, // 1 minute before revalidation
      expire: 120, // 2 minutes max
    },
  },
}

export default nextConfig
