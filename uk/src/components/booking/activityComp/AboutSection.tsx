import React from 'react';

interface AboutSectionProps {
  title: string;
  paragraphs: string[];
}

export default function AboutSection({ title, paragraphs }: AboutSectionProps) {
  return (
    <section
      id="about"
      className="relative py-10 px-4 border-t border-slate-200"
    >
      {/* Header */}
      <div className="mb-10">
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
          {title}
        </h2>
        <div className="mt-2 h-1 w-16 bg-primary rounded-full" />
      </div>

      {/* Content */}
      <div className="max-w-3xl space-y-6 text-slate-700 leading-relaxed text-[16px]">
        {paragraphs.map((paragraph, index) => (
          <p key={index}>
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}
