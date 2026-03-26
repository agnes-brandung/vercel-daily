type ApiArticleCategory = 'changelog' | 'engineering' | 'customers' | 'company-news' | 'community';

/** Rich article body: array of typed blocks from the API. */
type ContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; level: 2 | 3; text: string }
  | { type: 'blockquote'; text: string }
  | { type: 'unordered-list'; items: string[] }
  | { type: 'ordered-list'; items: string[] }
  | { type: 'image'; src: string; alt: string; caption?: string };

/** Single plain-text body (not block-based); normalized to paragraph blocks in the RTE. */
interface ArticleContentPlainText {
  type: string;
  text: string;
}

interface ApiArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: ContentBlock[] | ArticleContentPlainText;
  category: ApiArticleCategory;
  author: {
    name: string;
    avatar?: string;
  }
  image: string;
  publishedAt: string;
  featured: boolean;
  tags: string[];
}

interface ApiBreakingNews {
  id: string
  headline: string;
  summary: string;
  articleId: string;
  category: ApiArticleCategory;
  publishedAt: string;
  urgent: boolean;
}