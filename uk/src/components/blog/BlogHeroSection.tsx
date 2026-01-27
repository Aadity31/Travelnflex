/**
 * Blog Hero Section Component
 * 
 * Displays the featured post in a hero layout.
 * Handles empty state gracefully.
 * 
 * @module components/blog/BlogHeroSection
 */

import Link from 'next/link';
import type { FeaturedPost } from '@/lib/data/blog/types';

// ============================================
// Props Interface
// ============================================

export interface BlogHeroSectionProps {
  /** Featured post data - null for empty state */
  post: FeaturedPost | null;
  /** Badge text for the featured label */
  badgeText?: string;
  /** CTA button text */
  ctaText?: string;
}

// ============================================
// Empty State Component
// ============================================

function BlogHeroEmpty() {
  return (
    <section className="mb-12">
      <div
        className="relative min-h-[500px] flex flex-col justify-end p-6 md:p-12 rounded-xl overflow-hidden bg-slate-200"
        aria-label="No featured post available"
      >
        <div className="max-w-2xl space-y-4">
          <span className="inline-block px-3 py-1 bg-slate-400 text-white text-xs font-bold uppercase tracking-wider rounded">
            Coming Soon
          </span>
          <h2 className="text-slate-600 text-4xl md:text-6xl font-black leading-tight tracking-tight">
            Featured Stories Coming Soon
          </h2>
          <p className="text-slate-500 text-lg md:text-xl font-normal max-w-xl">
            Stay tuned for curated travel stories from our expert agencies and hotels.
          </p>
        </div>
      </div>
    </section>
  );
}

// ============================================
// Main Component
// ============================================

export function BlogHeroSection({
  post,
  badgeText = 'Featured Post',
  ctaText = 'Read Featured Post',
}: BlogHeroSectionProps) {
  // Handle empty state
  if (!post) {
    return <BlogHeroEmpty />;
  }

  return (
    <section className="mb-12">
      <div 
        className="relative min-h-[500px] flex flex-col justify-end p-6 md:p-12 rounded-xl overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.7) 100%), url("${post.heroImage}")`
        }}
      >
        <div className="max-w-2xl space-y-4">
          <span className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded">
            {badgeText}
          </span>
          <h1 className="text-white text-4xl md:text-6xl font-black leading-tight tracking-tight">
            {post.title}
          </h1>
          <p className="text-white/90 text-lg md:text-xl font-normal max-w-xl">
            {post.tagline}
          </p>
          <Link 
            href={`/blog/${post.slug}`}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:scale-105 transition-transform"
          >
            {ctaText}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default BlogHeroSection;
