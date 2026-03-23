import { isInternalUrl } from './isInternalUrl';

function getInternalPath(url: string): string | null {
  if (url.startsWith('/')) return url.split('#')[0];
  if (url.startsWith('#')) return url;
  return new URL(url).pathname;
}

export function getSanitizedHref(href?: string): string | null {
  if (!href) return null;
  const internalPath = href && isInternalUrl(href) ? getInternalPath(href) : null;

  if (!internalPath) return href;

  return href.includes('#') ? (href.startsWith('#') ? `#${href.split('#')[1]}` : href) : internalPath;
}
