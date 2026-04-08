import { DrawerClose, DrawerFooter } from '@/components/ui/drawer'
import { IconButton } from '@/ui/IconButton'
import { CloseIcon } from '@/components/ui/icons/close'
import { type ReactNode } from 'react'

type MobileNavigationFooterProps = {
  open: boolean
  children: ReactNode
}

export function MobileNavigationFooter({ open, children }: MobileNavigationFooterProps) {
  return (
    <DrawerFooter className="flex w-full flex-col items-stretch gap-4">
      {/*
        Subscription slot is composed in Navigation (Server Component): Suspense + async Subscription.
        Client boundaries receive server output as children; do not import subscription fetch here.
      */}
      <div className="flex w-full justify-center">{children}</div>
      <div className="flex justify-center">
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
      </div>
    </DrawerFooter>
  )
}
