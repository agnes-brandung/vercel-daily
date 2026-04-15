import Link from 'next/link';
import { Headline, HeadlineSize } from '@/ui/Typography';
import { GlobeIcon } from '@/ui/icons/globe';

/**
 * Link over anchor tags: <Link> provides soft navigation (client-side transitions) that preserves state, enables prefetching, and feels faster. 
 * Plain <a> tags trigger hard navigation with full page reloads.
 */
export function HomeIconLink() {
  return (
    <Link
      href="/"
      className='group flex shrink-0 items-center rounded-md focus-ring'
      aria-label="Home"
    >
      <span className="nav-home-globe">
        <GlobeIcon />
      </span>
    </Link>
  )
}

export function BrandLink({ size }: { size?: HeadlineSize }) {
  return (
    <Link href="/" className='group flex shrink-0 items-center rounded-md focus-ring' aria-label="Home">
      <Headline styleAs="brand" size={size}>
        The Vercel Daily
      </Headline>
    </Link>
  )
}