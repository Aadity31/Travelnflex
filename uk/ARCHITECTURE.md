# Blog System Architecture - Devbhoomi Darshan

## Overview

This document describes the production-ready, data-driven blog architecture for the Devbhoomi Darshan travel marketplace. The system is designed to be:

- **SEO-optimized** for Google, Bing, and AI-powered search
- **E-E-A-T compliant** (Experience, Expertise, Authoritativeness, Trustworthiness)
- **Data-driven** with no hardcoded content
- **Empty-state safe** with graceful handling of missing data
- **Scalable** for multiple data sources (Markdown, CMS, API)

---

## 1. Folder Structure

```
src/
├── app/
│   └── (marketing)/
│       └── blog/
│           ├── page.tsx                    # Blog listing page (Server Component)
│           └── [slug]/
│               ├── page.tsx                # Article detail page (Server Component)
│               └── ReadingProgressBar.tsx  # Client component for scroll tracking
│
├── components/
│   └── blog/
│       ├── index.ts                        # Central exports
│       │
│       │   # Listing Page Components
│       ├── BlogHeroSection.tsx             # Featured post hero
│       ├── BlogCategoryFilter.tsx          # Category filter bar
│       ├── BlogPostCard.tsx                # Post card for grids
│       ├── BlogAgencySection.tsx           # Agency posts section
│       ├── BlogHotelSection.tsx            # Hotel spotlights section
│       ├── BlogTipsSection.tsx             # Traveler tips section
│       ├── BlogNewsletter.tsx              # Newsletter subscription
│       │
│       │   # Article Detail Components
│       ├── ArticleBreadcrumbs.tsx          # Navigation breadcrumbs
│       ├── ArticleHero.tsx                 # Article hero with publisher
│       ├── ArticleContent.tsx              # Main content renderer
│       ├── ArticleSidebar.tsx              # Sidebar with CTA, related
│       └── ArticleComments.tsx             # Comments section
│
└── lib/
    └── data/
        └── blog/
            ├── index.ts                    # Central exports
            ├── types.ts                    # TypeScript interfaces (data contracts)
            ├── getBlogListing.ts           # Listing data access
            ├── getBlogArticle.ts           # Article data access
            └── dataSource.ts               # Data source factory
```

---

## 2. TypeScript Types / Interfaces (Data Contracts)

### Core Types

```typescript
// Publisher Types (E-E-A-T aligned)
type PublisherType = 'company' | 'agency' | 'hotel';

interface Publisher {
  id: string;
  name: string;
  type: PublisherType;
  avatarUrl: string;
  isVerified: boolean;
  yearsOfExperience?: number;
  specializations?: string[];
}

// Blog Categories
type BlogCategory = 
  | 'guide' 
  | 'hotels' 
  | 'adventure' 
  | 'culture' 
  | 'tips'
  | 'wildlife'
  | 'agencies';

// Search Intent (SEO Strategy)
type SearchIntent = 'informational' | 'commercial' | 'booking-ready';
```

### SEO Metadata

```typescript
interface SEOMetadata {
  title: string;           // ≤ 60 characters
  metaDescription: string; // ≤ 155 characters
  slug: string;            // URL-friendly
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  keywords: string[];
}
```

### Quick Facts (Above-the-fold)

```typescript
interface QuickFacts {
  location: string;
  bestSeason: string;
  difficultyOrType: string;
  idealFor: string;
  bookingType: string;
}
```

### Blog Post Card (Listing)

```typescript
interface BlogPostCard {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  featuredImage: string;
  category: BlogCategory;
  publisher: Publisher;
  publishedAt: string;
  readingTime: string;
  isFeatured?: boolean;
}
```

### Full Blog Article (Detail)

```typescript
interface BlogArticleFull {
  id: string;
  slug: string;
  
  // SEO
  seo: SEOMetadata;
  
  // Hero
  title: string;
  heroImage: string;
  category: BlogCategory;
  categoryLabel: string;
  readingTime: string;
  
  // Publisher
  publisher: Publisher;
  publishedAt: string;
  
  // Quick Facts (for guides)
  quickFacts?: QuickFacts;
  
  // Content
  introduction: string;
  sections: ContentSection[];
  
  // Sidebar
  mentionedPlaces: string[];
  relatedArticles: RelatedArticle[];
  ctaOffer?: CTAOffer;
  
  // Engagement
  comments: Comment[];
  commentCount: number;
  
  // SEO Extras
  faqs: FAQ[];
  structuredData: {
    article: ArticleStructuredData;
    faq?: FAQStructuredData;
    breadcrumb: BreadcrumbStructuredData;
  };
  
  // E-E-A-T
  disclaimer: string;
}
```

### Content Sections

```typescript
interface ContentSection {
  type: 'paragraph' | 'heading' | 'quote' | 'image-grid' | 'list';
  content: string;
  level?: 2 | 3;           // For headings
  cite?: string;           // For quotes
  images?: string[];       // For image-grid
  items?: string[];        // For lists
}
```

### FAQ (Voice Search & PAA Optimization)

```typescript
interface FAQ {
  question: string;
  answer: string;
}
```

