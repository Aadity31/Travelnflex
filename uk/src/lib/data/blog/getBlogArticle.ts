/**
 * Blog Article Data Access Layer
 * 
 * Provides data fetching for individual blog articles with:
 * - Empty-state safe handling
 * - Type-safe data contracts
 * - SEO metadata generation
 * - Structured data support
 * 
 * @module lib/data/blog/getBlogArticle
 */

import type {
  BlogArticle,
  BlogArticleFull,
  RelatedArticle,
  Comment,
  CTAOffer,
  ArticleStructuredData,
  FAQStructuredData,
  BreadcrumbStructuredData,
  FAQ,
} from './types';

import { getDataSource } from './dataSource';

// ============================================
// Data Source Interface
// ============================================

/**
 * Abstract data source interface for blog articles
 * Implement this for different data sources (Markdown, CMS, API)
 */
export interface BlogArticleDataSource {
  getArticleBySlug(slug: string): Promise<BlogArticleFull | null>;
  getRelatedArticles(articleId: string, limit?: number): Promise<RelatedArticle[]>;
  getComments(articleId: string): Promise<Comment[]>;
  getCTAOffer(articleId: string): Promise<CTAOffer | null>;
}

// ============================================
// Empty State Defaults
// ============================================

/**
 * Returns null for missing article (404 case)
 * Components should handle null gracefully with notFound()
 */
export function getEmptyArticle(): null {
  return null;
}

/**
 * Returns empty related articles array
 */
export function getEmptyRelatedArticles(): RelatedArticle[] {
  return [];
}

/**
 * Returns empty comments array
 */
export function getEmptyComments(): Comment[] {
  return [];
}

// ============================================
// Structured Data Generators
// ============================================

/**
 * Generates Article structured data for SEO
 */
export function generateArticleStructuredData(
  article: BlogArticle,
  siteUrl: string
): ArticleStructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.seo.metaDescription,
    image: [article.heroImage],
    datePublished: article.publishedAt,
    author: {
      '@type': 'Organization',
      name: article.publisher.name,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Devbhoomi Darshan',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/blog/${article.slug}`,
    },
  };
}

/**
 * Generates FAQ structured data for SEO
 */
export function generateFAQStructuredData(faqs: FAQ[]): FAQStructuredData | null {
  if (faqs.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generates Breadcrumb structured data for SEO
 */
export function generateBreadcrumbStructuredData(
  breadcrumbs: { label: string; href: string }[],
  siteUrl: string
): BreadcrumbStructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.label,
      item: crumb.href.startsWith('http') ? crumb.href : `${siteUrl}${crumb.href}`,
    })),
  };
}

// ============================================
// Main Data Fetching Function
// ============================================

export interface GetBlogArticleOptions {
  /** Data source implementation */
  dataSource?: BlogArticleDataSource;
  /** Number of related articles to fetch */
  relatedLimit?: number;
  /** Site URL for structured data */
  siteUrl?: string;
}

/**
 * Fetches a blog article by slug with empty-state safety
 * 
 * @param slug - Article URL slug
 * @param options - Fetch options
 * @returns Blog article or null if not found
 * 
 * @example
 * ```ts
 * const article = await getBlogArticle('exploring-rishikesh');
 * if (!article) {
 *   notFound(); // Next.js 404
 * }
 * ```
 */
export async function getBlogArticle(
  slug: string,
  options: GetBlogArticleOptions = {}
): Promise<BlogArticleFull | null> {
  const { dataSource, relatedLimit = 3, siteUrl = '' } = options;

  // Use provided data source or fall back to global data source
  const source = dataSource ?? getDataSource();

  // If no data source available, return null
  if (!source) {
    return null;
  }

  try {
    const article = await source.getArticleBySlug(slug);

    if (!article) {
      return null;
    }

    // Fetch additional data in parallel
    const [relatedArticles, comments, ctaOffer] = await Promise.all([
      source.getRelatedArticles(article.id, relatedLimit).catch(() => []),
      source.getComments(article.id).catch(() => []),
      source.getCTAOffer(article.id).catch(() => null),
    ]);

    // Generate structured data
    const faqData = article.faqs ? generateFAQStructuredData(article.faqs) : undefined;
    const structuredData = {
      article: generateArticleStructuredData(article, siteUrl),
      ...(faqData && { faq: faqData }),
      breadcrumb: generateBreadcrumbStructuredData(article.breadcrumbs, siteUrl),
    };

    return {
      ...article,
      relatedArticles,
      comments,
      commentCount: comments.length,
      ctaOffer: ctaOffer ?? article.ctaOffer,
      structuredData,
    };
  } catch (error) {
    console.error(`[getBlogArticle] Error fetching article "${slug}":`, error);
    return null;
  }
}

// ============================================
// Static Params Generation (for SSG)
// ============================================

export interface GetAllSlugsOptions {
  dataSource?: {
    getAllSlugs(): Promise<string[]>;
  };
}

/**
 * Gets all article slugs for static generation
 * 
 * @example
 * ```ts
 * // In page.tsx
 * export async function generateStaticParams() {
 *   const slugs = await getAllArticleSlugs();
 *   return slugs.map((slug) => ({ slug }));
 * }
 * ```
 */
export async function getAllArticleSlugs(
  options: GetAllSlugsOptions = {}
): Promise<string[]> {
  const { dataSource } = options;

  // Use provided data source or fall back to global data source
  const source = dataSource ?? getDataSource();

  if (!source) {
    return [];
  }

  try {
    // Check if source has getAllSlugs method
    if ('getAllSlugs' in source && typeof source.getAllSlugs === 'function') {
      return await source.getAllSlugs();
    }
    return [];
  } catch (error) {
    console.error('[getAllArticleSlugs] Error:', error);
    return [];
  }
}

// ============================================
// Type Guards
// ============================================

export function isValidArticle(article: BlogArticleFull | null): article is BlogArticleFull {
  return article !== null && typeof article.slug === 'string' && article.slug.length > 0;
}

export function hasRelatedArticles(article: BlogArticleFull): boolean {
  return article.relatedArticles.length > 0;
}

export function hasComments(article: BlogArticleFull): boolean {
  return article.comments.length > 0;
}

export function hasCTAOffer(article: BlogArticleFull): boolean {
  return article.ctaOffer !== null && article.ctaOffer !== undefined;
}

export function hasFAQs(article: BlogArticleFull): boolean {
  return article.faqs !== undefined && article.faqs.length > 0;
}

export function hasQuickFacts(article: BlogArticleFull): boolean {
  return article.quickFacts !== undefined;
}
