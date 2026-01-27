/**
 * Blog Traveler Tips Section Component
 * 
 * Displays traveler tips in a grid layout.
 * Handles empty state gracefully.
 * 
 * @module components/blog/BlogTipsSection
 */

import Link from 'next/link';
import type { TravelerTipPost } from '@/lib/data/blog/types';

// ============================================
// Props Interface
// ============================================

export interface BlogTipsSectionProps {
  /** Traveler tip posts to display */
  posts: TravelerTipPost[];
  /** Section title */
  title?: string;
  /** Section subtitle */
  subtitle?: string;
}

// ============================================
// Tip Card Component
// ============================================

function TipCard({ post }: { post: TravelerTipPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group cursor-pointer block">
      <div className="aspect-square rounded-xl overflow-hidden mb-3 relative">
        <div 
          className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
          style={{ backgroundImage: `url("${post.image}")` }}
          role="img"
          aria-label={post.title}
        />
        <span className="absolute bottom-3 left-3 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded">
          Expert Tip
        </span>
      </div>
      <h4 className="font-bold text-sm mb-1 group-hover:text-blue-600 transition-colors">
        {post.title}
      </h4>
      <p className="text-xs text-gray-600">{post.readingTime}</p>
    </Link>
  );
}

// ============================================
// Empty State Component
// ============================================

function TipsSectionEmpty() {
  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-6 px-2">
        <h2 className="text-2xl font-bold">Traveler Tips</h2>
        <span className="text-gray-400 text-sm">By Site Owners</span>
      </div>
      <div className="bg-gray-100 rounded-xl p-8 text-center">
        <p className="text-gray-500">
          Expert travel tips coming soon. Get insider knowledge from experienced travelers.
        </p>
      </div>
    </section>
  );
}

// ============================================
// Main Component
// ============================================

export function BlogTipsSection({
  posts,
  title = 'Traveler Tips',
  subtitle = 'By Site Owners',
}: BlogTipsSectionProps) {
  // Handle empty state
  if (posts.length === 0) {
    return <TipsSectionEmpty />;
  }

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-6 px-2">
        <h2 className="text-2xl font-bold">{title}</h2>
        <span className="text-gray-400 text-sm">{subtitle}</span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {posts.map((post) => (
          <TipCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}

export default BlogTipsSection;