---

## 3. Data Access Pattern (Empty-State Safe)

### Data Source Interface

```typescript
interface BlogListingDataSource {
  getFeaturedPost(): Promise<FeaturedPost | null>;
  getCategories(): Promise<CategoryFilter[]>;
  getAgencyPosts(limit?: number): Promise<BlogPostCard[]>;
  getHotelSpotlights(limit?: number): Promise<HotelSpotlightPost[]>;
  getTravelerTips(limit?: number): Promise<TravelerTipPost[]>;
}

interface BlogArticleDataSource {
  getArticleBySlug(slug: string): Promise<BlogArticleFull | null>;
  getRelatedArticles(articleId: string, limit?: number): Promise<RelatedArticle[]>;
  getComments(articleId: string): Promise<Comment[]>;
  getCTAOffer(articleId: string): Promise<CTAOffer | null>;
  getAllSlugs(): Promise<string[]>;
}
```

### Empty-State Safe Usage

```typescript
// Listing data access
const data = await getBlogListing();
// data is always defined, check individual fields:
if (data.agencyPosts.length === 0) {
  // Show empty state UI
}

// Article data access
const article = await getBlogArticle(slug);
if (!article) {
  notFound(); // Next.js 404
}
```

### Data Source Factory

```typescript
// Initialize once at app startup
import { initializeDataSource, createDataSourceFromEnv } from '@/lib/data/blog';

initializeDataSource(createDataSourceFromEnv());

// Or manually configure:
import { initializeDataSource, createDataSource } from '@/lib/data/blog';

initializeDataSource(createDataSource({
  type: 'markdown',
  contentPath: './content/blog',
}));
```

### Supported Data Sources

- **Markdown**: Local markdown files with frontmatter
- **CMS**: Strapi, Contentful, Sanity, etc.
- **API**: REST/GraphQL API endpoints
- **Database**: PostgreSQL with Prisma/Drizzle

---

## 4. Refactored Component Example

### BlogHeroSection (Empty-State Safe)

```typescript
/**
 * Blog Hero Section Component
 * 
 * Displays the featured post in a hero layout.
 * Handles empty state gracefully.
 */

import Link from 'next/link';
import type { FeaturedPost } from '@/lib/data/blog/types';

export interface BlogHeroSectionProps {
  /** Featured post data - null for empty state */
  post: FeaturedPost | null;
  /** Badge text for the featured label */
  badgeText?: string;
  /** CTA button text */
  ctaText?: string;
}

// Empty State Component
function BlogHeroEmpty() {
  return (
    <section className="mb-12">
      <div 
        className="relative min-h-[500px] flex flex-col justify-end p-6 md:p-12 rounded-xl overflow-hidden bg-slate-200"
        aria-label="No featured post available"
      >
        <div className="max-w-2xl space-y-4">
          <span className="inline-block px-3 py-1 bg-slate-400 text-white text-xs font-bold uppercase tracking-wider rounded">
            Coming Soon
          </span>
          <h2 className="text-slate-600 text-4xl md:text-6xl font-black leading-tight tracking-tight">
            Featured Stories Coming Soon
          </h2>
          <p className="text-slate-500 text-lg md:text-xl font-normal max-w-xl">
            Stay tuned for curated travel stories from our expert agencies and hotels.
          </p>
        </div>
      </div>
    </section>
  );
}

// Main Component
export function BlogHeroSection({
  post,
  badgeText = 'Featured Post',
  ctaText = 'Read Featured Post',
}: BlogHeroSectionProps) {
  // Handle empty state
  if (!post) {
    return <BlogHeroEmpty />;
  }

  return (
    <section className="mb-12">
      <div 
        className="relative min-h-[500px] flex flex-col justify-end p-6 md:p-12 rounded-xl overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.7) 100%), url("${post.heroImage}")`
        }}
      >
        <div className="max-w-2xl space-y-4">
          <span className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded">
            {badgeText}
          </span>
          <h1 className="text-white text-4xl md:text-6xl font-black leading-tight tracking-tight">
            {post.title}
          </h1>
          <p className="text-white/90 text-lg md:text-xl font-normal max-w-xl">
            {post.tagline}
          </p>
          <Link 
            href={`/blog/${post.slug}`}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:scale-105 transition-transform"
          >
            {ctaText}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
