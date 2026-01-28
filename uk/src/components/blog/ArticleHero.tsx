/**
 * Article Hero Component
 * 
 * Displays the hero section for article detail pages.
 * Includes image, title, category badge, and reading time.
 * 
 * @module components/blog/ArticleHero
 */

import type { BlogArticle, Publisher } from '@/lib/data/blog/types';

// ============================================
// Props Interface
// ============================================

export interface ArticleHeroProps {
  /** Article title */
  title: string;
  /** Hero image URL */
  heroImage: string;
  /** Category label */
  categoryLabel: string;
  /** Reading time */
  readingTime: string;
  /** Publisher info */
  publisher: Publisher;
  /** Published date */
  publishedAt: string;
}

// ============================================
// Publisher Info Component
// ============================================

function PublisherInfo({ 
  publisher, 
  publishedAt 
}: { 
  publisher: Publisher; 
  publishedAt: string;
}) {
  const formattedDate = new Date(publishedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const publisherTypeLabel = publisher.type === 'agency' 
    ? 'Verified Travel Agency' 
    : publisher.type === 'hotel' 
      ? 'Verified Hotel' 
      : 'Platform';

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200">
      <div className="flex items-center gap-4">
        <div
          className="size-12 rounded-full bg-cover bg-center border-2 border-blue-600/20 bg-slate-200"
          style={publisher.avatarUrl ? { backgroundImage: `url("${publisher.avatarUrl}")` } : undefined}
        />
        <div>
          <div className="flex items-center gap-2">
            <p className="font-bold text-slate-900 leading-none">
              {publisher.name}
            </p>
            {publisher.isVerified && (
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1 uppercase font-semibold tracking-tighter">
            {publisherTypeLabel} • {formattedDate}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-200 hover:border-blue-600 transition-colors text-sm font-medium">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-200 hover:border-blue-600 transition-colors text-sm font-medium">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          Save
        </button>
      </div>
    </div>
  );
}

// ============================================
// Main Component
// ============================================

export function ArticleHero({
  title,
  heroImage,
  categoryLabel,
  readingTime,
  publisher,
  publishedAt,
}: ArticleHeroProps) {
  return (
    <>
      {/* Hero Image */}
      <div className="relative w-full rounded-2xl overflow-hidden mb-10 group">
        <div 
          className="aspect-[21/9] w-full bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.7), transparent), url("${heroImage}")`
          }}
          role="img"
          aria-label={title}
        />
        <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full lg:w-3/4">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
              {categoryLabel}
            </span>
            <span className="text-slate-200 text-sm">{readingTime}</span>
          </div>
          <h1 className="text-white text-3xl md:text-5xl font-extrabold leading-tight mb-4">
            {title}
          </h1>
        </div>
      </div>

      {/* Publisher Info */}
      <PublisherInfo publisher={publisher} publishedAt={publishedAt} />
    </>
  );
}

export default ArticleHero;
