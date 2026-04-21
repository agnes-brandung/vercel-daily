"use client"

import * as React from "react"
import { Checkbox as CheckboxPrimitive } from "radix-ui"

import { cn } from "@/utils/cn"
import { CheckIcon } from "@/ui/icons/check"

/** Box size, alignment, border shell (unchecked). */
const checkboxLayout =
  "peer relative flex size-6 shrink-0 items-center justify-center rounded-[4px] border border-input transition-colors outline-none"

/** Invisible ::after pad so the row label’s hit target is easier to tap than the 24px box alone. */
const checkboxHitArea = "after:absolute after:-inset-x-3 after:-inset-y-2"

/** Fades this control when an ancestor field is disabled (Radix field pattern). */
const checkboxInDisabledField = "group-has-disabled/field:opacity-50"

/** Shared app focus ring (see globals.css `focus-ring`). */
const checkboxFocus = "focus-ring"

const checkboxDisabled = "disabled:cursor-not-allowed disabled:opacity-50"

/** Error state ring/border when `aria-invalid`. */
const checkboxInvalid =
  "aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary"

const checkboxDark = "dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40"

/** Checked visuals (`data-state` / `data-checked` from Radix). */
const checkboxChecked =
  "data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary"

const checkboxRootClassName = cn(
  checkboxLayout,
  checkboxHitArea,
  checkboxInDisabledField,
  checkboxFocus,
  checkboxDisabled,
  checkboxInvalid,
  checkboxDark,
  checkboxChecked,
)

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(checkboxRootClassName, className)}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none [&>svg]:size-3.5"
      >
        <CheckIcon />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
