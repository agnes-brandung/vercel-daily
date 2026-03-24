import type { ElementType, ReactNode } from 'react';

import { cva } from 'class-variance-authority';

import { cn } from '@/utils/cn';

export const headlineStyles = (color?: HeadlineColor) => cva('hyphens-auto', {
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
      h1: `font-primary text-4xl font-bold uppercase md:text-[3.5rem] ${color ? `text-${color}` : 'text-blue'}`,
      h2: 'font-primary text-2xl uppercase font-bold md:text-[2.5rem]',
      h3: 'font-primary text-2xl font-medium uppercase md:text-[2rem]',
      h4: 'font-primary text-xl font-medium md:text-[1.75rem]',
      h5: 'font-primary text-xl font-normal',
      h6: 'font-primary text-lg font-normal',
      p: 'font-primary text-base font-normal',
      brand: `font-secondary text-4xl font-bold uppercase md:text-[3.5rem] ${color ? `text-${color}` : 'text-blue'}`,
    },
  },
});

type HeadlineColor = 'blue' | 'red' | 'green' | 'yellow' | 'offWhite' | 'gray' | 'lightGray';
type HeadlineIntent = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'brand';

const headlineTagByIntent: Record<HeadlineIntent, ElementType> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  p: 'p',
  brand: 'span',
};

export type HeadlineProps = {
  id?: string;
  /** Visual variant (typography, font). Defaults to `h1`. */
  styleAs?: HeadlineIntent;
  children: ReactNode;
  className?: string;
  color?: HeadlineColor;
  /**
   * DOM tag override. Typography comes from `styleAs`, or from `type` if `styleAs` is omitted.
   * Does not by itself switch font when `styleAs` is set (e.g. `styleAs="h1" type="brand"` → still Inter/h1 styles, `span` tag).
   */
  type?: HeadlineIntent;
};

export function Headline({ id, styleAs, children, className, color, type }: HeadlineProps) {
  const visualIntent = styleAs ?? type ?? 'h1';
  const domIntent = type ?? styleAs ?? 'h1';
  const Tag = headlineTagByIntent[domIntent];

  return (
    <Tag id={id} className={cn(headlineStyles(color)({ styleAs: visualIntent }), className)}>
      {children}
    </Tag>
  );
}

const copyStyles = cva('whitespace-break-spaces', {
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
  color?: 'blue' | 'red' | 'green' | 'yellow' | 'offWhite' | 'gray' | 'lightGray';
  disabled?: boolean;
};

export default function Copy({
  children,
  size = 'base',
  weight = 'normal',
  disabled = false,
  color,
  className,
}: CopyProps): React.ReactNode {
  return <p className={cn(copyStyles({ size, weight, color, disabled }), className)}>{children}</p>;
}
