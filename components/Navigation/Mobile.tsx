'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, type ReactNode } from 'react'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
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
import { NavMenuCloseIcon } from '@/ui/icons/nav-menu-close'
import { cn } from '@/utils/cn'
import Button from '@/ui/Button'

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
        <Link href={href} className={cn('block py-2 text-lg', isActive ? 'text-blue' : '')}>
          {children}
        </Link>
      </DrawerClose>
    </li>
  )
}

export default function NavigationMobile() {
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
    <div className="bg-body text-typography lg:hidden">
      <Drawer open={open} onOpenChange={setOpen} direction="left">
        <DrawerTrigger asChild>
          <Button
            variant="iconOnly"
            label={
              <NavMenuOpenIcon />
            }
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-haspopup="true"
            className="flex h-8 w-8 items-center justify-center"
          />
        </DrawerTrigger>
    
        <DrawerContent
          className="fixed left-0 top-0 h-full w-[80%] max-w-sm rounded-none border-r bg-white shadow-lg"
          style={{ transform: open ? 'translateX(0)' : 'translateX(-100%)' }}
        >
          <VisuallyHidden>
            <DrawerHeader>
              <DrawerTitle className="sr-only">Mobile navigation</DrawerTitle>
              <DrawerDescription className="sr-only">Mobile navigation</DrawerDescription>
            </DrawerHeader>
          </VisuallyHidden>
          <nav className="flex flex-col gap-y-6 p-6" aria-label="Mobile navigation">
            <ul className="flex flex-col space-y-4">
              <MobileNavLink href="/" isActive={pathname === '/'}>
                Home
              </MobileNavLink>
              <MobileNavLink href="/search" isActive={pathname === '/search'}>
                Search
              </MobileNavLink>
              <MobileNavLink href="/about" isActive={pathname === '/about'}>
                About
              </MobileNavLink>
            </ul>
          </nav>
          <DrawerFooter>
          <DrawerClose asChild>
              <Button
                variant="iconOnly"
                label={<NavMenuCloseIcon />}
                aria-expanded={open}
                aria-controls="mobile-navigation"
                aria-haspopup="true"
              />
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
