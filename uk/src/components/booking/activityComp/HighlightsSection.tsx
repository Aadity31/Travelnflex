import { CheckCircleIcon } from '@heroicons/react/24/solid';
import React from 'react';

interface Highlight {
  title: string;
}

interface HighlightsSectionProps {
  title: string;
  highlights: Highlight[];
}

export default function HighlightsSection({ title, highlights }: HighlightsSectionProps) {
  return (
    <section id="highlights" className="py-10 px-4 border-t border-slate-300">
      
      {/* Header */}
      <div className="mb-10">
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
          {title}
        </h2>
        <div className="mt-2 h-1 w-16 bg-primary rounded-full" />
      </div>

      {/* Grid */}
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-6 max-w-5xl">
        {highlights.map((highlight, index) => (
          <li key={index} className="flex items-start gap-3">
            
            <CheckCircleIcon className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-1" />

            <span className="text-slate-800 text-[15px] leading-relaxed">
              {highlight.title}
            </span>

          </li>
        ))}
      </ul>
    </section>
  );
}
