/**
 * Blog Hotel Spotlights Section Component
 * 
 * Displays hotel spotlight posts in a horizontal layout.
 * Handles empty state gracefully.
 * 
 * @module components/blog/BlogHotelSection
 */

import Link from 'next/link';
import type { HotelSpotlightPost } from '@/lib/data/blog/types';

// ============================================
// Props Interface
// ============================================

export interface BlogHotelSectionProps {
  /** Hotel spotlight posts to display */
  posts: HotelSpotlightPost[];
  /** Section title */
  title?: string;
  /** View all link text */
  viewAllText?: string;
  /** View all link href */
  viewAllHref?: string;
}

// ============================================
// Hotel Card Component
// ============================================

function HotelSpotlightCard({ post }: { post: HotelSpotlightPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="flex flex-col md:flex-row gap-6 group">
      <div className="w-full md:w-48 h-48 shrink-0 rounded-xl overflow-hidden">
        <div 
          className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
          style={{ backgroundImage: `url("${post.image}")` }}
          role="img"
          aria-label={post.title}
        />
      </div>
      <div className="flex flex-col justify-center">
        <span className="bg-emerald-100 text-emerald-600 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded w-fit mb-2">
          Hotels
        </span>
        <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
          {post.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4">
          {post.description}
        </p>
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-bold">{post.hotelName}</span>
        </div>
      </div>
    </Link>
  );
}

// ============================================
// Empty State Component
// ============================================

function HotelSectionEmpty() {
  return (
    <section className="mb-12 bg-gray-100 p-8 rounded-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Hotel Spotlights</h2>
      </div>
      <div className="text-center py-8">
        <p className="text-gray-500">
          Hotel spotlights coming soon. Discover unique stays from our verified partners.
        </p>
      </div>
    </section>
  );
}

// ============================================
// Main Component
// ============================================

export function BlogHotelSection({
  posts,
  title = 'Hotel Spotlights',
  viewAllText = 'See All Stays',
  viewAllHref = '/blog?category=hotels',
}: BlogHotelSectionProps) {
  // Handle empty state
  if (posts.length === 0) {
    return <HotelSectionEmpty />;
  }

  return (
    <section className="mb-12 bg-gray-100 p-8 rounded-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        <Link
          href={viewAllHref}
          className="text-blue-600 font-bold text-sm hover:underline flex items-center gap-1"
        >
          {viewAllText}
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {posts.map((post) => (
          <HotelSpotlightCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}

export default BlogHotelSection;
