/**
 * Reading Progress Bar Component
 * 
 * Shows reading progress as user scrolls through the article.
 * Client component for scroll event handling.
 * 
 * @module app/(marketing)/blog/[slug]/ReadingProgressBar
 */

'use client';

import { useState, useEffect } from 'react';

export function ReadingProgressBar() {
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const progress = scrollHeight > 0 ? (scrolled / scrollHeight) * 100 : 0;
      setReadingProgress(progress);
    };

    window.addEventListener('scroll', updateProgress);
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 w-full bg-slate-100 h-1">
      <div 
        className="bg-blue-600 h-full transition-all duration-300" 
        style={{ width: `${readingProgress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(readingProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Reading progress"
      />
    </div>
  );
}

export default ReadingProgressBar;

