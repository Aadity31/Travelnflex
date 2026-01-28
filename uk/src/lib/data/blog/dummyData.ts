/**
 * DUMMY DATA FOR BLOG SYSTEM
 * 
 * ⚠️ DELETE THIS FILE WHEN CONNECTING TO REAL DATA SOURCE
 * 
 * This file contains sample data to preview the blog UI.
 * Replace with actual data from your CMS, API, or Markdown files.
 */

import type {
  FeaturedPost,
  BlogPostCard,
  HotelSpotlightPost,
  TravelerTipPost,
  CategoryFilter,
  BlogArticleFull,
  Publisher,
  ContentSection,
  RelatedArticle,
  Comment,
  CTAOffer,
  FAQ,
} from './types';

// ============================================
// DUMMY PUBLISHERS
// ============================================

const dummyPublishers: Record<string, Publisher> = {
  himalayan: {
    id: 'pub-001',
    name: 'Himalayan Adventures',
    type: 'agency',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    isVerified: true,
    yearsOfExperience: 15,
    specializations: ['Trekking', 'River Rafting', 'Camping'],
  },
  gangesView: {
    id: 'pub-002',
    name: 'Ganges View Resort',
    type: 'hotel',
    avatarUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=100&h=100&fit=crop',
    isVerified: true,
    yearsOfExperience: 10,
    specializations: ['Luxury Stay', 'Yoga Retreats'],
  },
  devbhoomi: {
    id: 'pub-003',
    name: 'Devbhoomi Darshan',
    type: 'company',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop',
    isVerified: true,
  },
};

// ============================================
// DUMMY CATEGORIES
// ============================================

export const dummyCategories: CategoryFilter[] = [
  { slug: 'all', label: 'All Stories', icon: 'grid' },
  { slug: 'agencies', label: 'Agencies', icon: 'briefcase' },
  { slug: 'hotels', label: 'Hotels', icon: 'building' },
  { slug: 'tips', label: 'Owner Tips', icon: 'lightbulb' },
  { slug: 'adventure', label: 'Adventure', icon: 'mountain' },
  { slug: 'culture', label: 'Culture', icon: 'globe' },
];

// ============================================
// DUMMY FEATURED POST
// ============================================

export const dummyFeaturedPost: FeaturedPost = {
  id: 'featured-001',
  slug: 'river-rafting-rishikesh-complete-guide',
  title: 'River Rafting in Rishikesh: The Ultimate Adventure Guide',
  excerpt: 'Experience the thrill of white-water rafting on the sacred Ganges. Our comprehensive guide covers everything from rapids to safety.',
  featuredImage: 'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?w=1200&h=800&fit=crop',
  heroImage: 'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?w=1920&h=1080&fit=crop',
  tagline: 'Discover the best rafting stretches, safety tips, and verified operators for your Rishikesh adventure.',
  category: 'adventure',
  publisher: dummyPublishers.himalayan,
  publishedAt: '2024-01-15T10:00:00Z',
  readingTime: '8 min read',
  isFeatured: true,
};

// ============================================
// DUMMY AGENCY POSTS
// ============================================

export const dummyAgencyPosts: BlogPostCard[] = [
  {
    id: 'agency-001',
    slug: 'kedarnath-trek-guide',
    title: 'Kedarnath Trek: A Spiritual Journey Through the Himalayas',
    excerpt: 'Everything you need to know about the sacred Kedarnath trek, from preparation to reaching the ancient temple.',
    featuredImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&h=600&fit=crop',
    category: 'guide',
    publisher: dummyPublishers.himalayan,
    publishedAt: '2024-01-10T10:00:00Z',
    readingTime: '12 min read',
  },
  {
    id: 'agency-002',
    slug: 'valley-of-flowers-trek',
    title: 'Valley of Flowers: UNESCO World Heritage Trek',
    excerpt: 'Explore the stunning alpine meadows of Uttarakhand, home to over 600 species of flowering plants.',
    featuredImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop',
    category: 'adventure',
    publisher: dummyPublishers.himalayan,
    publishedAt: '2024-01-08T10:00:00Z',
    readingTime: '10 min read',
  },
  {
    id: 'agency-003',
    slug: 'haridwar-ganga-aarti-experience',
    title: 'Haridwar Ganga Aarti: A Complete Visitor Guide',
    excerpt: 'Witness the mesmerizing evening aarti ceremony at Har Ki Pauri ghat. Tips for the best experience.',
    featuredImage: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&h=600&fit=crop',
    category: 'culture',
    publisher: dummyPublishers.himalayan,
    publishedAt: '2024-01-05T10:00:00Z',
    readingTime: '6 min read',
  },
];

