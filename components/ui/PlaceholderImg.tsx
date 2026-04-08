'use client';

import Image, { type ImageProps } from 'next/image';
import { useCallback, useState } from 'react';

import { cn } from '@/utils/cn';

export const PLACEHOLDER_IMAGE_SRC = '/vercel-logo.svg';

export interface ImageWithFallbackProps extends Omit<ImageProps, 'onError' | 'src'> {
  src: string;
  fallbackSrc?: string;
}

/**
 * Next.js `Image` that swaps to the local placeholder when the primary `src` fails
 * (broken URL, 404, optimizer error, etc.).
 */
export function ImageWithFallback({
  src,
  fallbackSrc = PLACEHOLDER_IMAGE_SRC,
  alt,
  className,
  ...rest
}: ImageWithFallbackProps) {
  const [useFallback, setUseFallback] = useState(false);
  const effectiveSrc = useFallback ? fallbackSrc : src;

  const handleError = useCallback(() => {
    setUseFallback(true);
  }, []);

  return (
    <Image
      {...rest}
      src={effectiveSrc}
      alt={useFallback ? '' : alt}
      onError={handleError}
      className={cn(
        className,
        useFallback && 'object-contain object-center p-6 sm:p-8',
      )}
    />
  );
}

export interface PlaceholderImgProps {
  className?: string;
  /** When true, parent must be `position: relative` with a defined box (e.g. aspect ratio). */
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
}

/** Standalone Vercel logo for empty states or manual use beside {@link ImageWithFallback}. */
export function PlaceholderImg({ className, fill, sizes = '200px', priority }: PlaceholderImgProps) {
  if (fill) {
    return (
      <Image
        src={PLACEHOLDER_IMAGE_SRC}
        alt=""
        fill
        sizes={sizes}
        priority={priority}
        className={cn('object-contain object-center p-6', className)}
      />
    );
  }

  return (
    <Image
      src={PLACEHOLDER_IMAGE_SRC}
      alt=""
      width={262}
      height={52}
      priority={priority}
      className={cn('h-auto w-full max-h-12 object-contain object-left', className)}
    />
  );
}
