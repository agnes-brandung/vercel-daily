import Link from "next/link";
import { GlobeIcon } from "@/ui/icons/globe";
import { Headline } from "@/ui/Typography";

/**
 * Navigation in ul list since best practice for accessibility and screen readers (clear structure)
 */
export default function NavigationDesktop() {
  return (
    <nav className="hidden lg:block sticky top-0 z-10 h-20 w-full bg-body text-typography">
      <div className="mx-auto flex h-full items-center justify-between">
        <ul className="m-0 flex w-full list-none items-center justify-between p-0">
          <li>
            <Link
              href="/"
              className="flex shrink-0 items-center"
              aria-label="Home"
            >
              <GlobeIcon />
            </Link>
          </li>
          <li>
            <Link href="/">
              <Headline styleAs="brand">
                The Daily Delivery
              </Headline>
            </Link>
          </li>
          <li>
            <Link href="/search">Search</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
