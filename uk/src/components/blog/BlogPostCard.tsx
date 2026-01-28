/**
 * Blog Post Card Component
 * 
 * Displays a blog post in card format for listings.
 * Used in agency posts section.
 * 
 * @module components/blog/BlogPostCard
 */

import Link from 'next/link';
import type { BlogPostCard as BlogPostCardType } from '@/lib/data/blog/types';

// ============================================
// Props Interface
// ============================================

export interface BlogPostCardProps {
  /** Post data */
  post: BlogPostCardType;
}

// ============================================
// Category Badge Colors
// ============================================

const categoryColors: Record<string, { bg: string; text: string }> = {
  agency: { bg: 'bg-blue-100', text: 'text-blue-600' },
  agencies: { bg: 'bg-blue-100', text: 'text-blue-600' },
  hotels: { bg: 'bg-emerald-100', text: 'text-emerald-600' },
  adventure: { bg: 'bg-orange-100', text: 'text-orange-600' },
  culture: { bg: 'bg-purple-100', text: 'text-purple-600' },
  tips: { bg: 'bg-amber-100', text: 'text-amber-600' },
  guide: { bg: 'bg-teal-100', text: 'text-teal-600' },
  wildlife: { bg: 'bg-green-100', text: 'text-green-600' },
};

// ============================================
// Main Component
// ============================================

export function BlogPostCard({ post }: BlogPostCardProps) {
  const colors = categoryColors[post.category] || categoryColors.guide;

  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <article className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300">
        {/* Image */}
        <div className="aspect-video overflow-hidden">
          <div
            className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
            style={{ backgroundImage: `url("${post.featuredImage}")` }}
            role="img"
            aria-label={post.title}
          />
        </div>

        {/* Content */}
        <div className="p-5">
          <span className={`${colors.bg} ${colors.text} text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded`}>
            {post.category}
          </span>

          <h3 className="text-lg font-bold mb-2 mt-3 group-hover:text-blue-600 transition-colors">
            {post.title}
          </h3>

          <p className="text-gray-600 text-sm line-clamp-2 mb-4">
            {post.excerpt}
          </p>

          {/* Publisher Info */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div
                className="size-8 rounded-full bg-gray-200 bg-cover bg-center flex items-center justify-center"
                style={post.publisher.avatarUrl ? { backgroundImage: `url("${post.publisher.avatarUrl}")` } : undefined}
              >
                {!post.publisher.avatarUrl && (
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                    <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                  </svg>
                )}
              </div>
              <span className="text-xs font-bold text-slate-700">
                {post.publisher.name}
              </span>
            </div>

            {/* Verified Badge */}
            {post.publisher.isVerified && (
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}

export default BlogPostCard;
