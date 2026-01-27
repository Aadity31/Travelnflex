/**
 * Blog Data Types
 * 
 * These types define the data model for the blog system.
 * They support content from Markdown files or API responses.
 * 
 * Architecture: Data-driven, SEO-optimized, E-E-A-T compliant
 * @see https://developers.google.com/search/docs/fundamentals/creating-helpful-content
 */

// ============================================
// Search Intent Types (SEO Strategy)
// ============================================

export type SearchIntent = 'informational' | 'commercial' | 'booking-ready';

// ============================================
// Publisher Types (E-E-A-T aligned)
// ============================================

export type PublisherType = 'company' | 'agency' | 'hotel';

export interface Publisher {
  id: string;
  name: string;
  type: PublisherType;
  avatarUrl: string;
  isVerified: boolean;
  /** E-E-A-T: Experience indicator */
  yearsOfExperience?: number;
  /** E-E-A-T: Expertise indicator */
  specializations?: string[];
}

// ============================================
// Blog Categories
// ============================================

export type BlogCategory = 
  | 'guide' 
  | 'hotels' 
  | 'adventure' 
  | 'culture' 
  | 'tips'
  | 'wildlife'
  | 'agencies';

export interface CategoryFilter {
  slug: string;
  label: string;
  icon?: string;
}

// ============================================
// SEO Metadata
// ============================================

export interface SEOMetadata {
  title: string;           // ≤ 60 characters
  metaDescription: string; // ≤ 155 characters
  slug: string;            // URL-friendly
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  keywords: string[];
}

// ============================================
// Quick Facts (Above-the-fold)
// ============================================

export interface QuickFacts {
  location: string;
  bestSeason: string;
  difficultyOrType: string;
  idealFor: string;
  bookingType: string;
}

// ============================================
// Blog Post (Listing Card)
// ============================================

export interface BlogPostCard {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  featuredImage: string;
  category: BlogCategory;
  publisher: Publisher;
  publishedAt: string;      // ISO date string
  readingTime: string;      // e.g., "5 min read"
  isFeatured?: boolean;
}

// ============================================
// Featured Post (Hero Section)
// ============================================

export interface FeaturedPost extends BlogPostCard {
  heroImage: string;
  tagline: string;
}

// ============================================
// Hotel Spotlight Post
// ============================================

export interface HotelSpotlightPost {
  id: string;
  slug: string;
  title: string;
  description: string;
  hotelName: string;
  image: string;
  category: 'hotels';
}

// ============================================
// Traveler Tip Post
// ============================================

export interface TravelerTipPost {
  id: string;
  slug: string;
  title: string;
  image: string;
  readingTime: string;
}

// ============================================
// Blog Article Content Sections
// ============================================

export interface ContentSection {
  type: 'paragraph' | 'heading' | 'quote' | 'image-grid' | 'list';
  content: string;
  level?: 2 | 3;           // For headings
  cite?: string;           // For quotes
  images?: string[];       // For image-grid
  items?: string[];        // For lists
}

// ============================================
// Comment
// ============================================

export interface Comment {
  id: string;
  author: {
    name: string;
    avatarUrl: string;
  };
  content: string;
  createdAt: string;       // ISO date string
  helpfulCount: number;
  replies?: Comment[];
}

// ============================================
// Related Article
// ============================================

export interface RelatedArticle {
  id: string;
  slug: string;
  title: string;
  category: BlogCategory;
  author: string;
  image: string;
}

// ============================================
// CTA Offer (Sidebar)
// ============================================

export interface CTAOffer {
  badge: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  ctaText: string;
  ctaLink: string;
  disclaimer: string;
}

// ============================================
// Full Blog Article (Detail Page)
// ============================================

export interface BlogArticle {
  // Core
  id: string;
  slug: string;
  
  // SEO
  seo: SEOMetadata;
  
  // Hero
  title: string;
  heroImage: string;
  category: BlogCategory;
  categoryLabel: string;
  readingTime: string;
  
  // Publisher
  publisher: Publisher;
  publishedAt: string;
  
  // Quick Facts (optional, for guides)
  quickFacts?: QuickFacts;
  
  // Content
  introduction: string;
  sections: ContentSection[];
  
