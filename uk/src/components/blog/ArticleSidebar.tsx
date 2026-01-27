/**
 * Article Sidebar Component
 * 
 * Displays sidebar content for article detail pages.
 * Includes CTA offer, mentioned places, related articles, and newsletter.
 * 
 * @module components/blog/ArticleSidebar
 */

import Link from 'next/link';
import type { CTAOffer, RelatedArticle, NewsletterConfig } from '@/lib/data/blog/types';
import { BlogNewsletter } from './BlogNewsletter';

// ============================================
// Props Interface
// ============================================

export interface ArticleSidebarProps {
  /** CTA offer data */
  ctaOffer?: CTAOffer | null;
  /** Mentioned places */
  mentionedPlaces: string[];
  /** Related articles */
  relatedArticles: RelatedArticle[];
  /** Newsletter config */
  newsletterConfig?: NewsletterConfig;
}

// ============================================
// CTA Card Component
// ============================================

function CTACard({ offer }: { offer: CTAOffer }) {
  return (
    <div className="bg-slate-900 text-white rounded-2xl p-6 relative overflow-hidden shadow-xl ring-4 ring-blue-600/20">
      <div className="absolute -top-12 -right-12 size-40 bg-blue-600/20 rounded-full blur-3xl" />
      <span className="bg-blue-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 inline-block">
        {offer.badge}
      </span>
      <h4 className="text-xl font-bold mb-2">{offer.title}</h4>
      <p className="text-slate-400 text-sm mb-6">
        {offer.description}
      </p>
      <div className="flex items-baseline gap-2 mb-6">
        <span className="text-2xl font-bold">${offer.price.toLocaleString()}</span>
        {offer.originalPrice && (
          <span className="text-slate-400 text-xs line-through">
            ${offer.originalPrice.toLocaleString()}
          </span>
        )}
      </div>
      <Link 
        href={offer.ctaLink}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
      >
        {offer.ctaText}
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </Link>
      <p className="text-center text-[10px] text-slate-500 mt-4 uppercase font-medium">
        {offer.disclaimer}
      </p>
    </div>
  );
}

// ============================================
// Mentioned Places Component
// ============================================

function MentionedPlaces({ places }: { places: string[] }) {
  if (places.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
      <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">
        Mentioned Places
      </h4>
      <div className="flex flex-wrap gap-2">
        {places.map((place) => (
          <Link
            key={place}
            href={`/destinations?search=${encodeURIComponent(place)}`}
            className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            {place}
          </Link>
        ))}
      </div>
    </div>
  );
}

// ============================================
// Related Articles Component
// ============================================

function RelatedArticlesSection({ articles }: { articles: RelatedArticle[] }) {
  if (articles.length === 0) return null;

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400">
        Related Articles
      </h4>
      
      {articles.map((article) => (
        <Link
          key={article.id}
          href={`/blog/${article.slug}`}
          className="group flex gap-4 p-2 rounded-xl hover:bg-white transition-all"
        >
          <div 
            className="size-20 rounded-lg bg-cover bg-center flex-shrink-0 bg-slate-200"
            style={{ backgroundImage: `url("${article.image}")` }}
          />
          <div>
            <p className="text-xs font-bold text-blue-600 mb-1 uppercase">
              {article.category}
            </p>
            <h5 className="text-sm font-bold leading-tight group-hover:text-blue-600 transition-colors">
              {article.title}
            </h5>
            <p className="text-xs text-slate-400 mt-1">By {article.author}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

// ============================================
// Main Component
// ============================================

export function ArticleSidebar({
  ctaOffer,
  mentionedPlaces,
  relatedArticles,
  newsletterConfig,
}: ArticleSidebarProps) {
  return (
    <aside className="lg:col-span-4 space-y-8">
      {/* CTA Card */}
      {ctaOffer && <CTACard offer={ctaOffer} />}

      {/* Mentioned Places */}
      <MentionedPlaces places={mentionedPlaces} />

      {/* Related Articles */}
      <RelatedArticlesSection articles={relatedArticles} />

      {/* Newsletter */}
      <BlogNewsletter 
        variant="sidebar" 
        config={newsletterConfig}
      />
    </aside>
  );
}

export default ArticleSidebar;
