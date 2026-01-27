/**
 * Blog Listing Data Access Layer
 *
 * Provides data fetching for the blog listing page with:
 * - Empty-state safe handling
 * - Type-safe data contracts
 * - Support for multiple data sources (Markdown, CMS, API)
 *
 * @module lib/data/blog/getBlogListing
 */

import type {
  BlogListingData,
  FeaturedPost,
  BlogPostCard,
  HotelSpotlightPost,
  TravelerTipPost,
  CategoryFilter,
} from './types';

import { getDataSource } from './dataSource';

// ============================================
// Data Source Interface
// ============================================

/**
 * Abstract data source interface for blog listing
 * Implement this for different data sources (Markdown, CMS, API)
 */
export interface BlogListingDataSource {
  getFeaturedPost(): Promise<FeaturedPost | null>;
  getCategories(): Promise<CategoryFilter[]>;
  getAgencyPosts(limit?: number): Promise<BlogPostCard[]>;
  getHotelSpotlights(limit?: number): Promise<HotelSpotlightPost[]>;
  getTravelerTips(limit?: number): Promise<TravelerTipPost[]>;
}

// ============================================
// Empty State Defaults
// ============================================

/**
 * Returns safe empty defaults for blog listing data
 * UI components should handle these gracefully
 */
export function getEmptyBlogListingData(): BlogListingData {
  return {
    featuredPost: null as unknown as FeaturedPost, // Will be handled by null check
    categories: [],
    agencyPosts: [],
    hotelSpotlights: [],
    travelerTips: [],
  };
}

// ============================================
// Default Categories (Static Configuration)
// ============================================

export function getDefaultCategories(): CategoryFilter[] {
  return [
    { slug: 'all', label: 'All Stories', icon: 'grid' },
    { slug: 'agencies', label: 'Agencies', icon: 'briefcase' },
    { slug: 'hotels', label: 'Hotels', icon: 'building' },
    { slug: 'tips', label: 'Owner Tips', icon: 'lightbulb' },
    { slug: 'adventure', label: 'Adventure', icon: 'mountain' },
    { slug: 'culture', label: 'Culture', icon: 'globe' },
  ];
}

// ============================================
// Main Data Fetching Function
// ============================================

export interface GetBlogListingOptions {
  /** Data source implementation */
  dataSource?: BlogListingDataSource;
  /** Category filter */
  category?: string;
  /** Number of agency posts to fetch */
  agencyPostsLimit?: number;
  /** Number of hotel spotlights to fetch */
  hotelSpotlightsLimit?: number;
  /** Number of traveler tips to fetch */
  travelerTipsLimit?: number;
}

/**
 * Fetches blog listing data with empty-state safety
 *
 * @param options - Fetch options
 * @returns Blog listing data or empty defaults
 *
 * @example
 * ```ts
 * const data = await getBlogListing();
 * // data is always defined, check individual fields for content
 * if (data.agencyPosts.length === 0) {
 *   // Show empty state UI
 * }
 * ```
 */
export async function getBlogListing(
  options: GetBlogListingOptions = {}
): Promise<BlogListingData> {
  const {
    dataSource,
    agencyPostsLimit = 3,
    hotelSpotlightsLimit = 2,
    travelerTipsLimit = 4,
  } = options;

  // Use provided data source or fall back to global data source
  const source = dataSource ?? getDataSource();

  // If no data source available, return empty defaults with categories
  if (!source) {
    return {
      ...getEmptyBlogListingData(),
      categories: getDefaultCategories(),
    };
  }

  try {
    // Fetch all data in parallel for performance
    const [
      featuredPost,
      categories,
      agencyPosts,
      hotelSpotlights,
      travelerTips,
    ] = await Promise.all([
      source.getFeaturedPost().catch(() => null),
      source.getCategories().catch(() => getDefaultCategories()),
      source.getAgencyPosts(agencyPostsLimit).catch(() => []),
      source.getHotelSpotlights(hotelSpotlightsLimit).catch(() => []),
      source.getTravelerTips(travelerTipsLimit).catch(() => []),
    ]);

    return {
      featuredPost: featuredPost as FeaturedPost,
      categories: categories.length > 0 ? categories : getDefaultCategories(),
      agencyPosts,
      hotelSpotlights,
      travelerTips,
    };
  } catch (error) {
    console.error('[getBlogListing] Error fetching data:', error);
    return {
      ...getEmptyBlogListingData(),
      categories: getDefaultCategories(),
    };
  }
}

// ============================================
// Type Guards
// ============================================

export function hasFeaturedPost(data: BlogListingData): data is BlogListingData & { featuredPost: FeaturedPost } {
  return data.featuredPost !== null && data.featuredPost !== undefined;
}

export function hasAgencyPosts(data: BlogListingData): boolean {
  return data.agencyPosts.length > 0;
}

export function hasHotelSpotlights(data: BlogListingData): boolean {
  return data.hotelSpotlights.length > 0;
}

export function hasTravelerTips(data: BlogListingData): boolean {
  return data.travelerTips.length > 0;
}

export function hasAnyContent(data: BlogListingData): boolean {
  return (
    hasFeaturedPost(data) ||
    hasAgencyPosts(data) ||
    hasHotelSpotlights(data) ||
    hasTravelerTips(data)
  );
}
