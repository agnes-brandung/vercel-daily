'use client'

import { useState, type ReactNode } from 'react'
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '@/ui/lib/drawer'
import { MobileNavigationFooter } from './MobileNavigationFooter'
import { VisuallyHidden } from 'radix-ui'
import { MobileNavigationLinks } from './MobileNavigationLinks'
import { MobileNavigationDrawerHeader } from './MobileNavigationDrawerHeader'
import { navStickyContainerStyles } from '../navStickyStyles'
import { cn } from '@/utils/cn'

type NavigationMobileProps = {
  children: ReactNode
}

/**
 * Mobile Navigation Bar with Burger Menu Icon to open the navigation drawer on the left side of the screen.
 * To activate keyboard navigation, the drawer is set to modal and autoFocus.
 */
export default function NavigationMobile({ children }: NavigationMobileProps) {
  const [open, setOpen] = useState(false)

  return (
    <nav className={cn(navStickyContainerStyles, 'block py-4 xl:hidden')}>
      <Drawer
        open={open}
        onOpenChange={setOpen}
        direction="left"
        modal
        autoFocus
      >
        <MobileNavigationDrawerHeader open={open} />
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
          <MobileNavigationLinks setOpen={setOpen} />
          <MobileNavigationFooter open={open}>{children}</MobileNavigationFooter>
        </DrawerContent>
      </Drawer>
    </nav>
  )
}
