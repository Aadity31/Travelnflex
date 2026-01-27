/**
 * Blog Category Filter Component
 * 
 * Horizontal scrollable category filter bar.
 * Handles empty state gracefully.
 * 
 * @module components/blog/BlogCategoryFilter
 */

'use client';

import { useState } from 'react';
import type { CategoryFilter } from '@/lib/data/blog/types';

// ============================================
// Props Interface
// ============================================

export interface BlogCategoryFilterProps {
  /** Available categories */
  categories: CategoryFilter[];
  /** Currently selected category slug */
  selectedCategory?: string;
  /** Callback when category changes */
  onCategoryChange?: (slug: string) => void;
}

// ============================================
// Icon Component
// ============================================

function CategoryIcon({ icon }: { icon?: string }) {
  if (icon === 'grid') {
    return (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    );
  }
  return null;
}

// ============================================
// Main Component
// ============================================

export function BlogCategoryFilter({
  categories,
  selectedCategory = 'all',
  onCategoryChange,
}: BlogCategoryFilterProps) {
  const [activeCategory, setActiveCategory] = useState(selectedCategory);

  // Handle empty state
  if (categories.length === 0) {
    return null;
  }

  const handleCategoryClick = (slug: string) => {
    setActiveCategory(slug);
    onCategoryChange?.(slug);
  };

  return (
    <section className="mb-8 overflow-x-auto">
      <div className="flex gap-3 pb-2">
        {categories.map((category) => {
          const isActive = activeCategory === category.slug;
          
          return (
            <button
              key={category.slug}
              onClick={() => handleCategoryClick(category.slug)}
              className={`
                flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 transition-colors
                ${isActive
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200 hover:bg-gray-50'
                }
              `}
              aria-pressed={isActive}
            >
              {category.icon && <CategoryIcon icon={category.icon} />}
              <p className={`text-sm ${isActive ? 'font-bold' : 'font-medium'}`}>
                {category.label}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default BlogCategoryFilter;
