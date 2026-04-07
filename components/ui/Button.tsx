'use client';

import type { MouseEventHandler, ReactNode } from 'react';
import React from 'react';

import Link from 'next/link';

import { cn } from '@/utils/cn';


import LoadingIcon from '@/ui/icons/loading';

import { cva } from 'class-variance-authority';
import { getSanitizedHref, isInternalUrl } from '@/utils';

const baseButtonClasses =
  'flex h-min w-full flex-nowrap items-center justify-center rounded-md border px-2 py-4 uppercase whitespace-nowrap md:w-fit cursor-pointer focus-ring';
const disabledClasses =
  'cursor-not-allowed border-gray-300 bg-gray-300 text-white hover:border-gray-300 hover:bg-gray-300 active:border-gray-300 active:bg-gray-300 focus-visible:border-gray-300 focus-visible:bg-gray-300 focus-visible:ring-0 cursor-not-allowed';

export const buttonStyles = cva(baseButtonClasses, {
  variants: {
    variant: {
      primary:
        'border-[var(--button-primary-border)] bg-[var(--button-primary)] text-[var(--button-primary-text)] hover:border-[var(--button-primary-hover-border)] hover:bg-[var(--button-primary-hover)] hover:text-[var(--button-primary-hover-text)] active:border-[var(--button-primary-hover-border)] active:bg-[var(--button-primary-hover)] active:text-[var(--button-primary-hover-text)] focus-visible:border-[var(--button-primary-hover-border)] focus-visible:bg-[var(--button-primary-hover)] focus-visible:text-[var(--button-primary-hover-text)]',
      secondary:
        'border-[var(--button-secondary-border)] bg-[var(--button-secondary)] text-[var(--button-secondary-text)] hover:border-[var(--button-secondary-hover-border)] hover:bg-[var(--button-secondary-hover)] hover:text-[var(--button-secondary-hover-text)] active:border-[var(--button-secondary-hover-border)] active:bg-[var(--button-secondary-hover)] active:text-[var(--button-secondary-hover-text)] focus-visible:border-[var(--button-secondary-hover-border)] focus-visible:bg-[var(--button-secondary-hover)] focus-visible:text-[var(--button-secondary-hover-text)]',
      tertiary:
        'border-none underline bg-[var(--button-tertiary)] text-[var(--button-tertiary-text)] hover:bg-[var(--button-tertiary-hover)] hover:text-[var(--button-tertiary-hover-text)] active:bg-[var(--button-tertiary-hover)] active:text-[var(--button-tertiary-hover-text)] focus-visible:bg-[var(--button-tertiary-hover)] focus-visible:text-[var(--button-tertiary-hover-text)]',
      iconOnly: 'border-none'
    },
    layout: {
      labelOnly: 'px-8',
      labelWithIcon: 'justify-between gap-2 px-8',
      iconOnly: 'px-3',
    },
    alignleft: {
      true: 'pl-0',
      false: '',
    },
    fullWidth: {
      true: 'md:w-full',
    },
    disabled: {
      true: disabledClasses,
      false: '',
    },
  },
  compoundVariants: [
    {
      variant: ['primary', 'secondary', 'tertiary', 'iconOnly'],
      disabled: true,
      class: disabledClasses,
    },
    /** Full-width rows: `labelWithIcon` alone uses space-between; with alignleft, keep icon beside the label. */
    {
      layout: 'labelWithIcon',
      alignleft: true,
      class: 'justify-start',
    },
  ],
  defaultVariants: {
    variant: 'primary',
  },
});

const buttonContentStyles = cva('font-semibold', {
  variants: {
    truncateLabel: {
      true: 'truncate',
      false: '',
    },
    labelHidden: {
      true: 'sr-only',
      false: '',
    },
  },
});

export type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'iconOnly';
  label: string | ReactNode;
  labelHidden?: boolean;
  type?: 'button' | 'submit' | 'reset';
  icon?: ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  alignleft?: boolean;
  className?: string;
  href?: string;
  fullWidth?: boolean;
  truncateLabel?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
  onClick?: MouseEventHandler<HTMLAnchorElement | HTMLButtonElement> | undefined;
};

function Button({
  variant = 'primary',
  label,
  labelHidden = false,
  type = 'button',
  icon,
  isLoading = false,
  disabled = false,
  alignleft = false,
  className,
  href,
  fullWidth,
  truncateLabel = false,
  ref,
  onClick,
  ...rest
}: ButtonProps) {
  const usedIcon = isLoading ? <LoadingIcon /> : icon;
  const hasVisualIcon = Boolean(usedIcon);

  /** Only hide label visually when an icon (or spinner) is present; otherwise sr-only would leave an empty-looking control. */
  const hideLabelVisually = Boolean(labelHidden && hasVisualIcon);
  const layout =
    variant === 'iconOnly'
      ? 'iconOnly'
      : hideLabelVisually
        ? 'iconOnly'
        : hasVisualIcon
          ? 'labelWithIcon'
          : 'labelOnly';

  const buttonClasses = cn(buttonStyles({ variant, layout, disabled, fullWidth, alignleft }), className);

  const fallbackContent = (
    <span className="font-semibold">
      {variant[0].toUpperCase() + variant.slice(1)} Button
    </span>
  );

  const content = (
    <>
      {!label && !usedIcon && fallbackContent}
      {label && (
        <span className={buttonContentStyles({ truncateLabel, labelHidden: hideLabelVisually })}>
          {label}
        </span>
      )}
      {usedIcon && <span data-testid="icon">{usedIcon}</span>}
    </>
  );

  const sanitizedHref = getSanitizedHref(href);

  const target = href && !isInternalUrl(href) ? '_blank' : undefined;

  function handleClick(event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement, MouseEvent>) {
    if (onClick) onClick(event);
  }

  return sanitizedHref ? (
    <Link
      className={buttonClasses}
      href={sanitizedHref}
      target={target}
      onClick={handleClick}
      {...rest}
    >
      {content}
    </Link>
  ) : (
    <button
      ref={ref}
      type={type}
      className={buttonClasses}
      disabled={disabled}
      onClick={handleClick}
      {...rest}
    >
      {content}
    </button>
  );
}

export default Button;