  // Sidebar
  mentionedPlaces: string[];
  relatedArticles: RelatedArticle[];
  ctaOffer?: CTAOffer;
  
  // Engagement
  comments: Comment[];
  commentCount: number;
  
  // Breadcrumbs
  breadcrumbs: {
    label: string;
    href: string;
  }[];
}

// ============================================
// Blog Listing Page Data
// ============================================

export interface BlogListingData {
  featuredPost: FeaturedPost;
  categories: CategoryFilter[];
  agencyPosts: BlogPostCard[];
  hotelSpotlights: HotelSpotlightPost[];
  travelerTips: TravelerTipPost[];
}

// ============================================
// API Response Types
// ============================================

export interface BlogListingResponse {
  data: BlogListingData;
  meta: {
    total: number;
    page: number;
    perPage: number;
  };
}

export interface BlogArticleResponse {
  data: BlogArticle;
}

// ============================================
// FAQ Types (Voice Search & PAA Optimization)
// ============================================

export interface FAQ {
  question: string;
  answer: string;
  /** Schema.org FAQPage markup support */
  schemaType?: 'Question';
}

// ============================================
// Structured Data Types (SEO Schema.org)
// ============================================

export interface ArticleStructuredData {
  '@context': 'https://schema.org';
  '@type': 'Article' | 'BlogPosting' | 'TravelGuide';
  headline: string;
  description: string;
  image: string[];
  datePublished: string;
  dateModified?: string;
  author: {
    '@type': 'Organization' | 'Person';
    name: string;
    url?: string;
  };
  publisher: {
    '@type': 'Organization';
    name: string;
    logo?: {
      '@type': 'ImageObject';
      url: string;
    };
  };
  mainEntityOfPage?: {
    '@type': 'WebPage';
    '@id': string;
  };
}

export interface FAQStructuredData {
  '@context': 'https://schema.org';
  '@type': 'FAQPage';
  mainEntity: {
    '@type': 'Question';
    name: string;
    acceptedAnswer: {
      '@type': 'Answer';
      text: string;
    };
  }[];
}

export interface BreadcrumbStructuredData {
  '@context': 'https://schema.org';
  '@type': 'BreadcrumbList';
  itemListElement: {
    '@type': 'ListItem';
    position: number;
    name: string;
    item?: string;
  }[];
}

// ============================================
// Content Input Types (For Content Creation)
// ============================================

export interface BlogContentInput {
  primaryKeyword: string;
  secondaryKeywords: string[];
  location: string;
  category: BlogCategory;
  publisherType: PublisherType;
  searchIntent: SearchIntent;
  targetAudience: string;
  seasonOrMonth?: string;
  internalLinks?: string[];
}

// ============================================
// Full Blog Article with SEO (Detail Page)
// ============================================

export interface BlogArticleFull extends BlogArticle {
  /** Search intent alignment */
  searchIntent: SearchIntent;
  
  /** Primary keyword for SEO */
  primaryKeyword: string;
  
  /** Secondary keywords */
  secondaryKeywords: string[];
  
  /** FAQs for voice search & PAA */
  faqs: FAQ[];
  
  /** Structured data for rich snippets */
  structuredData: {
    article: ArticleStructuredData;
    faq?: FAQStructuredData;
    breadcrumb: BreadcrumbStructuredData;
  };
  
  /** E-E-A-T disclaimer */
  disclaimer: string;
  
  /** Last modified date for freshness signals */
  lastModified?: string;
}

// ============================================
// Newsletter Subscription
// ============================================

export interface NewsletterConfig {
  title: string;
  description: string;
  placeholder: string;
  buttonText: string;
}

// ============================================
// Blog Page Configuration
// ============================================

export interface BlogPageConfig {
  listing: {
    heroSection: {
      badge: string;
      ctaText: string;
    };
    sections: {
      agencies: {
        title: string;
        viewAllText: string;
        viewAllLink: string;
      };
      hotels: {
        title: string;
        viewAllText: string;
        viewAllLink: string;
      };
      tips: {
        title: string;
        subtitle: string;
      };
    };
    newsletter: NewsletterConfig;
  };
  detail: {
    newsletter: NewsletterConfig;
    ctaDefaults: {
      badge: string;
      disclaimer: string;
    };
  };
}
