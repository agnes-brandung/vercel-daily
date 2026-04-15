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
 *
 * **`preload` / `loading` / `fetchPriority`:** Passed through explicitly (not only via `...rest`) so
 * dev-time LCP detection in `getImgProps` always sees non-lazy, high-priority hero images — same values
 * the underlying `Image` would read, but explicit ordering keeps `loading` immediately before `src`
 * (Next.js recommendation for Safari).
 */
export function ImageWithFallback({
  src,
  fallbackSrc = PLACEHOLDER_IMAGE_SRC,
  alt,
  className,
  preload,
  loading,
  fetchPriority,
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
      preload={preload}
      fetchPriority={fetchPriority}
      loading={loading}
      src={effectiveSrc}
      alt={useFallback ? 'Placeholder Vercel Logo' : alt}
      onError={handleError}
      className={cn(
        className,
        useFallback && 'object-contain object-center p-6 sm:p-8',
      )}
    />
  );
}