/**
 * Blog Data Module
 *
 * Central export for all blog-related data types and functions.
 *
 * @module lib/data/blog
 */

// Types
export * from './types';

// Data Access - Listing
export {
  getBlogListing,
  getEmptyBlogListingData,
  getDefaultCategories,
  hasFeaturedPost,
  hasAgencyPosts,
  hasHotelSpotlights,
  hasTravelerTips,
  hasAnyContent,
  type BlogListingDataSource,
  type GetBlogListingOptions,
} from './getBlogListing';

// Data Access - Article
export {
  getBlogArticle,
  getAllArticleSlugs,
  getEmptyArticle,
  getEmptyRelatedArticles,
  getEmptyComments,
  generateArticleStructuredData,
  generateFAQStructuredData,
  generateBreadcrumbStructuredData,
  isValidArticle,
  hasRelatedArticles,
  hasComments,
  hasCTAOffer,
  hasFAQs,
  hasQuickFacts,
  type BlogArticleDataSource,
  type GetBlogArticleOptions,
  type GetAllSlugsOptions,
} from './getBlogArticle';

// Data Source Factory
export {
  createDataSource,
  initializeDataSource,
  getDataSource,
  resetDataSource,
  createDataSourceFromEnv,
  type DataSourceType,
  type DataSourceConfig,
} from './dataSource';