// ============================================
// DUMMY HOTEL SPOTLIGHTS
// ============================================

export const dummyHotelSpotlights: HotelSpotlightPost[] = [
  {
    id: 'hotel-001',
    slug: 'ganges-view-resort-rishikesh',
    title: 'Riverside Luxury in Rishikesh',
    description: 'Wake up to the sound of the Ganges at this eco-friendly resort offering yoga retreats and adventure packages.',
    hotelName: 'Ganges View Resort',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop',
    category: 'hotels',
  },
  {
    id: 'hotel-002',
    slug: 'himalayan-retreat-mussoorie',
    title: 'Colonial Charm in the Queen of Hills',
    description: 'Experience the heritage of Mussoorie at this restored colonial-era property with panoramic mountain views.',
    hotelName: 'The Himalayan Retreat',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
    category: 'hotels',
  },
];

// ============================================
// DUMMY TRAVELER TIPS
// ============================================

export const dummyTravelerTips: TravelerTipPost[] = [
  {
    id: 'tip-001',
    slug: 'packing-guide-uttarakhand-trek',
    title: 'Essential Packing List for Uttarakhand Treks',
    image: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=600&h=600&fit=crop',
    readingTime: '5 min read',
  },
  {
    id: 'tip-002',
    slug: 'best-time-visit-uttarakhand',
    title: 'Best Time to Visit Uttarakhand: Season Guide',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop',
    readingTime: '4 min read',
  },
  {
    id: 'tip-003',
    slug: 'budget-travel-tips-devbhoomi',
    title: 'Budget Travel Tips for Devbhoomi',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=600&fit=crop',
    readingTime: '6 min read',
  },
  {
    id: 'tip-004',
    slug: 'solo-travel-safety-uttarakhand',
    title: 'Solo Travel Safety Tips for Uttarakhand',
    image: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=600&h=600&fit=crop',
    readingTime: '7 min read',
  },
];

// ============================================
// DUMMY FULL ARTICLE
// ============================================

const dummyArticleSections: ContentSection[] = [
  {
    type: 'heading',
    content: 'Overview',
    level: 2,
  },
  {
    type: 'paragraph',
    content: 'River rafting in Rishikesh offers an exhilarating experience on the sacred Ganges River. The stretch from Shivpuri to Rishikesh features rapids ranging from beginner-friendly Grade I to challenging Grade IV, making it suitable for all skill levels.',
  },
  {
    type: 'paragraph',
    content: 'The activity is regulated by the Uttarakhand Tourism Department, ensuring safety standards are maintained across all operators. With crystal-clear waters and stunning Himalayan scenery, this is one of India\'s premier adventure destinations.',
  },
  {
    type: 'heading',
    content: 'Best Time to Visit',
    level: 2,
  },
  {
    type: 'paragraph',
    content: 'The rafting season in Rishikesh runs from September to June. Each period offers a different experience based on water levels and weather conditions.',
  },
  {
    type: 'heading',
    content: 'Seasonal Breakdown',
    level: 3,
  },
  {
    type: 'list',
    content: '',
    items: [
      'September - November: Post-monsoon, medium water levels, pleasant weather',
      'December - February: Winter season, lower water levels, cold mornings',
      'March - June: Peak season, optimal water levels, warm weather',
    ],
  },
  {
    type: 'quote',
    content: 'The Ganges in Rishikesh offers some of the best white-water rafting in Asia. The combination of sacred waters and thrilling rapids creates an unforgettable experience.',
    cite: 'Rajesh Kumar, Senior Rafting Guide',
  },
  {
    type: 'heading',
    content: 'Popular Rafting Stretches',
    level: 2,
  },
  {
    type: 'paragraph',
    content: 'There are three main rafting stretches in Rishikesh, each offering different levels of difficulty and duration.',
  },
  {
    type: 'image-grid',
    content: '',
    images: [
      'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&h=400&fit=crop',
    ],
  },
  {
    type: 'heading',
    content: 'Safety Guidelines',
    level: 2,
  },
  {
    type: 'paragraph',
    content: 'All rafting operators must provide certified life jackets and helmets, have trained rescue kayakers, carry first aid equipment, and brief participants on safety procedures before departure.',
  },
];

