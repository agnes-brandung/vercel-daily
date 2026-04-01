import { Fragment, type ReactNode } from 'react';
import Link from 'next/link';

import { getSanitizedHref } from '@/utils/getSanitizedHref';

const inlineLinkClassName =
  'text-blue underline underline-offset-2 decoration-from-font hover:text-[var(--text-link-hover)] focus-ring';

const inlineEmClassName = 'font-medium not-italic text-[var(--article-accent,var(--color-blue))]';

function isSafeHref(href: string): boolean {
  const t = href.trim().toLowerCase();
  return !t.startsWith('javascript:') && !t.startsWith('data:') && !t.startsWith('vbscript:');
}

function InlineLink({ href, children }: { href: string; children: ReactNode }) {
  const raw = href.trim();
  if (!raw || !isSafeHref(raw)) {
    return <>{children}</>;
  }
  const safe = getSanitizedHref(raw) ?? raw;
  if (safe.startsWith('mailto:')) {
    return <a href={safe} className={inlineLinkClassName}>{children}</a>;
  }
  if (safe.startsWith('http://') || safe.startsWith('https://')) {
    return (
      <a href={safe} className={inlineLinkClassName} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  if (safe.startsWith('/') || safe.startsWith('#')) {
    return (
      <Link href={safe} className={inlineLinkClassName}>
        {children}
      </Link>
    );
  }
  return <>{children}</>;
}

type TokenMatch =
  | { start: number; end: number; type: 'link'; label: string; href: string }
  | { start: number; end: number; type: 'bold'; inner: string }
  | { start: number; end: number; type: 'em'; inner: string };

function findFirstToken(text: string): TokenMatch | null {
  const candidates: Array<TokenMatch & { priority: number }> = [];

  const linkRe = /\[([^\]]*)\]\(([^)]*)\)/g;
  let m: RegExpExecArray | null;
  while ((m = linkRe.exec(text)) !== null) {
    candidates.push({
      start: m.index,
      end: m.index + m[0].length,
      type: 'link',
      label: m[1],
      href: m[2],
      priority: 0,
    });
  }

  const boldRe = /\*\*([\s\S]+?)\*\*/g;
  while ((m = boldRe.exec(text)) !== null) {
    candidates.push({
      start: m.index,
      end: m.index + m[0].length,
      type: 'bold',
      inner: m[1],
      priority: 1,
    });
  }

  const emRe = /(?<!\*)\*([^*\n]+?)\*(?!\*)/g;
  while ((m = emRe.exec(text)) !== null) {
    candidates.push({
      start: m.index,
      end: m.index + m[0].length,
      type: 'em',
      inner: m[1],
      priority: 2,
    });
  }

  if (candidates.length === 0) {
    return null;
  }

  candidates.sort((a, b) => {
    if (a.start !== b.start) {
      return a.start - b.start;
    }
    return a.priority - b.priority;
  });

  const first = candidates[0];
  if (first.type === 'link') {
    return { start: first.start, end: first.end, type: 'link', label: first.label, href: first.href };
  }
  if (first.type === 'bold') {
    return { start: first.start, end: first.end, type: 'bold', inner: first.inner };
  }
  return { start: first.start, end: first.end, type: 'em', inner: first.inner };
}

function parseInline(text: string): ReactNode[] {
  if (!text) {
    return [];
  }
  const token = findFirstToken(text);
  if (!token) {
    return [text];
  }
  const before = text.slice(0, token.start);
  const after = text.slice(token.end);

  let middle: ReactNode;
  switch (token.type) {
    case 'link':
      middle = (
        <InlineLink href={token.href}>
          {renderInlineFragment(token.label)}
        </InlineLink>
      );
      break;
    case 'bold':
      middle = <strong className="font-semibold">{renderInlineFragment(token.inner)}</strong>;
      break;
    case 'em':
      middle = <em className={inlineEmClassName}>{renderInlineFragment(token.inner)}</em>;
      break;
  }

  return [...parseInline(before), middle, ...parseInline(after)];
}

function renderInlineFragment(text: string): ReactNode {
  const nodes = parseInline(text);
  if (nodes.length === 0) {
    return null;
  }
  if (nodes.length === 1) {
    return nodes[0];
  }
  return (
    <>
      {nodes.map((n, i) => (
        <Fragment key={i}>{n}</Fragment>
      ))}
    </>
  );
}

/** Renders a small subset of Markdown inline: `[label](url)`, `**bold**`, `*accent*` (single asterisks, not `**`). */
export function renderInlineMarkdown(text: string): ReactNode {
  return renderInlineFragment(text);
}
