import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import { forwardRef } from 'react';

import Link from 'next/link';

import { cva } from 'class-variance-authority';

import { cn } from '@/utils/cn';

export const headlineStyles = (color?: HeadlineColor, size?: HeadlineSize) => cva('hyphens-auto', {
  variants: {
    color: {
      blue: 'text-blue',
      red: 'text-red',
      green: 'text-green',
      yellow: 'text-yellow',
      offWhite: 'text-off-white',
      gray: 'text-gray',
      lightGray: 'text-light-gray',
    },
    styleAs: {
      h1: `font-primary text-4xl font-bold md:text-[3.5rem] ${color ? `text-${color}` : 'text-blue'}`,
      h2: 'font-primary text-2xl font-bold md:text-[2.5rem]',
      h3: 'font-primary text-2xl font-medium md:text-[2rem]',
      h4: 'font-primary text-xl font-medium md:text-[1.75rem] italic',
      h5: 'font-primary text-xl font-normal italic',
      h6: 'font-primary text-lg font-normal italic',
      p: 'font-primary text-base font-normal',
      brand: `font-secondary ${size ? `text-${size}` : 'text-4xl'} font-bold uppercase ${size ? `md:text-${size}` : 'md:text-[3.5rem]'} ${color ? `text-${color}` : 'text-blue'}`,
      /** Article category label: color via `className` (e.g. `categoryLabelClassName`). */
      category: `font-primary ${size ? `text-${size}` : 'text-sm'} font-bold uppercase tracking-wide ${size ? `md:text-${size}` : 'md:text-base'} mb-0 leading-normal`,
    },
  },
});

type HeadlineColor = 'blue' | 'red' | 'green' | 'yellow' | 'offWhite' | 'gray' | 'lightGray';
type HeadlineIntent = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'brand' | 'category';

const headlineTagByIntent: Record<HeadlineIntent, ElementType> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  p: 'p',
  brand: 'span',
  category: 'span',
};

export type HeadlineSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';

export type HeadlineProps = {
  id?: string;
  /** Visual variant (typography, font). Defaults to `h1`. */
  styleAs?: HeadlineIntent;
  children: ReactNode;
  className?: string;
  /** All-caps display. `brand` and `category` styles are uppercase by default; use this for section labels (e.g. `h2`). */
  uppercase?: boolean;
  color?: HeadlineColor;
  size?: HeadlineSize;
  /**
   * DOM tag override. Typography comes from `styleAs`, or from `type` if `styleAs` is omitted.
   * Does not by itself switch font when `styleAs` is set (e.g. `styleAs="h1" type="brand"` → still Inter/h1 styles, `span` tag).
   * `styleAs="category"` renders a `span` (not a heading); pair with `categoryLabelClassName` (or similar) for accent color.
   */
  type?: HeadlineIntent;
};

export function Headline({ id, styleAs, children, className, color, type, size, uppercase }: HeadlineProps) {
  const visualIntent = styleAs ?? type ?? 'h1';
  const domIntent = type ?? styleAs ?? 'h1';
  const Tag = headlineTagByIntent[domIntent];

  return (
    <Tag
      id={id}
      className={cn(headlineStyles(color, size)({ styleAs: visualIntent }), uppercase && 'uppercase', className)}
    >
      {children}
    </Tag>
  );
}

const copyStyles = cva('whitespace-break-spaces', {
  variants: {
    color: {
      blue: 'text-blue',
      red: 'text-red',
      error: 'text-error',
      loading: 'text-loading',
      green: 'text-green',
      yellow: 'text-yellow',
      offWhite: 'text-off-white',
      gray: 'text-gray',
      lightGray: 'text-light-gray',
    },
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-xl',
    },
    weight: {
      normal: 'font-normal',
      bold: 'font-semibold',
    },
    disabled: {
      true: 'text-light-gray',
    },
  },
});

type CopyProps = {
  children: ReactNode;
  className?: string;
  size?: 'xs' | 'sm' | 'base' | 'lg';
  weight?: 'normal' | 'bold';
  color?: 'blue' | 'red' | 'error' | 'loading' | 'green' | 'yellow' | 'offWhite' | 'gray' | 'lightGray';
  disabled?: boolean;
};

export function Copy({
  children,
  size = 'base',
  weight = 'normal',
  disabled = false,
  color,
  className,
}: CopyProps): React.ReactNode {
  return <p className={cn(copyStyles({ size, weight, color, disabled }), className)}>{children}</p>;
}

/** Tertiary-style text link; hover / focus / active use `--text-link-hover` (lighter blue in light theme). */
export const textLinkStyles = cva(
  'block rounded-md border-none bg-[var(--button-tertiary)] px-1 py-2 text-lg text-[var(--button-tertiary-text)] transition-[color,text-decoration-color,background-color] hover:bg-[var(--button-tertiary-hover)] hover:text-[var(--text-link-hover)] focus-visible:bg-[var(--button-tertiary-hover)] focus-visible:text-[var(--text-link-hover)] focus-visible:outline-none active:bg-[var(--button-tertiary-hover)] active:text-[var(--text-link-hover)]',
  {
    variants: {
      underline: {
        true: 'underline decoration-from-font underline-offset-4 decoration-[var(--button-tertiary-text)] hover:decoration-[var(--text-link-hover)] focus-visible:decoration-[var(--text-link-hover)] active:decoration-[var(--text-link-hover)]',
        false: 'no-underline decoration-none hover:decoration-none focus-visible:decoration-none active:decoration-none',
      },
      current: {
        true: 'text-[var(--text-link-hover)]',
        false: '',
      },
    },
    compoundVariants: [
      {
        underline: true,
        current: true,
        class: 'decoration-[var(--text-link-hover)]',
      },
    ],
    defaultVariants: {
      underline: true,
      current: false,
    },
  },
);

export type TextLinkProps = Omit<ComponentPropsWithoutRef<typeof Link>, 'className'> & {
  className?: string;
  /** When true, uses `--text-link-hover` (same as hover) and sets `aria-current="page"`. */
  current?: boolean;
  underline?: boolean;
};

export const TextLink = forwardRef<HTMLAnchorElement, TextLinkProps>(function TextLink(
  { className, current = false, underline = true, ...props },
  ref,
) {
  return (
    <Link
      ref={ref}
      className={cn(textLinkStyles({ current, underline }), className)}
      aria-current={current ? 'page' : undefined}
      {...props}
    />
  );
});