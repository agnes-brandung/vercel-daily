import { DrawerTrigger } from '@/ui/lib/drawer'
import { BrandLink, HomeIconLink } from '../NavigationLinks'
import { IconButton } from '@/components/ui/IconButton'
import { NavMenuOpenIcon } from '@/components/ui/icons/nav-menu-open'

type MobileNavigationDrawerProps = {
  open: boolean
}

/**
 * Mobile Navigation Drawer Header
 * Home / brand sit outside the portaled drawer. Without `inert`, they stay in the tab order
 * after open while Radix `hideOthers` may not remove them from keyboard focus in all cases.
 * The menu trigger stays focusable (close on second activation / Escape via Radix).
 */
export function MobileNavigationDrawerHeader({ open }: MobileNavigationDrawerProps) {
  return (
    <div className="flex items-center justify-between" inert={open ? true : undefined}>
      <HomeIconLink />
      <BrandLink size="2xl" />
      <DrawerTrigger asChild>
        <IconButton
          aria-expanded={open}
          aria-haspopup="dialog"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          <NavMenuOpenIcon />
        </IconButton>
      </DrawerTrigger>
    </div>
  )
}
