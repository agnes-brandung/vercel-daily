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
      <HomeIconLink />
      <BrandLink size="2xl" />
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
  )
}
