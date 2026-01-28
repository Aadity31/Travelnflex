/**
 * Blog Newsletter Section Component
 * 
 * Newsletter subscription form for blog pages.
 * 
 * @module components/blog/BlogNewsletter
 */

'use client';

import { useState } from 'react';
import type { NewsletterConfig } from '@/lib/data/blog/types';

// ============================================
// Props Interface
// ============================================

export interface BlogNewsletterProps {
  /** Newsletter configuration */
  config?: NewsletterConfig;
  /** Variant style */
  variant?: 'default' | 'sidebar';
}

// ============================================
// Default Configuration
// ============================================

const defaultConfig: NewsletterConfig = {
  title: 'Join our travel circle',
  description: 'Get the best itineraries and hotel deals delivered weekly to your inbox.',
  placeholder: 'Enter your email',
  buttonText: 'Subscribe Now',
};

// ============================================
// Main Component (Default Variant)
// ============================================

function NewsletterDefault({ config }: { config: NewsletterConfig }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    
    // Simulate API call - replace with actual implementation
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  };

  return (
    <section className="mb-12">
      <div className="bg-blue-50 rounded-2xl p-10 flex flex-col md:flex-row items-center justify-between gap-8 border border-blue-200">
        <div className="space-y-3 text-center md:text-left">
          <h2 className="text-3xl font-bold">{config.title}</h2>
          <p className="text-gray-600">
            {config.description}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            placeholder={config.placeholder}
            disabled={status === 'loading'}
            required
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="bg-blue-600 text-white font-bold px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap disabled:opacity-50"
          >
            {status === 'loading' ? 'Subscribing...' : config.buttonText}
          </button>
        </form>

        {status === 'success' && (
          <p className="text-green-600 text-sm font-medium">
            Successfully subscribed!
          </p>
        )}

        {status === 'error' && (
          <p className="text-red-600 text-sm font-medium">
            Something went wrong. Please try again.
          </p>
        )}
      </div>
    </section>
  );
}

// ============================================
// Sidebar Variant
// ============================================

function NewsletterSidebar({ config }: { config: NewsletterConfig }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
      <h4 className="text-slate-900 font-bold mb-2">
        {config.title}
      </h4>
      <p className="text-sm text-slate-600 mb-4">
        {config.description}
      </p>

      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-lg text-sm px-4 py-2 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          placeholder={config.placeholder}
          disabled={status === 'loading'}
          required
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-slate-900 text-white py-2 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {status === 'loading' ? 'Subscribing...' : config.buttonText}
        </button>
      </form>

      {status === 'success' && (
        <p className="text-green-600 text-xs font-medium mt-2">
          Successfully subscribed!
        </p>
      )}

      {status === 'error' && (
        <p className="text-red-600 text-xs font-medium mt-2">
          Something went wrong.
        </p>
      )}
    </div>
  );
}

// ============================================
// Main Export
// ============================================

export function BlogNewsletter({
  config = defaultConfig,
  variant = 'default',
}: BlogNewsletterProps) {
  if (variant === 'sidebar') {
    return <NewsletterSidebar config={config} />;
  }
  
  return <NewsletterDefault config={config} />;
}

export default BlogNewsletter;