const dummyFAQs: FAQ[] = [
  {
    question: 'What is the best time for river rafting in Rishikesh?',
    answer: 'The best time is September to June, with March to May being peak season for optimal water levels and weather conditions.',
  },
  {
    question: 'How much does rafting cost in Rishikesh?',
    answer: 'Rafting costs range from ₹600-2,500 per person depending on the stretch length, including equipment, guide, and transportation.',
  },
  {
    question: 'Is river rafting in Rishikesh safe for beginners?',
    answer: 'Yes, the 9 km Brahmapuri stretch has Grade I-II rapids suitable for first-timers with no prior experience required.',
  },
  {
    question: 'Do I need to know swimming for rafting?',
    answer: 'No, swimming is not required. Life jackets are provided and guides are trained in rescue procedures.',
  },
  {
    question: 'What should I bring for rafting?',
    answer: 'Bring quick-dry clothes, secure footwear, sunscreen, and a change of clothes. Valuables should be left at your accommodation.',
  },
];

const dummyRelatedArticles: RelatedArticle[] = [
  {
    id: 'related-001',
    slug: 'bungee-jumping-rishikesh',
    title: 'Bungee Jumping in Rishikesh: Complete Guide',
    category: 'adventure',
    author: 'Himalayan Adventures',
    image: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=200&h=200&fit=crop',
  },
  {
    id: 'related-002',
    slug: 'camping-by-ganges',
    title: 'Best Camping Sites Along the Ganges',
    category: 'adventure',
    author: 'Devbhoomi Darshan',
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=200&h=200&fit=crop',
  },
];

const dummyComments: Comment[] = [
  {
    id: 'comment-001',
    author: {
      name: 'Priya Sharma',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    },
    content: 'This guide was incredibly helpful! We did the 16km stretch last month and it was amazing. The safety briefing was thorough and the guides were very professional.',
    createdAt: '2024-01-20T14:30:00Z',
    helpfulCount: 12,
  },
  {
    id: 'comment-002',
    author: {
      name: 'Amit Verma',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    },
    content: 'Great information about the different stretches. I was confused about which one to choose for my family trip. The 9km stretch sounds perfect for us!',
    createdAt: '2024-01-18T09:15:00Z',
    helpfulCount: 8,
  },
];

const dummyCTAOffer: CTAOffer = {
  badge: 'Exclusive Offer',
  title: 'Book River Rafting Package',
  description: 'Join our certified guides for an unforgettable rafting experience. All-inclusive package with camping.',
  price: 2499,
  originalPrice: 2999,
  ctaText: 'Check Availability',
  ctaLink: '/activities?category=rafting&location=rishikesh',
  disclaimer: 'Free cancellation up to 48 hours before',
};

