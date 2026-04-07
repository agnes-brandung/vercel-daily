'use client'

import { usePathname } from 'next/navigation'
import { Suspense, useState, type ReactNode } from 'react'
import { VisuallyHidden } from 'radix-ui'
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerClose,
  DrawerTitle,
  DrawerDescription,
  DrawerHeader,
  DrawerFooter,
} from '@/components/ui/drawer'
import { NavMenuOpenIcon } from '@/ui/icons/nav-menu-open'
import { CloseIcon } from '@/ui/icons/close'
import { IconButton } from '@/ui/IconButton'
import { TextLink } from '@/ui/Typography'
import { BrandLink, HomeIconLink } from './NavigationLinks'
import { cn } from '@/lib/utils'
import { navStickyContainerStyles } from './Navigation'
import { InfoMessage } from '../ui/InfoMessage'
import LoadingSkeleton from '../ui/LoadingSkeleton'
// import { SubscriptionButton } from '../Subscription/SubscriptionButton'

interface MobileNavLinkProps {
  href: string
  children: ReactNode
  isActive: boolean
}

/**
 * Rendered outside of the drawer component to avoid unecessary re-renderings when parent component is re-rendered
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

export default function NavigationMobile({ isActive, hasToken }: { isActive: boolean; hasToken: boolean }) {
  const [open, setOpen] = useState(false)
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
    <nav className={cn(navStickyContainerStyles, "block py-4 lg:hidden")}>
      <Drawer open={open} onOpenChange={setOpen} direction="left">
        <div className="flex items-center justify-between">
          <HomeIconLink />
          <BrandLink size="base" />
          <DrawerTrigger asChild>
            <IconButton
              aria-expanded={open}
              aria-controls="mobile-navigation"
              aria-haspopup="true"
              aria-label="Open menu"
            >
              <NavMenuOpenIcon />
            </IconButton>
          </DrawerTrigger>
        </div>
    
        <DrawerContent
          className="fixed top-0 left-0 h-full max-w-sm w-[80%] rounded-none border-border border-r bg-body text-typography shadow-lg"
          style={{ transform: open ? 'translateX(0)' : 'translateX(-100%)' }}
        >
          <VisuallyHidden.Root>
            <DrawerHeader>
              <DrawerTitle className="sr-only">Mobile navigation</DrawerTitle>
              <DrawerDescription className="sr-only">Mobile navigation</DrawerDescription>
            </DrawerHeader>
          </VisuallyHidden.Root>
          <nav className="flex flex-col gap-y-6 p-6" aria-label="Mobile navigation">
            <ul className="flex flex-col space-y-4">
              <MobileNavLink href="/" isActive={pathname === '/'}>
                Home
              </MobileNavLink>
              <MobileNavLink href="/search" isActive={pathname === '/search'}>
                Search
              </MobileNavLink>
            </ul>
          </nav>
          <DrawerFooter className="w-full items-center">
            {/* <Suspense fallback={
              <InfoMessage type="loading" message="Loading subscription status...">
                <LoadingSkeleton type="card" />
              </InfoMessage>
            }>
              <SubscriptionButton isActive={isActive} hasToken={hasToken} />
            </Suspense> */}
            <DrawerClose asChild>
              <IconButton
                aria-expanded={open}
                aria-controls="mobile-navigation"
                aria-haspopup="true"
                aria-label="Close menu"
              >
                <CloseIcon />
              </IconButton>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </nav>
  )
}
