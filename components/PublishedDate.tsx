import { Copy } from '@/ui/Typography';
import { cacheLife } from 'next/cache';

// TODO: do we need a separate component since we are using Suspense for the entire component?
export default async function PublishedDate({ date }: { date: string }) {
  "use cache"
  cacheLife('seconds') // Refresh every second

  return <Copy size="sm" color="lightGray">
    {new Date(date).toLocaleDateString(undefined, {
      dateStyle: 'medium',
    })}
  </Copy>
}