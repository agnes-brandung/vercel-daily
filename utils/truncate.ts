/** Trims and shortens `text` to at most `maxChars` characters, appending an ellipsis when truncated. */
export function truncate(text: string, maxChars: number): string {
  const t = text.trim();
  if (t.length <= maxChars) {
    return t;
  }
  return `${t.slice(0, maxChars - 1).trimEnd()}…`;
}
