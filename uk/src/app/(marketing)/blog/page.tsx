/**
 * Blog Listing Page
 * 
 * Data-driven blog listing page with:
 * - Featured post hero section
 * - Category filter
 * - Agency posts section
 * - Hotel spotlights section
 * - Traveler tips section
 * - Newsletter subscription
 * 
 * @module app/(marketing)/blog/page
 */

import type { Metadata } from 'next';
import {
  getBlogListing,
  hasFeaturedPost,
  hasAnyContent,
  type BlogListingData
} from '@/lib/data/blog';
import {
  BlogHeroSection,
  BlogCategoryFilter,
  BlogAgencySection,
  BlogHotelSection,
  BlogTipsSection,
  BlogNewsletter,
} from '@/components/blog';

// ============================================
// Metadata
// ============================================

export const metadata: Metadata = {
  title: 'Travel Blog | Devbhoomi Darshan',
  description: 'Discover travel guides, hotel spotlights, and expert tips from verified agencies and hotels. Plan your perfect Uttarakhand adventure.',
  openGraph: {
    title: 'Travel Blog | Devbhoomi Darshan',
    description: 'Discover travel guides, hotel spotlights, and expert tips from verified agencies and hotels.',
    type: 'website',
  },
};

// ============================================
// Empty State Component
// ============================================

function BlogEmptyState() {
  return (
    <div className="bg-gray-50 text-slate-900 min-h-screen">
      <main className="max-w-[1200px] mx-auto px-4 md:px-10 py-8">
        <div className="text-center py-20">
          <h1 className="text-4xl font-bold mb-4">Travel Stories Coming Soon</h1>
          <p className="text-gray-600 text-lg max-w-xl mx-auto mb-8">
            We're curating the best travel guides, hotel spotlights, and expert tips
            from our verified agencies and hotels. Check back soon!
          </p>
          <BlogNewsletter />
        </div>
      </main>
    </div>
  );
}

// ============================================
// Blog Content Component
// ============================================

interface BlogContentProps {
  data: BlogListingData;
}

function BlogContent({ data }: BlogContentProps) {
  return (
    <div className="bg-gray-50 text-slate-900 min-h-screen">
      <main className="max-w-[1200px] mx-auto px-4 md:px-10 py-8">
        {/* Hero Section: Featured Post */}
        <BlogHeroSection 
          post={hasFeaturedPost(data) ? data.featuredPost : null}
          badgeText="Featured Post"
          ctaText="Read Featured Post"
        />

        {/* Category Filter Bar */}
        <BlogCategoryFilter 
          categories={data.categories}
          selectedCategory="all"
        />

        {/* Section 1: From Our Agencies */}
        <BlogAgencySection 
          posts={data.agencyPosts}
          title="From Our Agencies"
          viewAllText="View All"
          viewAllHref="/blog?category=agencies"
        />

        {/* Section 2: Hotel Spotlights */}
        <BlogHotelSection 
          posts={data.hotelSpotlights}
          title="Hotel Spotlights"
          viewAllText="See All Stays"
          viewAllHref="/blog?category=hotels"
        />

        {/* Section 3: Traveler Tips */}
        <BlogTipsSection 
          posts={data.travelerTips}
          title="Traveler Tips"
          subtitle="By Site Owners"
        />

        {/* Newsletter Section */}
        <BlogNewsletter />
      </main>
    </div>
  );
}

// ============================================
// Page Component
// ============================================

export default async function BlogPage() {
  // Fetch blog listing data
  // Data source will be injected here when connected to CMS/API/Markdown
  const data = await getBlogListing();

  // Handle complete empty state
  if (!hasAnyContent(data)) {
    return <BlogEmptyState />;
  }

  return <BlogContent data={data} />;
}
