import Link from 'next/link';
import { Headline } from '../ui/Typography';
import { GlobeIcon } from '../ui/icons/globe';

export function HomeIconLink() {
  const globeIconAnimation = "inline-flex origin-center motion-reduce:group-hover:animate-none group-hover:animate-[spin_4s_linear_infinite]";

  return (
    <Link
      href="/"
      className="group flex shrink-0 items-center"
      aria-label="Home"
    >
      <span className={globeIconAnimation}>
        <GlobeIcon />
      </span>
    </Link>
  )
}

export function BrandLink({ size }: { size?: 'xs' | 'sm' | 'base' | 'lg' }) {
  return (
    <Link href="/" className="group flex shrink-0 items-center" aria-label="Home">
      <Headline styleAs="brand" size={size}>
        The Daily Delivery
      </Headline>
    </Link>
  )
}