import type { ComponentPropsWithRef, ReactNode } from 'react';

import { cva } from 'class-variance-authority';

import { cn } from '@/utils/cn';

/** Circular icon-only control; colors from `--icon-button-*` in `globals.css`. */
export const iconButtonVariants = cva(
  'inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full border border-solid border-[var(--icon-button-border)] bg-[var(--icon-button-bg)] p-0 text-[var(--icon-button-fg)] transition-[color,background-color,border-color] hover:border-[var(--icon-button-hover-border)] hover:bg-[var(--icon-button-hover-bg)] hover:text-[var(--icon-button-hover-fg)] focus-visible:border-[var(--icon-button-hover-border)] focus-visible:bg-[var(--icon-button-hover-bg)] focus-visible:text-[var(--icon-button-hover-fg)] focus-visible:outline-none active:border-[var(--icon-button-hover-border)] active:bg-[var(--icon-button-hover-bg)] active:text-[var(--icon-button-hover-fg)] disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0',
  {
    variants: {
      size: {
        default: 'size-11 [&_svg]:size-5',
        sm: 'size-8 [&_svg]:size-4',
        lg: 'size-12 [&_svg]:size-6',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
);

export type IconButtonProps = Omit<ComponentPropsWithRef<'button'>, 'children'> & {
  children: ReactNode;
  size?: 'default' | 'sm' | 'lg';
};

export function IconButton({
  ref,
  className,
  type = 'button',
  size = 'default',
  children,
  ...props
}: IconButtonProps) {
  return (
    <button ref={ref} type={type} className={cn(iconButtonVariants({ size }), className)} {...props}>
      {children}
    </button>
  );
}
