# Blog System Architecture

## Overview

This document describes the data-driven blog architecture for the Devbhoomi Darshan travel marketplace. The system is designed to be:

- **SEO-optimized** for Google, Bing, and AI-powered search
- **E-E-A-T compliant** (Experience, Expertise, Authoritativeness, Trustworthiness)
- **Data-driven** with no hardcoded content
- **Empty-state safe** with graceful handling of missing data
- **Scalable** for multiple data sources (Markdown, CMS, API)

---

## Folder Structure

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
            ├── types.ts                    # TypeScript interfaces
            ├── getBlogListing.ts           # Listing data access
            └── getBlogArticle.ts           # Article data access
```

---

## TypeScript Interfaces (Data Contracts)

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

---

## Data Access Pattern

### Empty-State Safe Design

All data access functions return safe defaults when data is unavailable:

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

### Data Source Interface

Implement this interface for different data sources:

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
}
```

### Usage Example

```typescript
// In page.tsx
import { getBlogListing } from '@/lib/data/blog';
import { MyMarkdownDataSource } from '@/lib/data/sources/markdown';

export default async function BlogPage() {
  const dataSource = new MyMarkdownDataSource();
  const data = await getBlogListing({ dataSource });
  
  return <BlogContent data={data} />;
}
```

---

## Component Architecture

### Server vs Client Components

| Component | Type | Reason |
|-----------|------|--------|
| `page.tsx` | Server | Data fetching, SEO metadata |
| `BlogHeroSection` | Server | Static rendering |
| `BlogCategoryFilter` | Client | Interactive state |
| `BlogNewsletter` | Client | Form handling |
| `ArticleComments` | Client | Form handling |
| `ReadingProgressBar` | Client | Scroll events |

### Empty State Handling

Each component handles empty data gracefully:

```tsx
// Example: BlogAgencySection
function BlogAgencySection({ posts }) {
  if (posts.length === 0) {
    return <AgencySectionEmpty />;
  }
  
  return (
    <section>
      {posts.map(post => <BlogPostCard key={post.id} post={post} />)}
    </section>
  );
}
```

---

## global.css Strategy

### Theme Variables

```css
:root {
  /* Typography Scale */
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;
  --font-size-5xl: 3rem;
  --font-size-6xl: 3.75rem;
  
  /* Blog Layout */
  --blog-content-max-width: 1200px;
  --blog-article-max-width: 800px;
  --blog-sidebar-width: 320px;
}
```

### Responsive Breakpoints

| Breakpoint | Range | Target |
|------------|-------|--------|
| Mobile | 320px - 639px | Phones |
| Tablet | 640px - 1023px | Tablets |
| Desktop | 1024px - 1535px | Laptops |
| 2K+ | 1536px+ | Large monitors |

### Utility Classes

```css
.blog-container    /* Responsive container */
.blog-title        /* Responsive title */
.blog-subtitle     /* Responsive subtitle */
.blog-body         /* Responsive body text */
.blog-grid-3       /* 3-column responsive grid */
.blog-grid-4       /* 4-column responsive grid */
.blog-card         /* Card with hover effects */
.blog-badge        /* Category badges */
.blog-quote        /* Pull quote styling */
```

---

## SEO Implementation

### Metadata Generation

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const article = await getBlogArticle(params.slug);
  
  return {
    title: article.seo.title,
    description: article.seo.metaDescription,
    openGraph: {
      title: article.seo.ogTitle,
      description: article.seo.ogDescription,
      images: [article.seo.ogImage],
      type: 'article',
    },
    alternates: {
      canonical: article.seo.canonicalUrl,
    },
  };
}
```

### Structured Data

Three types of structured data are automatically generated:

1. **Article** - For rich snippets in search results
2. **FAQ** - For People Also Ask and voice search
3. **Breadcrumb** - For navigation in search results

---

## Implementation Checklist

- [ ] Implement data source for your backend (Markdown/CMS/API)
- [ ] Create content following SEO template
- [ ] Test empty states for all sections
- [ ] Verify structured data with Google Rich Results Test
- [ ] Test responsive layouts on all breakpoints
- [ ] Implement newsletter API endpoint
- [ ] Implement comments API endpoint
