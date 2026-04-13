import Link from 'next/link';
import { Headline, HeadlineSize } from '@/ui/Typography';
import { GlobeIcon } from '@/ui/icons/globe';

/**
 * Link over anchor tags: <Link> provides soft navigation (client-side transitions) that preserves state, enables prefetching, and feels faster. 
 * Plain <a> tags trigger hard navigation with full page reloads.
 */
export function HomeIconLink() {
  const globeIconAnimation = "inline-flex origin-center motion-reduce:group-hover:animate-none group-hover:animate-[spin_4s_linear_infinite]";

  return (
    <Link
      href="/"
      className='group flex shrink-0 items-center rounded-md focus-ring'
      aria-label="Home"
    >
      <span className={globeIconAnimation}>
        <GlobeIcon />
      </span>
    </Link>
  )
}

export function BrandLink({ size }: { size?: HeadlineSize }) {
  return (
    <Link href="/" className='group flex shrink-0 items-center rounded-md focus-ring' aria-label="Home">
      <Headline type="h1" styleAs="brand" size={size}>
        The Vercel Daily
      </Headline>
    </Link>
  )
}