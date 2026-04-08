import { Copy, Headline } from '@/ui/Typography';
import { cn } from '@/utils/cn';
import { ImageWithFallback } from '@/components/ui/PlaceholderImg';
import { renderInlineMarkdown } from '@/utils/renderInlineMarkdown';

function isApiContentBlockArray(value: ApiArticle['content']): value is ApiContentBlock[] {
  return Array.isArray(value);
}

function isArticleContentPlainText(value: ApiArticle['content']): value is ArticleContentPlainText {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    'text' in value &&
    typeof (value as ArticleContentPlainText).text === 'string'
  );
}

/** Normalizes API payloads: block array or plain-text `{ type, text }` body. */
export function normalizeArticleContent(content: ApiArticle['content']): ApiContentBlock[] {
  if (isApiContentBlockArray(content)) {
    return content;
  }
  if (isArticleContentPlainText(content)) {
    const text = content.text.trim();
    return text ? [{ type: 'paragraph', text }] : [];
  }
  return [];
}

function nonEmptyListItems(items: string[]): string[] {
  return items.map((s) => s.trim()).filter(Boolean);
}

function ApiContentBlockView({ block, index }: { block: ApiContentBlock; index: number }) {
  switch (block.type) {
    case 'paragraph': {
      const text = block.text?.trim();
      if (!text) {
        return null;
      }
      return (
        <Copy key={index}>
          {renderInlineMarkdown(text)}
        </Copy>
      );
    }
    case 'heading': {
      const text = block.text?.trim();
      if (!text) {
        return null;
      }
      return (
        <Headline
          key={index}
          type={block.level === 2 ? 'h2' : 'h3'}
          styleAs={block.level === 2 ? 'h2' : 'h3'}
          className="text-balance"
        >
          {renderInlineMarkdown(text)}
        </Headline>
      );
    }
    case 'blockquote': {
      const text = block.text?.trim();
      if (!text) {
        return null;
      }
      return (
        <blockquote
          key={index}
          className={cn(
            'border-l-4 border-blue pl-4 text-typography',
            'my-0 py-1 font-primary text-base leading-relaxed italic',
          )}
        >
          {renderInlineMarkdown(text)}
        </blockquote>
      );
    }
    case 'unordered-list': {
      const items = nonEmptyListItems(block.items ?? []);
      if (items.length === 0) {
        return null;
      }
      return (
        <ul
          key={index}
          className="list-inside list-disc space-y-2 pl-1 font-primary text-base leading-relaxed text-typography"
        >
          {items.map((item, i) => (
            <li key={i}>{renderInlineMarkdown(item)}</li>
          ))}
        </ul>
      );
    }
    case 'ordered-list': {
      const items = nonEmptyListItems(block.items ?? []);
      if (items.length === 0) {
        return null;
      }
      return (
        <ol
          key={index}
          className="list-inside list-decimal space-y-2 pl-1 font-primary text-base leading-relaxed text-typography"
        >
          {items.map((item, i) => (
            <li key={i}>{renderInlineMarkdown(item)}</li>
          ))}
        </ol>
      );
    }
    case 'image': {
      const src = block.src?.trim();
      if (!src) {
        return null;
      }
      return (
        <figure key={index} className="my-0">
          <div className="article-hero-figure overflow-hidden border border-border bg-muted">
            <ImageWithFallback
              src={src}
              alt={block.alt}
              width={1200}
              height={675}
              sizes="(max-width: 768px) 100vw, min(896px, 100vw)"
              className="h-auto w-full object-cover"
            />
          </div>
          {block.caption?.trim() ? (
            <figcaption className="mt-2 text-center">
              <Copy size="sm" color="lightGray">
                {renderInlineMarkdown(block.caption.trim())}
              </Copy>
            </figcaption>
          ) : null}
        </figure>
      );
    }
    default:
      return null;
  }
}

export interface ArticleContentRteProps {
  content: ApiArticle['content'];
  className?: string;
}

export function ArticleContentRte({ content, className }: ArticleContentRteProps) {
  const blocks = normalizeArticleContent(content);

  if (blocks.length === 0) {
    return null;
  }

  return (
    <div className={cn('article-content-rte space-y-6', className)}>
      {blocks.map((block, index) => (
        <ApiContentBlockView key={index} block={block} index={index} />
      ))}
    </div>
  );
}
