'use client'

import { useState, type ReactNode } from 'react'
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { cn } from '@/lib/utils'
import { navStickyContainerStyles } from '../navStickyStyles'
import { MobileNavigationFooter } from './MobileNavigationFooter'
import { VisuallyHidden } from 'radix-ui'
import { MobileNavigationLinks } from './MobileNavigationLinks'
import { MobileNavigationDrawerHeader } from './MobileNavigationDrawerHeader'

type NavigationMobileProps = {
  children: ReactNode
}

export default function NavigationMobile({ children }: NavigationMobileProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className={cn(navStickyContainerStyles, 'block py-4 lg:hidden')} aria-label="Main">
      <Drawer open={open} onOpenChange={setOpen} direction="left">
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
    </div>
  )
}
