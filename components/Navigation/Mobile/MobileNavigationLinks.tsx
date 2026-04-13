'use client'

import { DrawerClose } from '@/components/ui/drawer'
import { TextLink } from '@/ui/Typography'
import { useState, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'

type MobileNavLinkProps = {
  href: string
  children: ReactNode
  isActive: boolean
}

/**
 * Rendered outside of the drawer component to avoid unnecessary re-renderings when parent component is re-rendered
 */
function MobileNavLink({ href, children, isActive }: MobileNavLinkProps) {
  return (
    <li>
      <DrawerClose asChild>
        <TextLink href={href} current={isActive}>
          {children}
        </TextLink>
      </DrawerClose>
    </li>
  )
}

export function MobileNavigationLinks({ setOpen }: { setOpen: (open: boolean) => void }) {
  const pathname = usePathname()
  const [prevPathname, setPrevPathname] = useState(pathname)

  /**
   * When the pathname changes, we set the previous pathname to the current pathname and close the drawer
   * This is to avoid the drawer from re-rendering when the pathname changes
   */
  if (pathname !== prevPathname) {
    setPrevPathname(pathname)
    setOpen(false)
  }

  return (
    <section
      className="flex flex-col gap-y-6 p-6"
      aria-labelledby="mobile-navigation-links"
    >
      <ul role="list" className="flex flex-col space-y-4">
        <MobileNavLink href="/" isActive={pathname === '/'}>
          Home
        </MobileNavLink>
        <MobileNavLink href="/search" isActive={pathname === '/search'}>
          Search
        </MobileNavLink>
        <MobileNavLink href="/subscription" isActive={pathname === '/subscription'}>
          Subscription
        </MobileNavLink>
      </ul>
    </section>
  )
}
