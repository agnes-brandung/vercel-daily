import { DrawerTrigger } from '@/components/ui/drawer'
import { BrandLink, HomeIconLink } from '../NavigationLinks'
import { IconButton } from '@/components/ui/IconButton'
import { NavMenuOpenIcon } from '@/components/ui/icons/nav-menu-open'

type MobileNavigationDrawerProps = {
  open: boolean
}

export function MobileNavigationDrawerHeader({ open }: MobileNavigationDrawerProps) {
  return (
    <div className="flex items-center justify-between">
      {/*
        Home / brand sit outside the portaled drawer. Without `inert`, they stay in the tab order
        after open while Radix `hideOthers` may not remove them from keyboard focus in all cases.
        The menu trigger stays focusable (close on second activation / Escape via Radix).
      */}
      <div className="flex min-w-0 flex-1 items-center gap-4" inert={open ? true : undefined}>
        <HomeIconLink />
        <BrandLink size="2xl" />
      </div>
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
