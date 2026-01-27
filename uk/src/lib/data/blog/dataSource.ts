/**
 * Blog Data Source Factory
 *
 * Provides a factory pattern for creating blog data sources.
 * Supports multiple backends: Markdown, CMS, API, Database.
 *
 * Architecture: Factory Pattern + Strategy Pattern
 * - Factory: Creates appropriate data source based on configuration
 * - Strategy: Each data source implements the same interface
 *
 * @module lib/data/blog/dataSource
 */

import type {
  BlogListingDataSource,
} from './getBlogListing';

import type {
  BlogArticleDataSource,
} from './getBlogArticle';

// ============================================
// Data Source Types
// ============================================

export type DataSourceType = 'dummy' | 'markdown' | 'cms' | 'api' | 'database';

export interface DataSourceConfig {
  type: DataSourceType;
  /** Base URL for API/CMS */
  baseUrl?: string;
  /** API key or authentication token */
  apiKey?: string;
  /** Content directory path (for Markdown) */
  contentPath?: string;
  /** Cache TTL in seconds */
  cacheTtl?: number;
}

// ============================================
// Empty Data Source (Default Fallback)
// ============================================

import type {
  FeaturedPost,
  CategoryFilter,
  BlogPostCard,
  HotelSpotlightPost,
  TravelerTipPost,
  BlogArticleFull,
  RelatedArticle,
  Comment,
  CTAOffer,
} from './types';

/**
 * Empty data source that returns safe defaults.
 * Used when no data source is configured.
 */
class EmptyDataSource implements BlogListingDataSource, BlogArticleDataSource {
  async getFeaturedPost(): Promise<FeaturedPost | null> {
    return null;
  }

  async getCategories(): Promise<CategoryFilter[]> {
    return [];
  }

  async getAgencyPosts(): Promise<BlogPostCard[]> {
    return [];
  }

  async getHotelSpotlights(): Promise<HotelSpotlightPost[]> {
    return [];
  }

  async getTravelerTips(): Promise<TravelerTipPost[]> {
    return [];
  }

  async getArticleBySlug(): Promise<BlogArticleFull | null> {
    return null;
  }

  async getRelatedArticles(): Promise<RelatedArticle[]> {
    return [];
  }

  async getComments(): Promise<Comment[]> {
    return [];
  }

  async getCTAOffer(): Promise<CTAOffer | null> {
    return null;
  }

  async getAllSlugs(): Promise<string[]> {
    return [];
  }
}

// ============================================
// Data Source Factory
// ============================================

let currentDataSource: (BlogListingDataSource & BlogArticleDataSource) | null = null;

/**
 * Creates a data source based on configuration.
 * Extend this function to add new data source types.
 */
export function createDataSource(config: DataSourceConfig): BlogListingDataSource & BlogArticleDataSource {
  switch (config.type) {
    case 'dummy':
      // TEMP: Dummy data source for UI preview only
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { DummyBlogDataSource } = require('./dummyData');
      return new DummyBlogDataSource();

    case 'markdown':
      // TODO: Implement MarkdownDataSource
      // return new MarkdownDataSource(config);
      return new EmptyDataSource();

    case 'cms':
      // TODO: Implement CMSDataSource (Strapi, Contentful, Sanity, etc.)
      // return new CMSDataSource(config);
      return new EmptyDataSource();

    case 'api':
      // TODO: Implement APIDataSource
      // return new APIDataSource(config);
      return new EmptyDataSource();

    case 'database':
      // TODO: Implement DatabaseDataSource (Prisma, Drizzle, etc.)
      // return new DatabaseDataSource(config);
      return new EmptyDataSource();

    default:
      return new EmptyDataSource();
  }
}

/**
 * Initializes the global data source.
 * Call this once at application startup.
 */
export function initializeDataSource(config: DataSourceConfig): void {
  currentDataSource = createDataSource(config);
}

/**
 * Gets the current data source.
 * Returns empty data source if not initialized.
 */
export function getDataSource(): BlogListingDataSource & BlogArticleDataSource {
  if (!currentDataSource) {
    return new EmptyDataSource();
  }
  return currentDataSource;
}

/**
 * Resets the data source (useful for testing).
 */
export function resetDataSource(): void {
  currentDataSource = null;
}

// ============================================
// Environment-based Configuration
// ============================================

/**
 * Creates data source from environment variables.
 * Usage: initializeDataSource(createDataSourceFromEnv());
 */
export function createDataSourceFromEnv(): DataSourceConfig {
  // TEMP: Default to 'dummy' for UI preview. Change to 'markdown' for production.
  const type = (process.env.BLOG_DATA_SOURCE as DataSourceType) || 'dummy';

  return {
    type,
    baseUrl: process.env.BLOG_API_URL,
    apiKey: process.env.BLOG_API_KEY,
    contentPath: process.env.BLOG_CONTENT_PATH || './content/blog',
    cacheTtl: parseInt(process.env.BLOG_CACHE_TTL || '300', 10),
  };
}
