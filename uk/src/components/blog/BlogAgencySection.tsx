/**
 * Blog Agency Posts Section Component
 * 
 * Displays agency posts in a grid layout.
 * Handles empty state gracefully.
 * 
 * @module components/blog/BlogAgencySection
 */

import Link from 'next/link';
import type { BlogPostCard as BlogPostCardType } from '@/lib/data/blog/types';
import { BlogPostCard } from './BlogPostCard';

// ============================================
// Props Interface
// ============================================

export interface BlogAgencySectionProps {
  /** Agency posts to display */
  posts: BlogPostCardType[];
  /** Section title */
  title?: string;
  /** View all link text */
  viewAllText?: string;
  /** View all link href */
  viewAllHref?: string;
}

// ============================================
// Empty State Component
// ============================================

function AgencySectionEmpty() {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6 px-2">
        <h2 className="text-2xl font-bold">From Our Agencies</h2>
      </div>
      <div className="bg-gray-100 rounded-xl p-8 text-center">
        <p className="text-gray-500">
          Agency stories coming soon. Check back later for expert travel guides.
        </p>
      </div>
    </section>
  );
}

// ============================================
// Main Component
// ============================================

export function BlogAgencySection({
  posts,
  title = 'From Our Agencies',
  viewAllText = 'View All',
  viewAllHref = '/blog?category=agencies',
}: BlogAgencySectionProps) {
  // Handle empty state
  if (posts.length === 0) {
    return <AgencySectionEmpty />;
  }

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6 px-2">
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}

export default BlogAgencySection;
