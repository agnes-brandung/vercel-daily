import Link from "next/link";
import { GlobeIcon } from "@/ui/icons/globe";
import { Headline } from '@/ui/Typography';

export default function Navigation() {
  return (
    <nav className="sticky top-0 z-10 h-20 w-full bg-body text-typography">
      <div className="mx-auto flex h-full items-center justify-between">
        <Link
          href="/"
          className="flex shrink-0 items-center"
          aria-label="Home"
        >
          <GlobeIcon />
          <Headline styleAs="brand" color="blue">
            The Daily Delivery
          </Headline>
        </Link>
      </div>
    </nav>
  );
}