/**
 * Blog Article Detail Page
 * 
 * Data-driven article detail page with:
 * - Reading progress bar
 * - Breadcrumbs navigation
 * - Hero section with publisher info
 * - Article content
 * - Sidebar with CTA, related articles, newsletter
 * - Comments section
 * - SEO structured data
 * 
 * @module app/(marketing)/blog/[slug]/page
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import {
  getBlogArticle,
  getAllArticleSlugs,
  isValidArticle,
  type BlogArticleFull
} from '@/lib/data/blog';
import {
  ArticleBreadcrumbs,
  ArticleHero,
  ArticleContent,
  ArticleSidebar,
  ArticleComments,
} from '@/components/blog';
import { ReadingProgressBar } from './ReadingProgressBar';

// ============================================
// Types
// ============================================

interface PageProps {
  params: Promise<{ slug: string }>;
}

// ============================================
// Static Params Generation (for SSG)
// ============================================

export async function generateStaticParams() {
  // Returns empty array when no data source is connected
  // When CMS/API is connected, this will return actual slugs
  const slugs = await getAllArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

// ============================================
// Dynamic Metadata
// ============================================

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getBlogArticle(slug);

  if (!article) {
    return {
      title: 'Article Not Found | Devbhoomi Darshan',
    };
  }

  return {
    title: article.seo.title,
    description: article.seo.metaDescription,
    keywords: article.seo.keywords,
    openGraph: {
      title: article.seo.ogTitle,
      description: article.seo.ogDescription,
      images: [article.seo.ogImage],
      type: 'article',
      publishedTime: article.publishedAt,
      authors: [article.publisher.name],
    },
    alternates: {
      canonical: article.seo.canonicalUrl,
    },
  };
}

// ============================================
// Structured Data Component
// ============================================

function StructuredData({ article }: { article: BlogArticleFull }) {
  return (
    <>
      {/* Article Structured Data */}
      <Script
        id="article-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(article.structuredData.article),
        }}
      />
      
      {/* FAQ Structured Data (if available) */}
      {article.structuredData.faq && (
        <Script
          id="faq-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(article.structuredData.faq),
          }}
        />
      )}
      
      {/* Breadcrumb Structured Data */}
      <Script
        id="breadcrumb-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(article.structuredData.breadcrumb),
        }}
      />
    </>
  );
}

// ============================================
// Article Layout Component
// ============================================

function ArticleLayout({ article }: { article: BlogArticleFull }) {
  return (
    <div className="bg-gray-50 text-slate-900 min-h-screen">
      {/* Reading Progress Bar */}
      <ReadingProgressBar />

      <main className="max-w-[1200px] mx-auto px-6 py-8 mt-4">
        {/* Breadcrumbs */}
        <ArticleBreadcrumbs items={article.breadcrumbs} />

        {/* Hero Section */}
        <ArticleHero
          title={article.title}
          heroImage={article.heroImage}
          categoryLabel={article.categoryLabel}
          readingTime={article.readingTime}
          publisher={article.publisher}
          publishedAt={article.publishedAt}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Article Content */}
          <div className="lg:col-span-8">
            <ArticleContent
              introduction={article.introduction}
              sections={article.sections}
            />
            
            {/* Comments Section */}
            <ArticleComments
              comments={article.comments}
              commentCount={article.commentCount}
              articleId={article.id}
            />
          </div>

          {/* Sidebar */}
          <ArticleSidebar
            ctaOffer={article.ctaOffer}
            mentionedPlaces={article.mentionedPlaces}
            relatedArticles={article.relatedArticles}
          />
        </div>

        {/* E-E-A-T Disclaimer */}
        {article.disclaimer && (
          <div className="mt-12 pt-8 border-t border-slate-200">
            <p className="text-sm text-slate-500 italic">
              {article.disclaimer}
            </p>
          </div>
        )}
      </main>

      {/* Structured Data for SEO */}
      <StructuredData article={article} />
    </div>
  );
}

// ============================================
// Page Component
// ============================================

export default async function BlogArticlePage({ params }: PageProps) {
  const { slug } = await params;
  
  // Fetch article data
  // Data source will be injected here when connected to CMS/API/Markdown
  const article = await getBlogArticle(slug);

  // Handle 404 when article not found
  if (!isValidArticle(article)) {
    notFound();
  }

  return <ArticleLayout article={article} />;
}