export const dummyFullArticle: BlogArticleFull = {
  id: 'article-001',
  slug: 'river-rafting-rishikesh-complete-guide',
  
  seo: {
    title: 'River Rafting in Rishikesh - Complete Guide 2024 | Devbhoomi Darshan',
    metaDescription: 'Discover the best river rafting in Rishikesh with our complete guide. Expert tips, safety info, and verified operators. Plan your adventure today.',
    slug: 'river-rafting-rishikesh-complete-guide',
    canonicalUrl: 'https://devbhoomidarshan.com/blog/river-rafting-rishikesh-complete-guide',
    ogTitle: 'River Rafting in Rishikesh - Complete Guide 2024',
    ogDescription: 'Discover the best river rafting in Rishikesh with our complete guide. Expert tips, safety info, and verified operators.',
    ogImage: 'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?w=1200&h=630&fit=crop',
    keywords: ['river rafting rishikesh', 'rafting ganges', 'rishikesh adventure', 'white water rafting india'],
  },
  
  title: 'River Rafting in Rishikesh: The Ultimate Adventure Guide',
  heroImage: 'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?w=1920&h=1080&fit=crop',
  category: 'adventure',
  categoryLabel: 'Adventure Guide',
  readingTime: '8 min read',
  
  publisher: dummyPublishers.himalayan,
  publishedAt: '2024-01-15T10:00:00Z',
  
  quickFacts: {
    location: 'Rishikesh, Tehri Garhwal, Uttarakhand',
    bestSeason: 'September to June',
    difficultyOrType: 'Grade I to Grade IV rapids',
    idealFor: 'Adventure seekers, groups, families',
    bookingType: 'Through verified agencies',
  },
  
  introduction: 'Rishikesh is widely regarded as one of India\'s premier destinations for white-water rafting. This comprehensive guide covers everything from choosing the right rapids to booking with verified local operators, ensuring you have the adventure of a lifetime on the sacred Ganges.',
  
  sections: dummyArticleSections,
  
  mentionedPlaces: ['Rishikesh', 'Shivpuri', 'Brahmapuri', 'Marine Drive', 'Ganges River'],
  relatedArticles: dummyRelatedArticles,
  ctaOffer: dummyCTAOffer,
  
  comments: dummyComments,
  commentCount: 2,
  
  breadcrumbs: [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: 'Adventure', href: '/blog?category=adventure' },
  ],
  
  searchIntent: 'informational',
  primaryKeyword: 'river rafting rishikesh',
  secondaryKeywords: ['rafting ganges', 'rishikesh adventure', 'white water rafting'],
  
  faqs: dummyFAQs,
  
  structuredData: {
    article: {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: 'River Rafting in Rishikesh: The Ultimate Adventure Guide',
      description: 'Discover the best river rafting in Rishikesh with our complete guide.',
      image: ['https://images.unsplash.com/photo-1530866495561-507c9faab2ed?w=1920&h=1080&fit=crop'],
      datePublished: '2024-01-15T10:00:00Z',
      author: {
        '@type': 'Organization',
        name: 'Himalayan Adventures',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Devbhoomi Darshan',
        logo: {
          '@type': 'ImageObject',
          url: 'https://devbhoomidarshan.com/logo.png',
        },
      },
    },
    breadcrumb: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://devbhoomidarshan.com/' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://devbhoomidarshan.com/blog' },
        { '@type': 'ListItem', position: 3, name: 'Adventure', item: 'https://devbhoomidarshan.com/blog?category=adventure' },
      ],
    },
  },
  
  disclaimer: 'Services are provided by independent local agencies or hotels. Travelers are advised to verify details before booking.',
  
  lastModified: '2024-01-20T10:00:00Z',
};

// ============================================
// DUMMY DATA SOURCE IMPLEMENTATION
// ============================================

import type { BlogListingDataSource } from './getBlogListing';
import type { BlogArticleDataSource } from './getBlogArticle';

export class DummyBlogDataSource implements BlogListingDataSource, BlogArticleDataSource {
  async getFeaturedPost(): Promise<FeaturedPost | null> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return dummyFeaturedPost;
  }

  async getCategories(): Promise<CategoryFilter[]> {
    await new Promise(resolve => setTimeout(resolve, 50));
    return dummyCategories;
  }

  async getAgencyPosts(limit = 3): Promise<BlogPostCard[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return dummyAgencyPosts.slice(0, limit);
  }

  async getHotelSpotlights(limit = 2): Promise<HotelSpotlightPost[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return dummyHotelSpotlights.slice(0, limit);
  }

  async getTravelerTips(limit = 4): Promise<TravelerTipPost[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return dummyTravelerTips.slice(0, limit);
  }

  async getArticleBySlug(slug: string): Promise<BlogArticleFull | null> {
    await new Promise(resolve => setTimeout(resolve, 150));
    
    // Return the dummy article for any slug (for demo purposes)
    if (slug === dummyFullArticle.slug || slug === 'river-rafting-rishikesh-complete-guide') {
      return dummyFullArticle;
    }
    
    // For other slugs, return a modified version
    return {
      ...dummyFullArticle,
      slug,
      title: `Article: ${slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
    };
  }

  async getRelatedArticles(articleId: string, limit = 3): Promise<RelatedArticle[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return dummyRelatedArticles.slice(0, limit);
  }

  async getComments(articleId: string): Promise<Comment[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return dummyComments;
  }

  async getCTAOffer(articleId: string): Promise<CTAOffer | null> {
    await new Promise(resolve => setTimeout(resolve, 50));
    return dummyCTAOffer;
  }

  async getAllSlugs(): Promise<string[]> {
    await new Promise(resolve => setTimeout(resolve, 50));
    return [
      dummyFullArticle.slug,
      ...dummyAgencyPosts.map(p => p.slug),
      ...dummyHotelSpotlights.map(p => p.slug),
      ...dummyTravelerTips.map(p => p.slug),
    ];
  }
}

// Export singleton instance
export const dummyDataSource = new DummyBlogDataSource();
