import { cacheLife } from 'next/cache'

/**
 * Component-level caching
 * Uses `new Date()`; with Cache Components, must sit under `Suspense` (see Next.js prerender current time). 
 * See https://vercel.com/academy/nextjs-foundations/cache-components
 */
export async function CurrentYear() {
  "use cache"
  cacheLife('days') // Refresh every day
  return new Date().getFullYear();
}
