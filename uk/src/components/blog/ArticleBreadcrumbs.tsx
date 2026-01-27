/**
 * Article Breadcrumbs Component
 * 
 * Displays navigation breadcrumbs for article pages.
 * SEO-optimized with structured data support.
 * 
 * @module components/blog/ArticleBreadcrumbs
 */

import Link from 'next/link';

// ============================================
// Props Interface
// ============================================

export interface ArticleBreadcrumbsProps {
  /** Breadcrumb items */
  items: {
    label: string;
    href: string;
  }[];
}

// ============================================
// Main Component
// ============================================

export function ArticleBreadcrumbs({ items }: ArticleBreadcrumbsProps) {
  // Handle empty state
  if (items.length === 0) {
    return null;
  }

  return (
    <nav 
      className="flex items-center gap-2 mb-6 text-sm font-medium"
      aria-label="Breadcrumb"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        return (
          <span key={item.href} className="flex items-center gap-2">
            {index > 0 && (
              <svg className="w-3 h-3 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            )}
            
            {isLast ? (
              <span className="text-slate-900" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link 
                href={item.href}
                className="text-slate-500 hover:text-blue-600"
              >
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}

export default ArticleBreadcrumbs;
