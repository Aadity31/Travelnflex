/**
 * Article Content Component
 * 
 * Renders the main article body content with various section types.
 * Supports paragraphs, headings, quotes, image grids, and lists.
 * 
 * @module components/blog/ArticleContent
 */

import type { ContentSection } from '@/lib/data/blog/types';

// ============================================
// Props Interface
// ============================================

export interface ArticleContentProps {
  /** Introduction text */
  introduction: string;
  /** Content sections */
  sections: ContentSection[];
}

// ============================================
// Section Renderers
// ============================================

function ParagraphSection({ content }: { content: string }) {
  return (
    <p className="text-lg leading-relaxed text-slate-700">
      {content}
    </p>
  );
}

function HeadingSection({ content, level }: { content: string; level?: 2 | 3 }) {
  if (level === 3) {
    return (
      <h3 className="text-xl font-bold text-slate-900">
        {content}
      </h3>
    );
  }

  return (
    <h2 className="text-2xl font-bold text-slate-900 pt-4">
      {content}
    </h2>
  );
}

function QuoteSection({ content, cite }: { content: string; cite?: string }) {
  return (
    <div className="my-10 border-l-4 border-blue-600 pl-8 py-4 bg-blue-50 rounded-r-xl">
      <blockquote className="text-2xl font-semibold text-slate-900 leading-snug">
        {`"${content}"`}
      </blockquote>
      {cite && (
        <cite className="block mt-4 text-slate-500 not-italic font-medium">
          — {cite}
        </cite>
      )}
    </div>
  );
}

function ImageGridSection({ images }: { images: string[] }) {
  if (images.length === 0) return null;
  
  const gridCols = images.length === 1 ? 'grid-cols-1' : 'grid-cols-2';
  
  return (
    <div className={`grid ${gridCols} gap-4 my-8`}>
      {images.map((image, index) => (
        <div 
          key={index}
          className="h-64 rounded-xl bg-cover bg-center"
          style={{ backgroundImage: `url("${image}")` }}
          role="img"
          aria-label={`Article image ${index + 1}`}
        />
      ))}
    </div>
  );
}

function ListSection({ items }: { items: string[] }) {
  if (items.length === 0) return null;

  return (
    <ul className="list-disc list-inside space-y-2 text-lg text-slate-700">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

// ============================================
// Section Router
// ============================================

function ContentSectionRenderer({ section }: { section: ContentSection }) {
  switch (section.type) {
    case 'paragraph':
      return <ParagraphSection content={section.content} />;
    case 'heading':
      return <HeadingSection content={section.content} level={section.level} />;
    case 'quote':
      return <QuoteSection content={section.content} cite={section.cite} />;
    case 'image-grid':
      return <ImageGridSection images={section.images || []} />;
    case 'list':
      return <ListSection items={section.items || []} />;
    default:
      return null;
  }
}

// ============================================
// Main Component
// ============================================

export function ArticleContent({ introduction, sections }: ArticleContentProps) {
  return (
    <article className="lg:col-span-8">
      <div className="space-y-6">
        {/* Introduction */}
        <p className="text-xl text-slate-600 leading-relaxed font-medium italic">
          {introduction}
        </p>

        {/* Content Sections */}
        {sections.map((section, index) => (
          <ContentSectionRenderer key={index} section={section} />
        ))}
      </div>
    </article>
  );
}

export default ArticleContent;
