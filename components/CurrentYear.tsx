'use client';

/** Uses `new Date()`; with Cache Components, must sit under `Suspense` (see Next.js prerender current time). */
export function CurrentYear() {
  return new Date().getFullYear();
}
