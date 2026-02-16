import { CheckCircleIcon } from '@heroicons/react/24/solid';
import React from 'react';

interface IncludedSectionProps {
  title: string;
  items: string[];
}

export default function IncludedSection({ title, items }: IncludedSectionProps) {
  return (
    <section
      id="included"
      className="py-10 px-4 border-t border-b border-slate-300"
    >
      {/* Header */}
      <div className="mb-10">
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
          {title}
        </h2>
        <div className="mt-2 h-1 w-16 bg-primary rounded-full" />
      </div>
      

      {/* Items Grid */}
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6 max-w-4xl">
        {items.map((item, index) => (
          <li
            key={index}
            className="flex items-start gap-4"
          >
            <CheckCircleIcon className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-1" />

            <span className="text-slate-700 leading-relaxed text-[15px]">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
