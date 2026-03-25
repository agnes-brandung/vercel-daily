type ApiArticleCategory = 'changelog' | 'engineering' | 'customers' | 'company-news' | 'community';

interface ApiArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: {
    type: string;
    text: string;
  }
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