```

---

## 5. global.css Strategy Summary (Light Mode)

### Theme Variables

```css
:root {
  /* Primary Colors */
  --color-primary: #f97316; /* Orange-500 */
  --color-primary-dark: #ea580c; /* Orange-600 */
  --color-primary-light: #fed7aa; /* Orange-200 */
  --color-primary-lighter: #ffedd5; /* Orange-100 */
  --color-primary-lightest: #fff7ed; /* Orange-50 */
  
  /* Secondary Colors */
  --color-secondary: #3b82f6; /* Blue-500 */
  --color-secondary-dark: #2563eb; /* Blue-600 */
  --color-secondary-light: #93c5fd; /* Blue-300 */
  --color-secondary-lighter: #dbeafe; /* Blue-100 */
  
  /* Backgrounds */
  --background: #ffffff;
  --background-secondary: #f9fafb; /* Gray-50 */
  --background-tertiary: #f3f4f6; /* Gray-100 */
  --background-hover: #fafafa;
  
  /* Text Colors */
  --foreground: #111827; /* Gray-900 */
  --foreground-secondary: #6b7280; /* Gray-500 */
  --foreground-muted: #9ca3af; /* Gray-400 */
  --text-primary: #1f2937; /* Gray-800 */
  --text-secondary: #4b5563; /* Gray-600 */
  
  /* Borders */
  --border-light: #e5e7eb; /* Gray-200 */
  --border-medium: #d1d5db; /* Gray-300 */
  --border-dark: #9ca3af; /* Gray-400 */
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
  
  /* Spacing Scale */
  --spacing-xs: 0.5rem;
  --spacing-sm: 0.75rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  
  /* Border Radius */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-2xl: 1.5rem;
  --radius-full: 9999px;
  
  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-normal: 300ms ease;
  --transition-slow: 500ms ease;
  
  color-scheme: light;
}
```

### Responsive Breakpoints

The UI scales smoothly from mobile to 2K screens:

- **Mobile**: 320px - 639px
- **Tablet**: 640px - 1023px
- **Desktop**: 1024px - 1919px
- **Large Desktop**: 1920px+

### Key Responsive Patterns

```css
/* Container */
max-w-[1200px] mx-auto px-4 md:px-10

/* Grid Layouts */
grid-cols-1 lg:grid-cols-12 gap-12

/* Typography Scale */
text-4xl md:text-6xl font-black  /* H1 Hero */
text-2xl font-bold               /* H2 */
text-xl font-bold                /* H3 */
text-lg leading-relaxed          /* Body */
text-sm                          /* Small/Caption */

/* Spacing */
py-8 md:py-12      /* Section padding */
mb-12              /* Section margin */
space-y-6          /* Content spacing */
```

---

## 6. SEO Content Structure

### Required Content Hierarchy

```
H1: [Primary Keyword]: [Compelling Hook]

H2: Overview
H2: Best Time to Visit
  H3: Seasonal Breakdown
H2: How to Reach / Access
H2: Route, Stay & Experience Details
H2: Safety, Rules & Local Guidelines
H2: Budget, Costs & Planning Tips
H2: Verified Local Services
H2: FAQs (minimum 5 questions)
```

### SEO Metadata Requirements

- **Title Tag**: ≤ 60 characters
- **Meta Description**: ≤ 155 characters
- **URL Slug**: URL-friendly, includes primary keyword
- **OG Image**: 1200x630px, realistic photo, no text overlay

### E-E-A-T Signals

- Publisher verification badge
- Years of experience (for agencies)
- Specializations listed
- Disclaimer at end of article
- Last modified date

---

## 7. Implementation Checklist

### Phase 1: Data Layer
- [x] Create TypeScript interfaces
- [x] Implement data source factory
- [x] Add empty-state safe data access functions
- [x] Remove dummy data dependencies

### Phase 2: UI Components
- [x] BlogHeroSection with empty state
- [x] BlogCategoryFilter
- [x] BlogAgencySection
- [x] BlogHotelSection
- [x] BlogTipsSection
- [x] BlogNewsletter
- [x] ArticleHero
- [x] ArticleContent
- [x] ArticleSidebar
- [x] ArticleComments
- [x] ArticleBreadcrumbs

### Phase 3: Pages
- [x] Blog listing page (/blog)
- [x] Article detail page (/blog/[slug])
- [x] Dynamic metadata generation
- [x] Structured data (JSON-LD)

### Phase 4: Data Source Integration
- [ ] Implement MarkdownDataSource
- [ ] Implement CMSDataSource
- [ ] Implement APIDataSource
- [ ] Implement DatabaseDataSource

---

## 8. Environment Variables

```bash
# Data Source Configuration
BLOG_DATA_SOURCE=markdown  # Options: markdown, cms, api, database
BLOG_API_URL=https://api.example.com
BLOG_API_KEY=your_api_key
BLOG_CONTENT_PATH=./content/blog
BLOG_CACHE_TTL=300

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://devbhoomidarshan.com
```

---

## 9. Usage Example

### Creating a Blog Post

1. Create content using the SEO template in `docs/seo-content-template.md`
2. Save as Markdown file in `content/blog/[slug].md`
3. Include frontmatter with all required fields
4. Deploy to see the post live

### Connecting a CMS

1. Set environment variables:
   ```bash
   BLOG_DATA_SOURCE=cms
   BLOG_API_URL=https://your-cms.com/api
   BLOG_API_KEY=your_key
   ```

2. Implement CMSDataSource in `src/lib/data/blog/dataSource.ts`

3. Restart the application

---

## 10. Performance Considerations

- All data fetching happens server-side (Server Components)
- Parallel data fetching with `Promise.all()`
- Empty-state rendering prevents layout shift
- Images use Next.js Image component for optimization
- Structured data for SEO rich snippets
- Static generation for known slugs (`generateStaticParams`)
