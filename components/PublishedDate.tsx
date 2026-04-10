import { Copy } from '@/ui/Typography';
import { cacheLife } from 'next/cache';
import { Suspense } from 'react';

/**
 * Refresh every hour with cacheLife since we are using PublishedDate to display a date with dd/mm/yyyy format.
 */
export async function PublishedDay({ date }: { date: string }) {
  "use cache"
  cacheLife('hours')

  return (
    <Suspense fallback={<Copy size="xs" color="lightGray">Loading published date…</Copy>}>
      <Copy size="sm" color="lightGray">
        {new Date(date).toLocaleDateString(undefined, {
          dateStyle: 'medium',
        })}
      </Copy>
    </Suspense>
  )
}

/**
 * Refresh every minute with cacheLife since we are using PublishedTime to display a date with dd/mm/yyyy and time with hh:mm format.
 * We do not need to 
 */
export async function PublishedTime({ date }: { date: string }) {
  "use cache"
  cacheLife('minutes')

  return (
    <Suspense fallback={<Copy size="xs" color="lightGray">Loading published time…</Copy>}>
      <Copy size="sm" color="lightGray">
        {new Date(date).toLocaleDateString(undefined, {
          dateStyle: 'short',
        })}
        &nbsp;
        {new Date(date).toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        })}
      </Copy>
    </Suspense>
  )
}