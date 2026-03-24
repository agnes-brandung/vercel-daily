export function isInternalUrl(url: string) {
  return (
    url.startsWith('#') ||
    url.startsWith('/') ||
    url.startsWith('http://localhost')
  );
}
